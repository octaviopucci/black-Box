import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import {
  BLOB_ACCESS,
  blobAuthOptions,
  blobConfigured,
  flushToBlob,
  hydrateFromBlob,
  IDENTITY_BLOB_PATH,
  LEGACY_BLOB_PATH,
  OPERATIONAL_BLOB_PATH,
  probeBlobPaths,
  type BlobEtags,
} from "./blob-persistence";
import {
  flushToRedis,
  hydrateFromRedis,
  probeRedis,
  redisConfigured,
  redisDiagnostics,
  redisHasStoreData,
} from "./redis-persistence";
import { issueAdminSessionToken, parseAdminSessionToken } from "./admin-session-token";
import { hashPassword, id, sessionToken, verifyPassword } from "./crypto-utils";
import { emit } from "./events";
import { lineTotal } from "./order-math";
import { PRODUCT_IMAGES, productImageByName } from "./product-images";
import { provisionEstablishment, type RegisterInput } from "./provision";
import { buildDemoStore } from "./seed";
import type {
  ClosingRequest,
  Command,
  Category,
  Establishment,
  MesaFlowStore,
  Notification,
  Order,
  OrderItem,
  OrderStatus,
  RodizioRound,
  Session,
  StoreEvent,
  Table,
  TableStatus,
  User,
  Product,
  ProductAddon,
  ProductAvailability,
  ProductVariant,
  OperationMode,
} from "./types";
import { appendAuditEvent } from "./audit-log";
import { dashboardAnalytics } from "./dashboard-analytics";
import { purgeStaleData } from "./data-retention";
import { rejectPredictableDemoQrInProduction } from "./demo-qr";
import { isOperationMode } from "./operation-modes";
import { validatePasswordStrength } from "./password-policy";
import {
  signupInviteRequiredMessage,
  validateSignupInvite,
} from "./signup-invite";
import { consentRequiredMessage, validatePrivacyConsent } from "./privacy-policy";
import { isProductionEnv } from "./production-secrets";

const DATA_PATH =
  process.env.MESAFLOW_DATA ||
  (process.env.VERCEL ? "/tmp/mesaflow-store.json" : join(process.cwd(), "data", "store.json"));

let cache: MesaFlowStore | null = null;
let operationalDirty = false;
let identityDirty = false;
let blobEtags: BlobEtags = {};
let runtimeOidcToken: string | undefined;
let lastBlobError: string | undefined;
let lastRedisError: string | undefined;
let lastPersistSource: "blob" | "redis" | "disk-only" | "none" = "none";

