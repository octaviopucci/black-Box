import { appendAuditEvent } from "./audit-log";
import { issuePlatformSessionToken, parsePlatformSessionToken } from "./platform-session-token";
import { getMerchantDetail, listMerchants, platformDashboard } from "./platform-analytics";
import { parsePlatformPlan } from "./platform-plans";
import { hashPassword, id, verifyPassword } from "./crypto-utils";
import { PLATFORM_OWNER_LOGIN } from "./demo";
import {
  getStore,
  requireOperationalPersist,
  saveOperationalStore,
  saveStore,
  sharedPersistenceConfigured,
} from "./store";
import type { PlanOverrides, PlatformPlan, PlatformStatus, PlatformUser } from "./types";

const PLATFORM_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function findPlatformUserByEmail(email: string): PlatformUser | undefined {
  const normalized = email.toLowerCase().trim();
  return Object.values(getStore().platformUsers || {}).find((u) => u.email === normalized);
}

export function publicPlatformUser(user: PlatformUser) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function loginPlatformUser(email: string, password: string) {
  const user = findPlatformUserByEmail(email);
  if (!user || !user.active || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-mail ou senha inválidos." };
  }

  const store = getStore();
  if (!user.passwordHash.startsWith("$2")) {
    user.passwordHash = hashPassword(password);
  }
  user.lastLoginAt = new Date().toISOString();
  store.platformUsers[user.id] = user;
  appendAuditEvent(store, {
    establishmentId: "platform",
    type: "platform.login",
    actorType: "PLATFORM",
    actorUserId: user.id,
    targetType: "platform_user",
    targetId: user.id,
    metadata: { role: user.role },
  });
  saveStore(store);

  const token = issuePlatformSessionToken(user.id, PLATFORM_SESSION_TTL_MS);
  return { token, user: publicPlatformUser(user) };
}

export function validatePlatformSession(token: string | null | undefined) {
  if (!token) return null;
  const claims = parsePlatformSessionToken(token);
  if (!claims) return null;

  const store = getStore();
  const user = store.platformUsers?.[claims.platformUserId];
  if (!user?.active) return null;

  return { user, expiresAt: new Date(claims.exp).toISOString() };
}

export function ensurePlatformOwnerSeed() {
  const store = getStore();
  store.platformUsers ||= {};

  const hasUsers = Object.keys(store.platformUsers).length > 0;
  if (hasUsers) return null;

  const email = (
    process.env.MESAFLOW_PLATFORM_OWNER_EMAIL?.trim() || PLATFORM_OWNER_LOGIN.email
  ).toLowerCase();
  const password =
    process.env.MESAFLOW_PLATFORM_OWNER_PASSWORD?.trim() || PLATFORM_OWNER_LOGIN.password;
  const existing = findPlatformUserByEmail(email);

  if (existing) return existing;

  const user: PlatformUser = {
    id: id("plat_"),
    email,
    passwordHash: hashPassword(password),
    name: "Octavio Pucci",
    role: "PLATFORM_OWNER",
    active: true,
    createdAt: new Date().toISOString(),
  };
  store.platformUsers[user.id] = user;
  saveStore(store);
  return user;
}

export type MerchantPatch = {
  platformStatus?: PlatformStatus;
  plan?: PlatformPlan;
  planOverrides?: PlanOverrides | null;
  addonWaiters?: number;
  addonTables?: number;
  reason?: string;
};

export async function updateMerchant(establishmentId: string, patch: MerchantPatch) {
  const store = getStore();
  const establishment = store.establishments[establishmentId];
  if (!establishment) return { error: "Estabelecimento não encontrado.", status: 404 };

  const metadata: Record<string, unknown> = {};
  const statusChanging = patch.platformStatus !== undefined;
  const previousStatus = statusChanging
    ? {
        platformStatus: establishment.platformStatus,
        suspendedAt: establishment.suspendedAt,
        suspendedReason: establishment.suspendedReason,
      }
    : null;

  if (patch.platformStatus !== undefined) {
    establishment.platformStatus = patch.platformStatus;
    if (patch.platformStatus === "suspended" || patch.platformStatus === "rejected") {
      establishment.suspendedAt = new Date().toISOString();
      establishment.suspendedReason = patch.reason?.trim() || undefined;
    } else {
      establishment.suspendedAt = undefined;
      establishment.suspendedReason = undefined;
    }
    metadata.status = patch.platformStatus;
    metadata.reason = patch.reason?.trim() || null;
  }

  if (patch.plan !== undefined) {
    const nextPlan = parsePlatformPlan(patch.plan);
    if (!nextPlan) return { error: "Plano inválido.", status: 400 };
    if (establishment.plan !== nextPlan) {
      establishment.plan = nextPlan;
      establishment.planStartedAt = new Date().toISOString();
      metadata.plan = nextPlan;
    }
  }

  if (patch.planOverrides !== undefined) {
    if (patch.planOverrides === null) {
      establishment.planOverrides = undefined;
      metadata.planOverrides = null;
    } else {
      establishment.planOverrides = {
        features: { ...establishment.planOverrides?.features, ...patch.planOverrides.features },
        limits: { ...establishment.planOverrides?.limits, ...patch.planOverrides.limits },
        addonWaiters: patch.planOverrides.addonWaiters ?? establishment.planOverrides?.addonWaiters,
        addonTables: patch.planOverrides.addonTables ?? establishment.planOverrides?.addonTables,
        addons: { ...establishment.planOverrides?.addons, ...patch.planOverrides.addons },
      };
      metadata.planOverrides = establishment.planOverrides;
    }
  }

  if (patch.addonWaiters !== undefined || patch.addonTables !== undefined) {
    establishment.planOverrides ||= {};
    if (patch.addonWaiters !== undefined) {
      establishment.planOverrides.addonWaiters = Math.max(0, patch.addonWaiters);
      metadata.addonWaiters = establishment.planOverrides.addonWaiters;
    }
    if (patch.addonTables !== undefined) {
      establishment.planOverrides.addonTables = Math.max(0, patch.addonTables);
      metadata.addonTables = establishment.planOverrides.addonTables;
    }
  }

  if (Object.keys(metadata).length === 0) {
    return { error: "Nenhuma alteração informada.", status: 400 };
  }

  const auditEvent = appendAuditEvent(store, {
    establishmentId,
    type: "platform.merchant_status",
    actorType: "PLATFORM",
    targetType: "establishment",
    targetId: establishmentId,
    metadata,
  });
  saveOperationalStore(store);

  if (statusChanging && sharedPersistenceConfigured()) {
    const persist = await requireOperationalPersist();
    if (!persist.ok) {
      if (previousStatus) {
        establishment.platformStatus = previousStatus.platformStatus;
        establishment.suspendedAt = previousStatus.suspendedAt;
        establishment.suspendedReason = previousStatus.suspendedReason;
      }
      delete store.auditEvents[auditEvent.id];
      saveOperationalStore(store);
      return {
        error:
          persist.blobError ||
          persist.redisError ||
          "Não foi possível persistir a alteração de status. Tente novamente.",
        status: 503,
      };
    }
  }

  return { value: getMerchantDetail(establishmentId)! };
}

/** @deprecated Use updateMerchant */
export async function updateMerchantStatus(
  establishmentId: string,
  status: PlatformStatus,
  reason?: string,
) {
  return updateMerchant(establishmentId, { platformStatus: status, reason });
}

export { listMerchants, getMerchantDetail, platformDashboard };