export interface PersistResult {
  disk: boolean;
  blob: boolean;
  blobError?: string;
  redis?: boolean;
  redisError?: string;
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function emptyStore(): MesaFlowStore {
  return {
    establishments: {},
    users: {},
    sessions: {},
    platformUsers: {},
    clientSessions: {},
    otpChallenges: {},
    guestPhoneSecrets: {},
    revokedGuestTokenHashes: {},
    sectors: {},
    categories: {},
    products: {},
    tables: {},
    commands: {},
    orders: {},
    guestParticipations: {},
    rodizios: {},
    rodizioRounds: {},
    notifications: {},
    closingRequests: {},
    orderItemSplits: {},
    payments: {},
    integrationConnections: {},
    auditEvents: {},
    orderCounter: {},
  };
}

export { hashPassword } from "./crypto-utils";

function migrateProductImages(store: MesaFlowStore, markBlobDirty = true) {
  let changed = false;
  for (const product of Object.values(store.products)) {
    const canonical = PRODUCT_IMAGES[product.id];
    const next = canonical ?? productImageByName(product.name);
    const stale =
      !product.image ||
      product.image.includes("picsum.photos") ||
      (product.id === "p_cappuccino" && product.image.includes("1593508512255"));
    if (stale && next && product.image !== next) {
      product.image = next;
      changed = true;
    }
  }
  if (!changed) return;
  if (markBlobDirty) {
    persist();
    return;
  }
  writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
}

function load(): MesaFlowStore {
  if (cache) return cache;
  mkdirSync(dirname(DATA_PATH), { recursive: true });
  if (existsSync(DATA_PATH)) {
    try {
      cache = { ...emptyStore(), ...JSON.parse(readFileSync(DATA_PATH, "utf8")) };
      migrateOperationalCollections(cache!);
      migrateProductImages(cache!);
      return cache!;
    } catch {
      /* fallthrough */
    }
  }
  if (isProductionEnv() && process.env.MESAFLOW_ALLOW_DEMO_SEED !== "1") {
    cache = emptyStore();
    migrateOperationalCollections(cache);
    return cache;
  }
  cache = buildDemoStore();
  persist();
  return cache;
}

function runRetentionPurge(store: MesaFlowStore) {
  const stats = purgeStaleData(store);
  const total = Object.values(stats).reduce((sum, n) => sum + n, 0);
  if (total > 0) saveStore(store);
}

function persist(markIdentity = true) {
  if (!cache) return;
  writeFileSync(DATA_PATH, JSON.stringify(cache, null, 2));
  operationalDirty = true;
  if (markIdentity) identityDirty = true;
}

function migrateOperationalCollections(store: MesaFlowStore) {
  store.closingRequests ||= {};
  store.orderItemSplits ||= {};
  store.payments ||= {};
  store.integrationConnections ||= {};
  store.auditEvents ||= {};
  store.revokedGuestTokenHashes ||= {};
  store.clientSessions ||= {};
  store.otpChallenges ||= {};
  store.guestPhoneSecrets ||= {};
  store.platformUsers ||= {};
  for (const establishment of Object.values(store.establishments)) {
    if (!establishment.plan) establishment.plan = "essencial";
    if (!establishment.platformStatus) establishment.platformStatus = "active";
    if (!establishment.planStartedAt) establishment.planStartedAt = establishment.createdAt;
  }
}

function migrateLegacyGuestParticipations(store: MesaFlowStore) {
  let changed = false;
  for (const order of Object.values(store.orders)) {
    if (order.guestParticipationId) continue;
    order.guestParticipationId = `gp_legacy_${order.commandId}`;
    changed = true;
  }
  if (changed) persist(false);
}

let productionPlatformSeeded = false;

export function getStore() {
  const store = load();
  if (!productionPlatformSeeded && isProductionEnv()) {
    productionPlatformSeeded = true;
    const { ensurePlatformOwnerSeed } = require("./platform-store") as typeof import("./platform-store");
    ensurePlatformOwnerSeed();
  }
  return store;
}

export function saveStore(next: MesaFlowStore) {
  cache = next;
  persist();
}

function blobReadWriteToken() {
  return process.env.MESAFLOW_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
}

function blobStoreId() {
  return process.env.MESAFLOW_BLOB_STORE_ID || process.env.BLOB_STORE_ID;
}

export function blobDiagnostics(hasOidcHeader = false) {
  const blobEnvKeys = Object.keys(process.env).filter(
    (key) => key.includes("BLOB") || key.includes("OIDC"),
  );
  const auth = blobAuthOptions(runtimeOidcToken);
  return {
    configured: blobConfigured(runtimeOidcToken),
    hasToken: Boolean(blobReadWriteToken()),
    hasStoreId: Boolean(blobStoreId()),
    hasOidc: Boolean(runtimeOidcToken || process.env.VERCEL_OIDC_TOKEN),
    hasOidcHeader,
    onVercel: Boolean(process.env.VERCEL),
    vercelProjectId: process.env.VERCEL_PROJECT_ID,
    vercelEnv: process.env.VERCEL_ENV,
    blobEnvKeys,
    paths: {
      legacy: LEGACY_BLOB_PATH,
      operational: OPERATIONAL_BLOB_PATH,
      identity: IDENTITY_BLOB_PATH,
    },
    access: BLOB_ACCESS,
    lastError: lastBlobError,
    etags: blobEtags,
    redis: {
      ...redisDiagnostics(),
      lastError: lastRedisError,
    },
  };
}

/** Testa leitura real no Blob (OIDC automático na Vercel). */
export async function probeBlobStorage(): Promise<{ ok: boolean; error?: string }> {
  return probeBlobPaths(runtimeOidcToken);
}

export function setPersistentStoreOidcToken(token: string | undefined) {
  runtimeOidcToken = token?.trim() || undefined;
}

export async function hydratePersistentStore() {
  if (!process.env.VERCEL) {
    const store = getStore();
    migrateLegacyGuestParticipations(store);
    runRetentionPurge(store);
    return;
  }

  mkdirSync(dirname(DATA_PATH), { recursive: true });
  lastBlobError = undefined;
  lastRedisError = undefined;

  if (redisConfigured()) {
    try {
      const hydrated = await hydrateFromRedis();
      if (hydrated) {
        cache = hydrated.store;
        blobEtags = hydrated.etags;
        operationalDirty = false;
        identityDirty = false;
        writeFileSync(DATA_PATH, JSON.stringify(cache, null, 2));
        migrateProductImages(cache, false);
        migrateLegacyGuestParticipations(cache);
        runRetentionPurge(cache);
        lastPersistSource = "redis";
        return;
      }
    } catch (error) {
      lastRedisError = error instanceof Error ? error.message : "redis hydrate failed";
      console.warn("[mesaflow] redis hydrate failed", error);
    }
  }

  if (blobConfigured(runtimeOidcToken)) {
    try {
      const hydrated = await hydrateFromBlob(runtimeOidcToken);
      if (hydrated) {
        cache = hydrated.store;
        blobEtags = hydrated.etags;
        operationalDirty = hydrated.migratedFromLegacy;
        identityDirty = hydrated.migratedFromLegacy;
        writeFileSync(DATA_PATH, JSON.stringify(cache, null, 2));
        migrateProductImages(cache, false);
        migrateLegacyGuestParticipations(cache);
        runRetentionPurge(cache);
        lastPersistSource = "blob";
        return;
      }
    } catch (error) {
      lastBlobError = error instanceof Error ? error.message : "blob hydrate failed";
      console.warn("[mesaflow] blob hydrate failed", error);
    }
  } else {
    lastBlobError = "Blob not configured (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN)";
  }

  cache = null;
  const store = getStore();
  migrateLegacyGuestParticipations(store);
  runRetentionPurge(store);
}

export async function flushPersistentStore(): Promise<PersistResult> {
  if (!cache) return { disk: false, blob: false };
  if (!process.env.VERCEL || (!operationalDirty && !identityDirty)) {
    return { disk: true, blob: false };
  }

  if (redisConfigured()) {
    const redisResult = await flushToRedis({
      store: cache,
      etags: blobEtags,
      flushOperational: true,
      flushIdentity: true,
    });
    if (redisResult.ok) {
      operationalDirty = false;
      identityDirty = false;
      lastRedisError = undefined;
      lastPersistSource = "redis";
      return { disk: true, blob: false, redis: true };
    }
    lastRedisError = redisResult.error || "redis persist failed";
    console.warn("[mesaflow] redis persist failed", lastRedisError);
  }

  if (blobConfigured(runtimeOidcToken)) {
    const flushed = await flushToBlob({
      store: cache,
      etags: blobEtags,
      flushOperational: operationalDirty,
      flushIdentity: identityDirty,
      runtimeOidcToken,
    });

    const operationalOk = !operationalDirty || flushed.operational?.ok === true;
    const identityOk = !identityDirty || flushed.identity?.ok === true;
    const blobOk = operationalOk && identityOk;
    const blobError = flushed.operational?.error || flushed.identity?.error;

    if (blobOk) {
      if (flushed.operational?.etag) blobEtags.operational = flushed.operational.etag;
      if (flushed.identity?.etag) blobEtags.identity = flushed.identity.etag;
      operationalDirty = false;
      identityDirty = false;
      lastBlobError = undefined;
      lastPersistSource = "blob";
      return { disk: true, blob: true, redis: false, redisError: lastRedisError };
    }

    lastBlobError = blobError || "blob persist failed";
    console.warn("[mesaflow] blob persist failed", lastBlobError);
  } else {
    lastBlobError = "Blob not configured (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN)";
  }

  return {
    disk: true,
    blob: false,
    blobError: lastBlobError,
    redis: false,
    redisError: lastRedisError,
  };
}

export async function probeRedisStorage() {
  const ping = await probeRedis();
  if (!ping.ok) return ping;
  const hasData = await redisHasStoreData();
  return { ok: true, hasData };
}

export async function sharedPersistenceReady() {
  if (!process.env.VERCEL) return lastPersistSource === "disk-only";
  if (lastPersistSource === "blob" || lastPersistSource === "redis") return true;
  if (redisConfigured()) {
    const probe = await probeRedisStorage();
    return probe.ok === true;
  }
  return false;
}

export function persistStatus() {
  const redisReady = redisConfigured();
  return {
    source: lastPersistSource,
    blobError: lastBlobError,
    redisConfigured: redisReady,
    redisError: lastRedisError,
    shared:
      lastPersistSource === "blob" ||
      lastPersistSource === "redis" ||
      (!process.env.VERCEL && lastPersistSource === "disk-only"),
    warning:
      process.env.VERCEL &&
      lastPersistSource !== "blob" &&
      lastPersistSource !== "redis" &&
      !redisReady
        ? "Pedidos não estão sendo compartilhados entre instâncias. Conecte Upstash Redis ou um Blob store novo com BLOB_READ_WRITE_TOKEN."
        : undefined,
  };
}

function notify(
  establishmentId: string,
  type: string,
  title: string,
  body: string,
  extra?: Pick<Notification, "commandId" | "tableId" | "actionUrl" | "metadata">,
) {
  const store = getStore();
  const n: Notification = {
    id: id("ntf_"),
    establishmentId,
    type,
    title,
    body,
    read: false,
    createdAt: new Date().toISOString(),
    ...extra,
  };
  store.notifications[n.id] = n;
  saveStore(store);
  emit({ type: "notification", notificationId: n.id, establishmentId });
}

export function findEstablishmentBySlug(slug: string) {
  const store = getStore();
  return Object.values(store.establishments).find((e) => e.slug === slug) || null;
}

export function findUserByEmail(email: string) {
  const store = getStore();
  return (
    Object.values(store.users).find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.active,
    ) || null
  );
}

function purgeExpiredSessions(store: MesaFlowStore) {
  const now = Date.now();
  for (const [token, session] of Object.entries(store.sessions)) {
    if (new Date(session.expiresAt).getTime() <= now) {
      delete store.sessions[token];
    }
  }
}

export function createSession(user: User): Session {
  const now = new Date();
  const token = issueAdminSessionToken(user.id, user.establishmentId, SESSION_TTL_MS);
  return {
    token,
    userId: user.id,
    establishmentId: user.establishmentId,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString(),
  };
}

export function validateSession(token: string | null | undefined) {
  if (!token) return null;
  const store = getStore();

  const signed = parseAdminSessionToken(token);
  if (signed) {
    const user = store.users[signed.userId];
    const establishment = store.establishments[signed.establishmentId];
    if (!user?.active || !establishment) return null;
    const session: Session = {
      token,
      userId: user.id,
      establishmentId: establishment.id,
      createdAt: new Date(signed.exp - SESSION_TTL_MS).toISOString(),
      expiresAt: new Date(signed.exp).toISOString(),
    };
    return { session, user, establishment };
  }

  purgeExpiredSessions(store);
  const session = store.sessions[token];
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    delete store.sessions[token];
    saveStore(store);
    return null;
  }
  const user = store.users[session.userId];
  const establishment = store.establishments[session.establishmentId];
  if (!user?.active || !establishment) return null;
  return { session, user, establishment };
}

export function registerEstablishment(
  input: Omit<RegisterInput, "passwordHash"> & {
    password: string;
    privacyConsent?: unknown;
    inviteCode?: string;
  },
) {
  const store = getStore();
  const consent = validatePrivacyConsent(input.privacyConsent);
  if (!consent) return { error: consentRequiredMessage() };

  if (!validateSignupInvite(input.inviteCode)) {
    return { error: signupInviteRequiredMessage() };
  }

  const email = input.email.toLowerCase().trim();
  const passwordError = validatePasswordStrength(input.password || "");
  if (!email || passwordError) {
    return { error: passwordError || "Preencha todos os campos." };
  }
  if (findUserByEmail(email)) {
    return { error: "Este e-mail já está cadastrado." };
  }
  if (!input.businessName.trim() || !input.ownerName.trim()) {
    return { error: "Nome do negócio e responsável são obrigatórios." };
  }

  const { establishment, user } = provisionEstablishment(store, {
    businessName: input.businessName.trim(),
    ownerName: input.ownerName.trim(),
    email,
    passwordHash: hashPassword(input.password),
    businessType: input.businessType,
    operationMode: input.operationMode,
    tableCount: input.tableCount,
  });
  user.privacyConsent = consent;
  store.users[user.id] = user;
  appendAuditEvent(store, {
    establishmentId: establishment.id,
    type: "merchant.registered",
    actorType: "STAFF",
    actorUserId: user.id,
    targetType: "establishment",
    targetId: establishment.id,
    metadata: { source: "signup" },
  });
  saveStore(store);
  const session = createSession(user);
  return { user, establishment, session };
}

export function changeUserPassword(
  userId: string,
  establishmentId: string,
  currentPassword: string,
  newPassword: string,
) {
  const store = getStore();
  const user = store.users[userId];
  if (!user || user.establishmentId !== establishmentId || !user.active) {
    return { error: "Usuário não encontrado.", status: 404 };
  }
  if (!verifyPassword(currentPassword, user.passwordHash)) {
    return { error: "Senha atual incorreta.", status: 401 };
  }
  const passwordError = validatePasswordStrength(newPassword);
  if (passwordError) return { error: passwordError, status: 400 };

  user.passwordHash = hashPassword(newPassword);
  store.users[user.id] = user;
  appendAuditEvent(store, {
    establishmentId,
    type: "staff.password_changed",
    actorType: "STAFF",
    actorUserId: user.id,
    targetType: "user",
    targetId: user.id,
    metadata: {},
  });
  saveStore(store);
  return { value: { changedAt: new Date().toISOString() } };
}

export function loginUser(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-mail ou senha inválidos." };
  }
  const store = getStore();
  if (!user.passwordHash.startsWith("$2")) {
    user.passwordHash = hashPassword(password);
    store.users[user.id] = user;
  }
  const establishment = store.establishments[user.establishmentId];
  if (!establishment) return { error: "Estabelecimento não encontrado." };
  const platformStatus = establishment.platformStatus ?? "active";
  if (platformStatus !== "active") {
    return {
      error:
        platformStatus === "suspended"
          ? "Conta suspensa pela operação NA MESA. Entre em contato com o suporte."
          : "Conta inativa. Entre em contato com o suporte NA MESA.",
    };
  }
  user.lastLoginAt = new Date().toISOString();
  store.users[user.id] = user;
  appendAuditEvent(store, {
    establishmentId: establishment.id,
    type: "staff.login",
    actorType: "STAFF",
    actorUserId: user.id,
    targetType: "user",
    targetId: user.id,
    metadata: { role: user.role },
  });
  saveStore(store);
  const session = createSession(user);
  return { user, establishment, session };
}

export function publicUser(user: User) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function resolveAdminEstablishment(
  _slug: string | undefined,
  authHeader: string | undefined,
): Establishment | null {
  const token = authHeader?.replace(/^Bearer\s+/i, "").trim();
  const auth = validateSession(token);
  return auth?.establishment || null;
}

export function findTableByQr(establishmentId: string, tableToken: string) {
  if (rejectPredictableDemoQrInProduction(tableToken)) return null;
  const store = getStore();
  return (
    Object.values(store.tables).find(
      (t) =>
        t.establishmentId === establishmentId &&
        t.status !== "INATIVA" &&
        t.qrToken === tableToken,
    ) || null
  );
}

type MutationError = { error: string; status: number };
type MutationResult<T> = { value: T } | MutationError;

const PRODUCT_AVAILABILITIES = new Set<ProductAvailability>([
  "VITRINE",
  "SOB_DEMANDA",
  "AMBOS",
]);
const TABLE_STATUSES = new Set<TableStatus>([
  "LIVRE",
  "OCUPADA",
  "AGUARDANDO_PAGAMENTO",
  "RESERVADA",
  "INATIVA",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function invalid(error: string, status = 400): MutationError {
  return { error, status };
}

function validateProductFields(
  store: MesaFlowStore,
  establishmentId: string,
  body: unknown,
  partial: boolean,
): MutationResult<Partial<Product>> {
  if (!isRecord(body)) return invalid("Corpo inválido.");
  const fields: Partial<Product> = {};
  const required = ["categoryId", "sectorId", "name", "description", "price", "prepMinutes", "availability"];
  if (!partial && required.some((field) => body[field] === undefined)) {
    return invalid("Preencha os campos obrigatórios do produto.");
  }

  if (body.categoryId !== undefined) {
    if (typeof body.categoryId !== "string") return invalid("Categoria inválida.");
    const category = store.categories[body.categoryId];
    if (!category || category.establishmentId !== establishmentId) {
      return invalid("Categoria não pertence ao estabelecimento.");
    }
    fields.categoryId = body.categoryId;
  }
  if (body.sectorId !== undefined) {
    if (typeof body.sectorId !== "string") return invalid("Setor inválido.");
    const sector = store.sectors[body.sectorId];
    if (!sector || sector.establishmentId !== establishmentId) {
      return invalid("Setor não pertence ao estabelecimento.");
    }
    fields.sectorId = body.sectorId;
  }
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 120) {
      return invalid("Nome deve ter entre 1 e 120 caracteres.");
    }
    fields.name = body.name.trim();
  }
  if (body.description !== undefined) {
    if (typeof body.description !== "string" || body.description.length > 1000) {
      return invalid("Descrição deve ter no máximo 1000 caracteres.");
    }
    fields.description = body.description.trim();
  }
  if (body.price !== undefined) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0 || body.price > 1_000_000) {
      return invalid("Preço deve estar entre 0 e 1000000.");
    }
    fields.price = body.price;
  }
  if (body.image !== undefined) {
    if (body.image !== null && (typeof body.image !== "string" || body.image.length > 2048)) {
      return invalid("Imagem inválida.");
    }
    fields.image = body.image === null || body.image === "" ? undefined : body.image;
  }
  if (body.tags !== undefined) {
    if (
      !Array.isArray(body.tags) ||
      body.tags.length > 20 ||
      body.tags.some((tag) => typeof tag !== "string" || !tag.trim() || tag.length > 50)
    ) {
      return invalid("Tags inválidas.");
    }
    fields.tags = body.tags.map((tag) => String(tag).trim());
  }
  if (body.prepMinutes !== undefined) {
    if (!Number.isInteger(body.prepMinutes) || Number(body.prepMinutes) < 0 || Number(body.prepMinutes) > 1440) {
      return invalid("Tempo de preparo deve ser inteiro entre 0 e 1440.");
    }
    fields.prepMinutes = Number(body.prepMinutes);
  }
  if (body.availability !== undefined) {
    if (
      typeof body.availability !== "string" ||
      !PRODUCT_AVAILABILITIES.has(body.availability as ProductAvailability)
    ) {
      return invalid("Disponibilidade inválida.");
    }
    fields.availability = body.availability as ProductAvailability;
  }
  for (const field of ["featured", "active"] as const) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "boolean") return invalid(`${field} deve ser booleano.`);
      fields[field] = body[field];
    }
  }
  if (body.variants !== undefined) {
    if (!Array.isArray(body.variants) || body.variants.length > 50) {
      return invalid("Variantes inválidas.");
    }
    const variants: ProductVariant[] = [];
    for (const entry of body.variants) {
      if (!isRecord(entry)) return invalid("Variante inválida.");
      if (typeof entry.name !== "string" || !entry.name.trim() || entry.name.trim().length > 80) {
        return invalid("Nome da variante inválido.");
      }
      if (
        typeof entry.priceDelta !== "number" ||
        !Number.isFinite(entry.priceDelta) ||
        entry.priceDelta < -1_000_000 ||
        entry.priceDelta > 1_000_000
      ) {
        return invalid("Delta de preço da variante inválido.");
      }
      variants.push({
        id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : id("var_"),
        name: entry.name.trim(),
        priceDelta: entry.priceDelta,
      });
    }
    fields.variants = variants;
  }
  if (body.addons !== undefined) {
    if (!Array.isArray(body.addons) || body.addons.length > 50) {
      return invalid("Adicionais inválidos.");
    }
    const addons: ProductAddon[] = [];
    for (const entry of body.addons) {
      if (!isRecord(entry)) return invalid("Adicional inválido.");
      if (typeof entry.name !== "string" || !entry.name.trim() || entry.name.trim().length > 80) {
        return invalid("Nome do adicional inválido.");
      }
      if (
        typeof entry.price !== "number" ||
        !Number.isFinite(entry.price) ||
        entry.price < 0 ||
        entry.price > 1_000_000
      ) {
        return invalid("Preço do adicional inválido.");
      }
      if (
        entry.maxQty !== undefined &&
        (!Number.isInteger(entry.maxQty) || Number(entry.maxQty) < 1 || Number(entry.maxQty) > 99)
      ) {
        return invalid("Quantidade máxima do adicional inválida.");
      }
      addons.push({
        id: typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : id("add_"),
        name: entry.name.trim(),
        price: entry.price,
        maxQty: entry.maxQty === undefined ? undefined : Number(entry.maxQty),
      });
    }
    fields.addons = addons;
  }
  for (const field of ["bumpProductIds", "upsellProductIds"] as const) {
    if (body[field] !== undefined) {
      if (
        !Array.isArray(body[field]) ||
        body[field].length > 20 ||
        body[field].some((item) => typeof item !== "string" || !item.trim())
      ) {
        return invalid(`${field} inválido.`);
      }
      fields[field] = (body[field] as string[]).map((item) => item.trim());
    }
  }
  return { value: fields };
}

export function listAdminProducts(establishmentId: string) {
  const store = getStore();
  return {
    categories: Object.values(store.categories)
      .filter((item) => item.establishmentId === establishmentId)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    sectors: Object.values(store.sectors).filter(
      (item) => item.establishmentId === establishmentId,
    ),
    products: Object.values(store.products).filter(
      (item) => item.establishmentId === establishmentId,
    ),
  };
}

export function createAdminProduct(
  establishmentId: string,
  body: unknown,
): MutationResult<Product> {
  const store = getStore();
  const parsed = validateProductFields(store, establishmentId, body, false);
  if ("error" in parsed) return parsed;
  const product: Product = {
    id: id("p_"),
    establishmentId,
    categoryId: parsed.value.categoryId!,
    sectorId: parsed.value.sectorId!,
    name: parsed.value.name!,
    description: parsed.value.description!,
    price: parsed.value.price!,
    image: parsed.value.image,
    tags: parsed.value.tags || [],
    prepMinutes: parsed.value.prepMinutes!,
    availability: parsed.value.availability!,
    featured: parsed.value.featured ?? false,
    active: parsed.value.active ?? true,
    variants: parsed.value.variants || [],
    addons: parsed.value.addons || [],
    bumpProductIds: parsed.value.bumpProductIds || [],
    upsellProductIds: parsed.value.upsellProductIds || [],
    rodizioIncluded: false,
  };
  store.products[product.id] = product;
  saveStore(store);
  return { value: product };
}

export function updateAdminProduct(
  establishmentId: string,
  productId: string,
  body: unknown,
): MutationResult<Product> {
  const store = getStore();
  const product = store.products[productId];
  if (!product || product.establishmentId !== establishmentId) {
    return invalid("Produto não encontrado.", 404);
  }
  const parsed = validateProductFields(store, establishmentId, body, true);
  if ("error" in parsed) return parsed;
  Object.assign(product, parsed.value);
  saveStore(store);
  return { value: product };
}

export function deleteAdminProduct(
  establishmentId: string,
  productId: string,
): MutationResult<Product> {
  const store = getStore();
  const product = store.products[productId];
  if (!product || product.establishmentId !== establishmentId) {
    return invalid("Produto não encontrado.", 404);
  }
  product.active = false;
  saveStore(store);
  return { value: product };
}

export function listAdminCategories(establishmentId: string) {
  const store = getStore();
  return Object.values(store.categories)
    .filter((item) => item.establishmentId === establishmentId)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

function validateCategoryFields(
  store: MesaFlowStore,
  establishmentId: string,
  body: unknown,
  partial: boolean,
): MutationResult<Partial<Category>> {
  if (!isRecord(body)) return invalid("Corpo inválido.");
  const fields: Partial<Category> = {};
  if (!partial && body.name === undefined) {
    return invalid("Nome da categoria é obrigatório.");
  }
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 80) {
      return invalid("Nome deve ter entre 1 e 80 caracteres.");
    }
    fields.name = body.name.trim();
  }
  if (body.emoji !== undefined) {
    if (body.emoji !== null && (typeof body.emoji !== "string" || body.emoji.length > 16)) {
      return invalid("Emoji inválido.");
    }
    fields.emoji = body.emoji === null || body.emoji === "" ? undefined : body.emoji;
  }
  if (body.sortOrder !== undefined) {
    if (!Number.isInteger(body.sortOrder) || Number(body.sortOrder) < 0 || Number(body.sortOrder) > 10_000) {
      return invalid("Ordem deve ser inteiro entre 0 e 10000.");
    }
    fields.sortOrder = Number(body.sortOrder);
  }
  if (body.active !== undefined) {
    if (typeof body.active !== "boolean") return invalid("active deve ser booleano.");
    fields.active = body.active;
  }
  if (body.parentId !== undefined) {
    if (body.parentId === null || body.parentId === "") {
      fields.parentId = undefined;
    } else if (typeof body.parentId !== "string") {
      return invalid("Categoria pai inválida.");
    } else {
      const parent = store.categories[body.parentId];
      if (!parent || parent.establishmentId !== establishmentId) {
        return invalid("Categoria pai não pertence ao estabelecimento.");
      }
      fields.parentId = body.parentId;
    }
  }
  return { value: fields };
}

export function createAdminCategory(
  establishmentId: string,
  body: unknown,
): MutationResult<Category> {
  const store = getStore();
  const parsed = validateCategoryFields(store, establishmentId, body, false);
  if ("error" in parsed) return parsed;
  const existing = listAdminCategories(establishmentId);
  const category: Category = {
    id: id("cat_"),
    establishmentId,
    name: parsed.value.name!,
    emoji: parsed.value.emoji,
    sortOrder: parsed.value.sortOrder ?? existing.length + 1,
    active: parsed.value.active ?? true,
    parentId: parsed.value.parentId,
  };
  store.categories[category.id] = category;
  saveStore(store);
  return { value: category };
}

export function updateAdminCategory(
  establishmentId: string,
  categoryId: string,
  body: unknown,
): MutationResult<Category> {
  const store = getStore();
  const category = store.categories[categoryId];
  if (!category || category.establishmentId !== establishmentId) {
    return invalid("Categoria não encontrada.", 404);
  }
  const parsed = validateCategoryFields(store, establishmentId, body, true);
  if ("error" in parsed) return parsed;
  if (parsed.value.parentId === categoryId) {
    return invalid("Categoria não pode ser pai de si mesma.");
  }
  Object.assign(category, parsed.value);
  saveStore(store);
  return { value: category };
}

export function deleteAdminCategory(
  establishmentId: string,
  categoryId: string,
): MutationResult<Category> {
  const store = getStore();
  const category = store.categories[categoryId];
  if (!category || category.establishmentId !== establishmentId) {
    return invalid("Categoria não encontrada.", 404);
  }
  category.active = false;
  saveStore(store);
  return { value: category };
}

function uniqueQrToken(store: MesaFlowStore) {
  let token = sessionToken();
  while (Object.values(store.tables).some((table) => table.qrToken === token)) {
    token = sessionToken();
  }
  return token;
}

function validateTableFields(
  store: MesaFlowStore,
  establishmentId: string,
  body: unknown,
  partial: boolean,
  currentId?: string,
): MutationResult<Partial<Table>> {
  if (!isRecord(body)) return invalid("Corpo inválido.");
  const fields: Partial<Table> = {};
  if (!partial && ["number", "capacity"].some((field) => body[field] === undefined)) {
    return invalid("Preencha os campos obrigatórios da mesa.");
  }
  if (body.number !== undefined) {
    if (typeof body.number !== "string" || !body.number.trim() || body.number.trim().length > 20) {
      return invalid("Número deve ter entre 1 e 20 caracteres.");
    }
    const number = body.number.trim();
    const duplicate = Object.values(store.tables).some(
      (table) =>
        table.establishmentId === establishmentId &&
        table.id !== currentId &&
        table.number === number,
    );
    if (duplicate) return invalid("Já existe uma mesa com este número.", 409);
    fields.number = number;
  }
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length > 80) {
      return invalid("Nome deve ter no máximo 80 caracteres.");
    }
    fields.name = body.name.trim();
  }
  if (body.capacity !== undefined) {
    if (!Number.isInteger(body.capacity) || Number(body.capacity) < 1 || Number(body.capacity) > 100) {
      return invalid("Capacidade deve ser inteira entre 1 e 100.");
    }
    fields.capacity = Number(body.capacity);
  }
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !TABLE_STATUSES.has(body.status as TableStatus)) {
      return invalid("Status de mesa inválido.");
    }
    fields.status = body.status as TableStatus;
  }
  return { value: fields };
}

export function listAdminTables(establishmentId: string) {
  return Object.values(getStore().tables).filter(
    (table) => table.establishmentId === establishmentId,
  );
}

export function createAdminTable(
  establishmentId: string,
  body: unknown,
): MutationResult<Table> {
  const store = getStore();
  const parsed = validateTableFields(store, establishmentId, body, false);
  if ("error" in parsed) return parsed;
  const table: Table = {
    id: id("tbl_"),
    establishmentId,
    number: parsed.value.number!,
    name: parsed.value.name || `Mesa ${parsed.value.number}`,
    capacity: parsed.value.capacity!,
    status: parsed.value.status || "LIVRE",
    qrToken: uniqueQrToken(store),
  };
  store.tables[table.id] = table;
  saveStore(store);
  return { value: table };
}

export function updateAdminTable(
  establishmentId: string,
  tableId: string,
  body: unknown,
): MutationResult<Table> {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa não encontrada.", 404);
  }
  const parsed = validateTableFields(store, establishmentId, body, true, tableId);
  if ("error" in parsed) return parsed;
  Object.assign(table, parsed.value);
  saveStore(store);
  return { value: table };
}

export function deleteAdminTable(
  establishmentId: string,
  tableId: string,
): MutationResult<{ id: string }> {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa não encontrada.", 404);
  }
  const blockingCommand = Object.values(store.commands).some(
    (command) =>
      command.establishmentId === establishmentId &&
      command.tableId === tableId &&
      (command.status === "ABERTA" || command.status === "PAGAMENTO_SOLICITADO"),
  );
  if (blockingCommand) {
    return invalid("Mesa possui comanda aberta ou aguardando pagamento.", 409);
  }
  delete store.tables[tableId];
  saveStore(store);
  return { value: { id: tableId } };
}

export function regenerateAdminTableQr(
  establishmentId: string,
  tableId: string,
): MutationResult<Table> {
  const store = getStore();
  const table = store.tables[tableId];
  if (!table || table.establishmentId !== establishmentId) {
    return invalid("Mesa não encontrada.", 404);
  }
  table.qrToken = uniqueQrToken(store);
  saveStore(store);
  return { value: table };
}

export function getAdminSettings(establishmentId: string) {
  return getStore().establishments[establishmentId] || null;
}

export function updateAdminSettings(
  establishmentId: string,
  body: unknown,
): MutationResult<Establishment> {
  const store = getStore();
  const establishment = store.establishments[establishmentId];
  if (!establishment) return invalid("Estabelecimento não encontrado.", 404);
  if (!isRecord(body)) return invalid("Corpo inválido.");
  const next: Establishment = {
    ...establishment,
    settings: { ...establishment.settings },
  };
  if (body.settings !== undefined && !isRecord(body.settings)) {
    return invalid("Ajustes inválidos.");
  }
  const settings = isRecord(body.settings) ? body.settings : body;

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 120) {
      return invalid("Nome deve ter entre 1 e 120 caracteres.");
    }
    next.name = body.name.trim();
  }
  if (body.tagline !== undefined) {
    if (typeof body.tagline !== "string" || body.tagline.length > 240) {
      return invalid("Tagline deve ter no máximo 240 caracteres.");
    }
    next.tagline = body.tagline.trim();
  }
  for (const field of ["open", "rodizioEnabled"] as const) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "boolean") return invalid(`${field} deve ser booleano.`);
      next[field] = body[field];
    }
  }
  if (body.operationMode !== undefined) {
    if (!isOperationMode(body.operationMode)) return invalid("Modo de operação inválido.");
    next.operationMode = body.operationMode as OperationMode;
    if (body.rodizioEnabled === undefined) {
      next.rodizioEnabled = next.operationMode === "rodizio" || next.rodizioEnabled;
    }
  }
  if (settings.currency !== undefined) {
    if (typeof settings.currency !== "string" || !/^[A-Za-z]{3}$/.test(settings.currency)) {
      return invalid("Moeda deve usar código ISO de 3 letras.");
    }
    next.settings.currency = settings.currency.toUpperCase();
  }
  for (const field of ["allowEditAfterPrep", "soundNotifications", "otpRequired"] as const) {
    if (settings[field] !== undefined) {
      if (typeof settings[field] !== "boolean") return invalid(`${field} deve ser booleano.`);
      next.settings[field] = settings[field];
    }
  }
  if (settings.minIntervalRodizioSec !== undefined) {
    if (
      !Number.isInteger(settings.minIntervalRodizioSec) ||
      Number(settings.minIntervalRodizioSec) < 0 ||
      Number(settings.minIntervalRodizioSec) > 86_400
    ) {
      return invalid("Intervalo do rodízio deve ser inteiro entre 0 e 86400.");
    }
    next.settings.minIntervalRodizioSec = Number(settings.minIntervalRodizioSec);
  }
  store.establishments[establishmentId] = next;
  saveStore(store);
  return { value: next };
}

export function getActiveCommand(table: Table): Command | null {
  const store = getStore();
  if (table.commandId) {
    const linked = store.commands[table.commandId];
    if (linked && linked.status !== "FECHADA") return linked;
  }
  const active = Object.values(store.commands).find(
    (command) => command.tableId === table.id && command.status !== "FECHADA",
  );
  return active || null;
}

export function getOrOpenCommand(table: Table): Command {
  const store = getStore();
  const active = getActiveCommand(table);
  if (active) {
    if (table.commandId !== active.id) {
      table.commandId = active.id;
      store.tables[table.id] = table;
      saveStore(store);
    }
    return active;
  }
  const cmd: Command = {
    id: id("cmd_"),
    establishmentId: table.establishmentId,
    tableId: table.id,
    openedAt: new Date().toISOString(),
    status: "ABERTA",
    guestCount: 2,
    total: 0,
  };
  store.commands[cmd.id] = cmd;
  table.commandId = cmd.id;
  table.status = "OCUPADA";
  store.tables[table.id] = table;
  saveStore(store);
  emit({ type: "command.updated", commandId: cmd.id, establishmentId: table.establishmentId });
  return cmd;
}

export function recalcCommandTotal(commandId: string) {
  const store = getStore();
  const cmd = store.commands[commandId];
  if (!cmd) return;
  const orders = Object.values(store.orders).filter((o) => o.commandId === commandId && o.status !== "CANCELADO");
  cmd.total = orders.reduce((s, o) => s + o.total, 0);
  store.commands[commandId] = cmd;
  saveStore(store);
}

export function nextOrderNumber(establishmentId: string) {
  const store = getStore();
  const n = (store.orderCounter[establishmentId] || 1200) + 1;
  store.orderCounter[establishmentId] = n;
  saveStore(store);
  return n;
}

export function createOrder(input: {
  establishmentId: string;
  table: Table;
  commandId: string;
  items: OrderItem[];
  notes?: string;
  source?: Order["source"];
  rodizioRoundId?: string;
  guestParticipationId: string;
}): Order {
  const store = getStore();
  const participation = store.guestParticipations[input.guestParticipationId];
  if (participation && participation.status !== "OPEN") {
    throw new Error("Participação não permite novos pedidos.");
  }
  const total = input.items.reduce((s, i) => s + lineTotal(i), 0);
  const order: Order = {
    id: id("ord_"),
    establishmentId: input.establishmentId,
    tableId: input.table.id,
    tableNumber: input.table.number,
    commandId: input.commandId,
    guestParticipationId: input.guestParticipationId,
    number: nextOrderNumber(input.establishmentId),
    status: "NOVO",
    items: input.items.map((i) => ({ ...i, status: "NOVO" as OrderStatus })),
    notes: input.notes,
    source: input.source || "MESA",
    rodizioRoundId: input.rodizioRoundId,
    total,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.orders[order.id] = order;
  if (participation) {
    participation.orderCount += 1;
    participation.lastOrderAt = order.createdAt;
    store.guestParticipations[participation.id] = participation;
  }
  saveStore(store);
  recalcCommandTotal(input.commandId);
  notify(input.establishmentId, "order.new", "Novo pedido", `Mesa ${input.table.number} · Pedido #${order.number}`);
  emit({ type: "order.created", orderId: order.id, establishmentId: input.establishmentId });
  return order;
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  establishmentId?: string,
) {
  const store = getStore();
  const order = store.orders[orderId];
  if (!order) return null;
  if (establishmentId && order.establishmentId !== establishmentId) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  order.items = order.items.map((i) => ({ ...i, status }));
  store.orders[orderId] = order;
  saveStore(store);
  if (status === "PRONTO") {
    notify(order.establishmentId, "order.ready", "Pedido pronto", `#${order.number} · Mesa ${order.tableNumber}`);
  }
  emit({ type: "order.updated", orderId, establishmentId: order.establishmentId });
  return order;
}

export function requestBill(tableId: string) {
  const store = getStore();
  migrateOperationalCollections(store);
  const table = store.tables[tableId];
  if (!table) return null;
  const cmd = getActiveCommand(table);
  if (!cmd) return null;
  if (cmd.status === "PAGAMENTO_SOLICITADO") return cmd;
  cmd.status = "PAGAMENTO_SOLICITADO";
  cmd.closingRequestedAt = new Date().toISOString();
  cmd.lastClosingScope = "TABLE";
  table.status = "AGUARDANDO_PAGAMENTO";
  store.commands[cmd.id] = cmd;
  store.tables[tableId] = table;

  const participations = Object.values(store.guestParticipations).filter(
    (entry) => entry.commandId === cmd.id && entry.status !== "CLOSED",
  );
  const pending = Object.values(store.closingRequests).find(
    (entry) => entry.commandId === cmd.id && entry.status === "PENDING",
  );
  if (!pending) {
    const request: ClosingRequest = {
      id: id("clr_"),
      establishmentId: cmd.establishmentId,
      commandId: cmd.id,
      tableId: table.id,
      requestedByGuestParticipationId:
        participations[0]?.id || `gp_legacy_${cmd.id}`,
      scope: "TABLE",
      targetGuestParticipationIds: participations.map((entry) => entry.id),
      status: "PENDING",
      createdAt: cmd.closingRequestedAt!,
    };
    store.closingRequests[request.id] = request;
  }

  saveStore(store);
  notify(
    table.establishmentId,
    "bill.request",
    "Conta solicitada",
    `Mesa ${table.number} aguarda fechamento.`,
    {
      commandId: cmd.id,
      tableId: table.id,
      actionUrl: `/admin/tables/cockpit?table=${encodeURIComponent(table.id)}`,
    },
  );
  emit({ type: "command.updated", commandId: cmd.id, establishmentId: table.establishmentId });
  return cmd;
}

export function createRodizioRound(input: {
  establishmentId: string;
  table: Table;
  commandId: string;
  rodizioId: string;
  guestParticipationId: string;
  items: OrderItem[];
}): RodizioRound {
  const store = getStore();
  const existing = Object.values(store.rodizioRounds).filter(
    (r) => r.commandId === input.commandId && r.rodizioId === input.rodizioId,
  );
  const round: RodizioRound = {
    id: id("rrd_"),
    establishmentId: input.establishmentId,
    commandId: input.commandId,
    tableId: input.table.id,
    guestParticipationId: input.guestParticipationId,
    rodizioId: input.rodizioId,
    roundNumber: existing.length + 1,
    status: "NOVO",
    items: input.items,
    createdAt: new Date().toISOString(),
  };
  store.rodizioRounds[round.id] = round;
  saveStore(store);
  createOrder({
    establishmentId: input.establishmentId,
    table: input.table,
    commandId: input.commandId,
    guestParticipationId: input.guestParticipationId,
    items: input.items,
    source: "RODIZIO",
    rodizioRoundId: round.id,
  });
  round.sentAt = new Date().toISOString();
  round.status = "ACEITO";
  store.rodizioRounds[round.id] = round;
  saveStore(store);
  notify(input.establishmentId, "rodizio.round", "Nova rodada", `Mesa ${input.table.number} · Rodada ${round.roundNumber}`);
  emit({ type: "rodizio.round", roundId: round.id, establishmentId: input.establishmentId });
  return round;
}

export function dashboardStats(establishmentId: string) {
  const analytics = dashboardAnalytics(establishmentId, "today");
  return {
    revenue: analytics.sales.revenue,
    ordersToday: analytics.sales.ordersCount,
    ticketAvg: analytics.sales.ticketAvg,
    tablesOccupied: analytics.occupancy.occupied,
    tablesTotal: analytics.occupancy.tablesTotal,
    inPrep: analytics.inPrep,
    pending: analytics.pendingOrders,
    topProducts: analytics.topProducts,
    paymentsCollected: analytics.sales.paymentsCollected,
    activeSessions: analytics.sessions.active,
    paymentsPending: analytics.payments.pending,
    paymentsConfirmed: analytics.payments.confirmed,
  };
}
