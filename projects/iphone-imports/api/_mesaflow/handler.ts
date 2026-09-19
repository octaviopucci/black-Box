import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  changeUserPassword,
  createAdminCategory,
  createAdminProduct,
  createAdminTable,
  createOrder,
  createRodizioRound,
  dashboardStats,
  deleteAdminCategory,
  deleteAdminProduct,
  deleteAdminTable,
  findEstablishmentBySlug,
  findTableByQr,
  blobDiagnostics,
  flushPersistentStore,
  persistStatus,
  probeBlobStorage,
  probeRedisStorage,
  getActiveCommand,
  getAdminSettings,
  getOrOpenCommand,
  getStore,
  saveStore,
  hydratePersistentStore,
  listAdminCategories,
  listAdminProducts,
  listAdminTables,
  loginUser,
  publicUser,
  regenerateAdminTableQr,
  registerEstablishment,
  setPersistentStoreOidcToken,
  updateAdminCategory,
  updateAdminProduct,
  updateAdminSettings,
  updateAdminTable,
  validateSession,
  updateOrderStatus,
} from "../../../mesaflow/src/lib/store";
import {
  cancelGuestClosing,
  getGuestClosingStatus,
  requestGuestClosing,
} from "../../../mesaflow/src/lib/guest-closing";
import { getKdsQueue } from "../../../mesaflow/src/lib/kds-queue";
import {
  activateTable,
  confirmClosingRequest,
  connectIntegration,
  disconnectIntegration,
  ensureIntegrationCatalog,
  forceClearTable,
  getTableCockpit,
  listAdminOperations,
  listIntegrations,
  markNotificationRead,
  registerPayment,
  replaceOrderItemSplits,
  settleCommand,
  testWebhookStub,
  voidPayment,
} from "../../../mesaflow/src/lib/store-operations";
import {
  clearClientCookie,
  parseClientCookie,
  setClientCookie,
} from "../../../mesaflow/src/lib/guest-cookie";
import {
  guestTableSummary,
  joinGuestAtTable,
  kickGuestParticipation,
  otpRequiredForEstablishment,
  publicParticipation,
  requestOtpChallenge,
  validateClientSession,
  verifyOtpChallenge,
  revokeClientSession,
} from "../../../mesaflow/src/lib/guest";
import { normalizePhoneE164 } from "../../../mesaflow/src/lib/identity-crypto";
import { parseBase64UploadBody, uploadProductImage } from "../../../mesaflow/src/lib/media-upload";
import { isOperationMode } from "../../../mesaflow/src/lib/operation-modes";
import { resolveGuestTableContext } from "../../../mesaflow/src/lib/guest-table-context";
import {
  clientIpFromHeaders,
  enforceRateLimit,
  rateLimitHeaders,
  type RateLimitResult,
} from "../../../mesaflow/src/lib/rate-limit";
import {
  consentRequiredMessage,
  validatePrivacyConsent,
} from "../../../mesaflow/src/lib/privacy-policy";
import {
  deleteGuestSubjectData,
  deleteMerchantSubjectData,
  exportGuestSubjectData,
  exportMerchantSubjectData,
} from "../../../mesaflow/src/lib/privacy-dsr";
import {
  getMerchantDetail,
  listMerchants,
  loginPlatformUser,
  platformDashboard,
  publicPlatformUser,
  updateMerchant,
  validatePlatformSession,
} from "../../../mesaflow/src/lib/platform-store";
import { parsePlatformPlan } from "../../../mesaflow/src/lib/platform-plans";
import {
  parsePlatformStatusFilterInput,
  parsePlatformStatusInput,
} from "../../../mesaflow/src/lib/platform-status";
import { resolveOrderLines } from "../../../mesaflow/src/lib/order-resolve";
import {
  buildDetailedHealthResponse,
  buildPublicHealthResponse,
  healthDiagnosticsAuthorized,
} from "../../../mesaflow/src/lib/public-health";
import {
  ADMIN_SESSION_COOKIE,
  PLATFORM_SESSION_COOKIE,
  buildAdminSessionCookie,
  buildPlatformSessionCookie,
  clearAdminSessionCookieValue,
  clearPlatformSessionCookieValue,
  parseStaffCookieHeader,
} from "../../../mesaflow/src/lib/staff-session-cookie-web";
import { verifyTurnstileToken } from "../../../mesaflow/src/lib/turnstile";
import type {
  OperationMode,
  OrderLineInput,
  OrderStatus,
  PlatformPlan,
} from "../../../mesaflow/src/lib/types";

function resolvePath(req: VercelRequest): string {
  const q = req.query?.path;
  if (Array.isArray(q) && q.length > 0) return "/" + q.map(String).join("/");
  if (typeof q === "string" && q.length > 0) return "/" + q.replace(/^\/+/, "");

  const originalUrl = req.url || "/";
  const qIndex = originalUrl.indexOf("?");
  const pathname = qIndex >= 0 ? originalUrl.slice(0, qIndex) : originalUrl;
  const stripped = pathname.replace(/^\/api\/mesaflow\/?/, "/") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

async function json(
  res: VercelResponse,
  status: number,
  body: unknown,
  options?: { skipFlush?: boolean; extraHeaders?: Record<string, string> },
) {
  if (!options?.skipFlush) {
    try {
      const persist = await flushPersistentStore();
      if (!persist.blob && persist.blobError) {
        console.warn("[mesaflow] blob persist skipped/failed", persist.blobError);
      }
    } catch (error) {
      console.warn("[mesaflow] flush failed (soft-fail, disk cache kept)", error);
    }
  }
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  if (options?.extraHeaders) {
    for (const [key, value] of Object.entries(options.extraHeaders)) {
      res.setHeader(key, value);
    }
  }
  res.send(JSON.stringify(body));
}

function clientIp(req: VercelRequest): string {
  return clientIpFromHeaders(req.headers as Record<string, string | string[] | undefined>);
}

function rateLimitOrReject(
  res: VercelResponse,
  namespace: "authLogin" | "authRegister" | "otpRequest" | "otpVerify",
  clientId: string,
): RateLimitResult | null {
  const result = enforceRateLimit(namespace, clientId);
  if (!result.allowed) {
    void json(
      res,
      429,
      { error: "Muitas tentativas. Aguarde e tente novamente." },
      { extraHeaders: rateLimitHeaders(result), skipFlush: true },
    );
    return null;
  }
  return result;
}

function blobSetupHint(storage: ReturnType<typeof blobDiagnostics>): string {
  if (storage.hasToken) return "";
  if (storage.hasStoreId && !storage.hasOidc && !storage.hasOidcHeader) {
    return "BLOB_STORE_ID existe mas OIDC não chegou na function. Faça Redeploy ou adicione BLOB_READ_WRITE_TOKEN manualmente.";
  }
  if ((storage.hasOidc || storage.hasOidcHeader) && !storage.hasStoreId) {
    return "OIDC ok mas BLOB_STORE_ID ausente — o Blob provavelmente está conectado a OUTRO projeto Vercel. Em Storage → Blob → Projects → conecte o projeto certo (Production + Preview).";
  }
  if (storage.blobEnvKeys.length === 0) {
    return "Nenhuma variável BLOB/OIDC nesta function. Storage → Blob → Connect to Project. Ou adicione BLOB_READ_WRITE_TOKEN em Environment Variables e redeploy.";
  }
  if (storage.lastError) {
    return `Persistência falhou: ${storage.lastError}. Adicione BLOB_READ_WRITE_TOKEN (token Read-Write do Blob) e redeploy.`;
  }
  return "Storage → Blob → Connect to Project → marque Production + Preview → Redeploy.";
}

function readOidcHeader(req: VercelRequest) {
  const value = req.headers["x-vercel-oidc-token"];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && value[0]?.trim()) return value[0].trim();
  return undefined;
}

function readBearer(req: VercelRequest) {
  const authorization = req.headers.authorization;
  const match = typeof authorization === "string" && authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : undefined;
}

function readCookieHeader(req: VercelRequest): string | undefined {
  const raw = req.headers.cookie;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.join("; ");
  return undefined;
}

function readAdminToken(req: VercelRequest) {
  return readBearer(req) || parseStaffCookieHeader(readCookieHeader(req), ADMIN_SESSION_COOKIE);
}

function readPlatformToken(req: VercelRequest) {
  return readBearer(req) || parseStaffCookieHeader(readCookieHeader(req), PLATFORM_SESSION_COOKIE);
}

function readGuestToken(req: VercelRequest) {
  return readBearer(req) || parseClientCookie(req);
}

function adminAuth(req: VercelRequest) {
  const auth = validateSession(readAdminToken(req));
  return auth && (auth.user.role === "OWNER" || auth.user.role === "MANAGER") ? auth : null;
}

function dashboardAuth(req: VercelRequest) {
  const auth = validateSession(readAdminToken(req));
  const allowed = ["OWNER", "MANAGER", "COUNTER", "WAITER", "KITCHEN"];
  return auth && allowed.includes(auth.user.role) ? auth : null;
}

function staffAuth(req: VercelRequest, roles?: string[]) {
  const auth = validateSession(readAdminToken(req));
  const allowed = roles ?? ["OWNER", "MANAGER", "COUNTER", "WAITER"];
  return auth && allowed.includes(auth.user.role) ? auth : null;
}

function kitchenAuth(req: VercelRequest) {
  const auth = validateSession(readAdminToken(req));
  if (!auth) return null;
  if (
    auth.user.role === "OWNER" ||
    auth.user.role === "MANAGER" ||
    auth.user.role === "KITCHEN" ||
    auth.user.role === "COUNTER"
  ) {
    return auth;
  }
  return null;
}

function platformAuth(req: VercelRequest) {
  return validatePlatformSession(readPlatformToken(req));
}

function parsePlatformPlanFilter(value: string | undefined): PlatformPlan | "all" {
  if (value === "essencial" || value === "premium" || value === "custom") return value;
  return "all";
}

function parseDashboardPeriod(value: string | undefined): "today" | "7d" | "30d" {
  if (value === "today" || value === "7d" || value === "30d") return value;
  return "30d";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setPersistentStoreOidcToken(readOidcHeader(req));
  if (req.method === "OPTIONS") return json(res, 204, {});

  try {
    await hydratePersistentStore();
    const path = resolvePath(req);
    const store = getStore();

    if (req.method === "GET" && path === "/health") {
      const hasOidcHeader = Boolean(readOidcHeader(req));
      const storage = blobDiagnostics(hasOidcHeader);
      const probe = await probeBlobStorage();
      const redisProbe = await probeRedisStorage();
      const persist = await flushPersistentStore();
      const blobOk = probe.ok || (storage.hasToken && storage.configured);
      const sharedOk =
        persist.blob === true ||
        persist.redis === true ||
        (redisProbe.ok === true && storage.redis?.configured === true);
      const establishmentCount = Object.keys(store.establishments).length;
      const healthReq = {
        headers: { get: (name: string) => {
          const key = name.toLowerCase();
          const val = req.headers[key];
          if (typeof val === "string") return val;
          if (Array.isArray(val)) return val[0] ?? null;
          return null;
        } },
        url: req.url,
      };
      if (healthDiagnosticsAuthorized(healthReq)) {
        return json(
          res,
          200,
          buildDetailedHealthResponse({
            sharedOk,
            blobOk,
            establishmentCount,
            storage: { ...storage, probe, redisProbe },
            persist,
            setup: sharedOk
              ? undefined
              : persist.redisError
                ? `Redis falhou: ${persist.redisError}. Verifique UPSTASH_REDIS_REST_URL/TOKEN.`
                : blobSetupHint({ ...storage, lastError: persist.blobError ?? storage.lastError }),
          }),
          { skipFlush: true },
        );
      }
      return json(
        res,
        200,
        buildPublicHealthResponse({ sharedOk, blobOk, establishmentCount }),
        { skipFlush: true },
      );
    }

    if (req.method === "GET" && path === "/guest/table-context") {
      const slug = String(req.query?.slug || "");
      const tableToken = String(req.query?.tableToken || "");
      const result = resolveGuestTableContext(slug, tableToken, readGuestToken(req));
      if (!result.ok) return json(res, result.status, { error: result.error });
      return json(res, 200, result.data);
    }

    if (req.method === "GET" && path === "/guest/me") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente inválida." });
      const orders = Object.values(store.orders)
        .filter((o) => o.guestParticipationId === guestAuth.participation.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const consumptionTotal = orders
        .filter((o) => o.status !== "CANCELADO")
        .reduce((sum, order) => sum + order.total, 0);
      return json(res, 200, {
        participation: publicParticipation(guestAuth.participation),
        orders,
        consumptionTotal,
      });
    }

    if (req.method === "POST" && path === "/guest/join/mock") {
      const body = (req.body || {}) as {
        slug: string;
        tableToken: string;
        phone?: string;
        displayName?: string;
        comandaNumber?: string;
        privacyConsent?: unknown;
      };
      const consent = validatePrivacyConsent(body.privacyConsent);
      if (!consent) return json(res, 400, { error: consentRequiredMessage() });
      const est = findEstablishmentBySlug(String(body.slug || ""));
      if (!est) return json(res, 404, { error: "Estabelecimento não encontrado." });
      if (otpRequiredForEstablishment(est)) {
        return json(res, 403, { error: "OTP obrigatório para este estabelecimento." });
      }
      const tbl = findTableByQr(est.id, String(body.tableToken || ""));
      if (!tbl) return json(res, 404, { error: "Mesa inválida." });
      const phoneE164 = normalizePhoneE164(body.phone || "+5511999999999");
      if (!phoneE164) return json(res, 400, { error: "Telefone inválido." });
      const result = joinGuestAtTable({
        establishment: est,
        table: tbl,
        phoneE164,
        displayName: body.displayName,
        comandaNumber: body.comandaNumber,
        privacyConsent: consent,
      });
      if ("error" in result) return json(res, result.status, { error: result.error });
      setClientCookie(res, result.token);
      return json(res, 200, {
        token: result.token,
        participation: publicParticipation(result.participation),
        message: result.message,
      });
    }

    if (req.method === "POST" && path === "/guest/otp/request") {
      const body = (req.body || {}) as {
        slug: string;
        tableToken: string;
        phone: string;
        privacyConsent?: unknown;
        turnstileToken?: string;
      };
      const rl = rateLimitOrReject(
        res,
        "otpRequest",
        `${clientIp(req)}:${String(body.phone || "").replace(/\D/g, "").slice(-8)}`,
      );
      if (!rl) return;
      const turnstile = await verifyTurnstileToken(body.turnstileToken, clientIp(req));
      if (!turnstile.ok) {
        return json(res, 400, { error: turnstile.error }, { extraHeaders: rateLimitHeaders(rl) });
      }
      const consent = validatePrivacyConsent(body.privacyConsent);
      if (!consent) {
        return json(res, 400, { error: consentRequiredMessage() }, { extraHeaders: rateLimitHeaders(rl) });
      }
      const est = findEstablishmentBySlug(String(body.slug || ""));
      if (!est) return json(res, 404, { error: "Estabelecimento não encontrado." }, { extraHeaders: rateLimitHeaders(rl) });
      const tbl = findTableByQr(est.id, String(body.tableToken || ""));
      if (!tbl) return json(res, 404, { error: "Mesa inválida." }, { extraHeaders: rateLimitHeaders(rl) });
      const result = requestOtpChallenge({
        establishment: est,
        table: tbl,
        phoneRaw: String(body.phone || ""),
        purpose: "JOIN",
      });
      if ("error" in result) return json(res, 400, { error: result.error }, { extraHeaders: rateLimitHeaders(rl) });
      return json(
        res,
        200,
        {
          challengeId: result.challengeId,
          mockCode: result.mockCode,
          message: "Código enviado.",
        },
        { extraHeaders: rateLimitHeaders(rl) },
      );
    }

    if (req.method === "POST" && path === "/guest/otp/verify") {
      const body = (req.body || {}) as {
        challengeId: string;
        code: string;
        displayName?: string;
        slug?: string;
        tableToken?: string;
        phone?: string;
        comandaNumber?: string;
        privacyConsent?: unknown;
        turnstileToken?: string;
      };
      const rl = rateLimitOrReject(res, "otpVerify", `${clientIp(req)}:${String(body.challengeId || "")}`);
      if (!rl) return;
      const turnstile = await verifyTurnstileToken(body.turnstileToken, clientIp(req));
      if (!turnstile.ok) {
        return json(res, 400, { error: turnstile.error }, { extraHeaders: rateLimitHeaders(rl) });
      }
      const consent = validatePrivacyConsent(body.privacyConsent);
      if (!consent) {
        return json(res, 400, { error: consentRequiredMessage() }, { extraHeaders: rateLimitHeaders(rl) });
      }
      const result = verifyOtpChallenge({
        challengeId: String(body.challengeId || ""),
        code: String(body.code || ""),
        displayName: body.displayName,
        slug: body.slug,
        tableToken: body.tableToken,
        phoneRaw: body.phone,
        comandaNumber: body.comandaNumber,
        privacyConsent: consent,
      });
      if ("error" in result) return json(res, 400, { error: result.error }, { extraHeaders: rateLimitHeaders(rl) });
      setClientCookie(res, result.token);
      return json(
        res,
        200,
        {
          token: result.token,
          participation: publicParticipation(result.participation),
        },
        { extraHeaders: rateLimitHeaders(rl) },
      );
    }

    if (req.method === "GET" && path === "/guest/dsr/export") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente inválida." });
      const result = exportGuestSubjectData(guestAuth.participation.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result);
    }

    if (req.method === "POST" && path === "/guest/dsr/delete") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente inválida." });
      const body = (req.body || {}) as { confirm?: boolean };
      if (body.confirm !== true) return json(res, 400, { error: 'Confirme com { "confirm": true }.' });
      const result = deleteGuestSubjectData(guestAuth.participation.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      clearClientCookie(res);
      return json(res, 200, result);
    }

    if (req.method === "POST" && path === "/guest/logout") {
      revokeClientSession(readGuestToken(req));
      clearClientCookie(res);
      return json(res, 200, { ok: true });
    }

    if (req.method === "GET" && path.startsWith("/menu/")) {
      const parts = path.split("/").filter(Boolean);
      const slug = parts[1];
      const table = parts[2];
      if (!slug || !table) return json(res, 400, { error: "Path inválido." });
      const est = findEstablishmentBySlug(slug);
      if (!est) return json(res, 404, { error: "Estabelecimento não encontrado." });
      if (!est.open) return json(res, 403, { error: "Estabelecimento fechado no momento." });
      const tbl = findTableByQr(est.id, table);
      if (!tbl) return json(res, 404, { error: "Mesa inválida ou QR expirado." });

      const command = getActiveCommand(tbl);
      const categories = Object.values(store.categories)
        .filter((c) => c.establishmentId === est.id && c.active)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      const products = Object.values(store.products).filter((p) => p.establishmentId === est.id && p.active);
      const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id);
      const summary = guestTableSummary(est.id, command?.id);
      const rodizio = est.rodizioEnabled
        ? Object.values(store.rodizios).find((r) => r.establishmentId === est.id && r.active)
        : null;

      return json(res, 200, {
        establishment: est,
        table: tbl,
        command,
        categories,
        products,
        sectors,
        rodizio,
        ...summary,
      });
    }

    if (
      req.method === "GET" &&
      (path === "/orders" || path === "/admin/orders")
    ) {
      const auth = dashboardAuth(req);
      if (!auth || !["OWNER", "MANAGER", "WAITER", "COUNTER"].includes(auth.user.role)) {
        return json(res, 401, { error: "Não autorizado." });
      }
      const commandId = String(req.query?.commandId || "");
      let orders = Object.values(store.orders).filter((o) => o.establishmentId === auth.establishment.id);
      if (commandId) orders = orders.filter((o) => o.commandId === commandId);
      orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return json(res, 200, { orders });
    }

    if (req.method === "POST" && path === "/orders") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente obrigatória." });
      if (guestAuth.participation.status !== "OPEN") {
        return json(res, 403, { error: "Sua participação não permite novos pedidos." });
      }

      const body = (req.body || {}) as {
        items: OrderLineInput[];
        notes?: string;
      };
      if (!body.items?.length) return json(res, 400, { error: "Carrinho vazio." });

      const est = guestAuth.establishment;
      if (!est.open) return json(res, 400, { error: "Estabelecimento indisponível." });
      const tbl = store.tables[guestAuth.participation.tableId];
      if (!tbl) return json(res, 404, { error: "Mesa inválida." });

      const sectors = Object.fromEntries(
        Object.values(store.sectors)
          .filter((sector) => sector.establishmentId === est.id)
          .map((sector) => [sector.id, { name: sector.name }]),
      );
      const resolved = resolveOrderLines(store, est.id, sectors, body.items);
      if (!resolved.ok) return json(res, resolved.status, { error: resolved.error });

      const command = getOrOpenCommand(tbl);
      const participation = store.guestParticipations[guestAuth.participation.id] || guestAuth.participation;
      if (participation.commandId !== command.id) {
        participation.commandId = command.id;
        store.guestParticipations[participation.id] = participation;
        saveStore(store);
      }

      try {
        const order = createOrder({
          establishmentId: est.id,
          table: tbl,
          commandId: command.id,
          guestParticipationId: guestAuth.participation.id,
          items: resolved.items,
          notes: body.notes,
          source: "MESA",
        });
        return json(res, 200, { order, total: order.total });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível criar o pedido.";
        return json(res, 403, { error: message });
      }
    }

    const orderMatch = path.match(/^\/orders\/([^/]+)$/);
    if (orderMatch) {
      const orderId = orderMatch[1];
      if (req.method === "GET") {
        const auth = adminAuth(req);
        if (!auth) return json(res, 401, { error: "Não autorizado." });
        const order = store.orders[orderId];
        if (!order || order.establishmentId !== auth.establishment.id) {
          return json(res, 404, { error: "Não encontrado" });
        }
        return json(res, 200, { order });
      }
      if (req.method === "PATCH") {
        const auth = validateSession(readAdminToken(req));
        if (
          !auth ||
          !["OWNER", "MANAGER", "KITCHEN", "COUNTER", "WAITER"].includes(auth.user.role)
        ) {
          return json(res, 401, { error: "Não autorizado." });
        }
        const body = (req.body || {}) as { status: OrderStatus };
        const order = updateOrderStatus(orderId, body.status, auth.establishment.id);
        if (!order) return json(res, 404, { error: "Pedido não encontrado." });
        return json(res, 200, { order });
      }
    }

    if (req.method === "POST" && path === "/auth/login") {
      const rl = rateLimitOrReject(res, "authLogin", clientIp(req));
      if (!rl) return;
      const body = (req.body || {}) as { email: string; password: string; turnstileToken?: string };
      const turnstile = await verifyTurnstileToken(body.turnstileToken, clientIp(req));
      if (!turnstile.ok) {
        return json(res, 400, { error: turnstile.error }, { extraHeaders: rateLimitHeaders(rl) });
      }
      const result = loginUser(String(body.email), String(body.password));
      if (result.error) return json(res, 401, { error: result.error }, { extraHeaders: rateLimitHeaders(rl) });
      return json(
        res,
        200,
        {
          user: publicUser(result.user!),
          establishment: result.establishment,
          token: result.session!.token,
        },
        {
          extraHeaders: {
            ...rateLimitHeaders(rl),
            "Set-Cookie": buildAdminSessionCookie(result.session!.token),
          },
        },
      );
    }

    if (req.method === "POST" && path === "/auth/logout") {
      return json(res, 200, { ok: true }, { extraHeaders: { "Set-Cookie": clearAdminSessionCookieValue() } });
    }

    if (req.method === "POST" && path === "/auth/register") {
      const rl = rateLimitOrReject(res, "authRegister", clientIp(req));
      if (!rl) return;
      const body = (req.body || {}) as {
        businessName: string;
        ownerName: string;
        email: string;
        password: string;
        businessType: string;
        operationMode?: string;
        tableCount?: number;
        privacyConsent?: unknown;
        inviteCode?: string;
        turnstileToken?: string;
      };
      const turnstile = await verifyTurnstileToken(body.turnstileToken, clientIp(req));
      if (!turnstile.ok) {
        return json(res, 400, { error: turnstile.error }, { extraHeaders: rateLimitHeaders(rl) });
      }
      const operationMode = isOperationMode(body.operationMode)
        ? (body.operationMode as OperationMode)
        : undefined;
      const result = registerEstablishment({
        businessName: String(body.businessName || ""),
        ownerName: String(body.ownerName || ""),
        email: String(body.email || ""),
        password: String(body.password || ""),
        businessType: (body.businessType || "restaurante") as
          | "restaurante"
          | "lanchonete"
          | "padaria"
          | "bar"
          | "cafeteria"
          | "rodizio",
        operationMode,
        tableCount: Number(body.tableCount) || 5,
        privacyConsent: body.privacyConsent,
        inviteCode: body.inviteCode,
      });
      if (result.error) return json(res, 400, { error: result.error }, { extraHeaders: rateLimitHeaders(rl) });
      return json(
        res,
        201,
        {
          user: publicUser(result.user!),
          establishment: result.establishment,
          token: result.session!.token,
        },
        {
          extraHeaders: {
            ...rateLimitHeaders(rl),
            "Set-Cookie": buildAdminSessionCookie(result.session!.token),
          },
        },
      );
    }

    if (req.method === "GET" && path === "/auth/me") {
      const auth = validateSession(readAdminToken(req));
      if (!auth) return json(res, 401, { error: "Sessão inválida." });
      return json(res, 200, {
        user: publicUser(auth.user),
        establishment: auth.establishment,
      });
    }

    if (req.method === "POST" && path === "/platform/auth/login") {
      const rl = rateLimitOrReject(res, "authLogin", `${clientIp(req)}:platform`);
      if (!rl) return;
      const body = (req.body || {}) as { email?: string; password?: string; turnstileToken?: string };
      const turnstile = await verifyTurnstileToken(body.turnstileToken, clientIp(req));
      if (!turnstile.ok) {
        return json(res, 400, { error: turnstile.error }, { extraHeaders: rateLimitHeaders(rl) });
      }
      const result = loginPlatformUser(String(body.email ?? ""), String(body.password ?? ""));
      if ("error" in result) return json(res, 401, { error: result.error }, { extraHeaders: rateLimitHeaders(rl) });
      return json(
        res,
        200,
        { user: result.user, token: result.token },
        {
          extraHeaders: {
            ...rateLimitHeaders(rl),
            "Set-Cookie": buildPlatformSessionCookie(result.token),
          },
        },
      );
    }

    if (req.method === "POST" && path === "/platform/auth/logout") {
      return json(res, 200, { ok: true }, { extraHeaders: { "Set-Cookie": clearPlatformSessionCookieValue() } });
    }

    if (req.method === "GET" && path === "/platform/auth/me") {
      const auth = platformAuth(req);
      if (!auth) return json(res, 401, { error: "Acesso negado." });
      return json(res, 200, { user: publicPlatformUser(auth.user) });
    }

    if (req.method === "GET" && path === "/platform/dashboard") {
      const auth = platformAuth(req);
      if (!auth) return json(res, 401, { error: "Acesso negado." });
      const period = parseDashboardPeriod(String(req.query?.period || ""));
      return json(res, 200, platformDashboard(period));
    }

    if (req.method === "GET" && path === "/platform/merchants") {
      const auth = platformAuth(req);
      if (!auth) return json(res, 401, { error: "Acesso negado." });
      const merchants = listMerchants({
        q: String(req.query?.q || "") || undefined,
        status: parsePlatformStatusFilterInput(String(req.query?.status || "")),
        plan: parsePlatformPlanFilter(String(req.query?.plan || "")),
      });
      return json(res, 200, { merchants });
    }

    const platformMerchantMatch = path.match(/^\/platform\/merchants\/([^/]+)$/);
    if (platformMerchantMatch) {
      const auth = platformAuth(req);
      if (!auth) return json(res, 401, { error: "Acesso negado." });
      const merchantId = platformMerchantMatch[1];
      if (req.method === "GET") {
        const merchant = getMerchantDetail(merchantId);
        if (!merchant) return json(res, 404, { error: "Lojista não encontrado." });
        return json(res, 200, { merchant });
      }
      if (req.method === "PATCH") {
        const body = (req.body || {}) as {
          platformStatus?: unknown;
          plan?: unknown;
          reason?: string;
        };
        const platformStatus =
          body.platformStatus !== undefined
            ? parsePlatformStatusInput(body.platformStatus)
            : undefined;
        if (body.platformStatus !== undefined && !platformStatus) {
          return json(res, 400, {
            error: "platformStatus inválido (pending, active, inactive, suspended, rejected).",
          });
        }
        const plan = body.plan !== undefined ? parsePlatformPlan(body.plan) : undefined;
        if (body.plan !== undefined && !plan) {
          return json(res, 400, { error: "Plano inválido (essencial, premium, custom)." });
        }
        const result = updateMerchant(merchantId, {
          platformStatus: platformStatus ?? undefined,
          plan: plan ?? undefined,
          reason: body.reason,
        });
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { merchant: result.value });
      }
    }

    if (req.method === "POST" && path === "/bill") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente obrigatória." });
      const result = requestGuestClosing(guestAuth.participation.id, "TABLE");
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, {
        ok: true,
        closingRequest: result.value.closingRequest,
        scope: "TABLE",
      });
    }

    if (req.method === "POST" && path === "/guest/closing/request") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente inválida." });
      const body = (req.body || {}) as {
        scope?: "SELF" | "SELECTED" | "TABLE";
        targetGuestParticipationIds?: string[];
      };
      const scope = body.scope || "TABLE";
      const result = requestGuestClosing(
        guestAuth.participation.id,
        scope,
        body.targetGuestParticipationIds || [],
      );
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, {
        closingRequest: result.value.closingRequest,
        participation: publicParticipation(result.value.participation),
      });
    }

    if (req.method === "POST" && path === "/guest/closing/cancel") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente inválida." });
      const result = cancelGuestClosing(guestAuth.participation.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, {
        cancelled: result.value.cancelled,
        participation: publicParticipation(result.value.participation),
      });
    }

    if (req.method === "GET" && path === "/guest/closing/status") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente inválida." });
      const status = getGuestClosingStatus(guestAuth.participation.id);
      if (!status) return json(res, 404, { error: "Participação não encontrada." });
      return json(res, 200, status);
    }

    if (req.method === "GET" && path === "/kds/queue") {
      const auth = kitchenAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const sectorId = String(req.query?.sector || req.query?.sectorId || "");
      if (!sectorId) return json(res, 400, { error: "Setor obrigatório." });
      const queue = getKdsQueue(auth.establishment.id, sectorId);
      if (!queue) return json(res, 404, { error: "Setor não encontrado." });
      return json(res, 200, queue);
    }

    if (req.method === "GET" && path === "/admin/dsr/export") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (auth.user.role !== "OWNER") {
        return json(res, 403, { error: "Somente o titular OWNER pode exportar dados." });
      }
      const result = exportMerchantSubjectData(auth.user.id, auth.establishment.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result);
    }

    if (req.method === "POST" && path === "/admin/dsr/delete") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const body = (req.body || {}) as { confirm?: boolean };
      if (body.confirm !== true) return json(res, 400, { error: 'Confirme com { "confirm": true }.' });
      const result = deleteMerchantSubjectData(auth.user.id, auth.establishment.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result);
    }

    if (req.method === "GET" && path === "/admin/dashboard") {
      const auth = dashboardAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const est = auth.establishment;
      const stats = dashboardStats(est.id);
      const orders = Object.values(store.orders)
        .filter((o) => o.establishmentId === est.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const tables = Object.values(store.tables).filter((t) => t.establishmentId === est.id);
      const sectors = Object.values(store.sectors).filter((s) => s.establishmentId === est.id && s.active);
      const notifications = Object.values(store.notifications)
        .filter((n) => n.establishmentId === est.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 20);
      const commands = Object.values(store.commands).filter((c) => c.establishmentId === est.id);
      const categories = Object.values(store.categories).filter((c) => c.establishmentId === est.id);
      const products = Object.values(store.products).filter((p) => p.establishmentId === est.id);
      return json(res, 200, {
        establishment: est,
        persist: persistStatus(),
        stats,
        orders,
        tables,
        sectors,
        commands,
        notifications,
        categories,
        products,
      });
    }

    if (path === "/admin/password") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "PATCH") {
        const body = (req.body || {}) as { currentPassword?: string; newPassword?: string };
        const result = changeUserPassword(
          auth.user.id,
          auth.establishment.id,
          String(body.currentPassword ?? ""),
          String(body.newPassword ?? ""),
        );
        if ("error" in result) return json(res, result.status ?? 400, { error: result.error });
        return json(res, 200, result.value);
      }
    }

    if (path === "/admin/settings") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "GET") {
        const establishment = getAdminSettings(auth.establishment.id);
        if (!establishment) {
          return json(res, 404, { error: "Estabelecimento não encontrado." });
        }
        return json(res, 200, { establishment });
      }
      if (req.method === "PATCH") {
        const result = updateAdminSettings(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { establishment: result.value });
      }
    }

    if (path === "/admin/products") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "GET") {
        return json(res, 200, listAdminProducts(auth.establishment.id));
      }
      if (req.method === "POST") {
        const result = createAdminProduct(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 201, { product: result.value });
      }
    }

    if (path === "/admin/categories") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "GET") {
        return json(res, 200, { categories: listAdminCategories(auth.establishment.id) });
      }
      if (req.method === "POST") {
        const result = createAdminCategory(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 201, { category: result.value });
      }
    }

    const adminCategoryMatch = path.match(/^\/admin\/categories\/([^/]+)$/);
    if (adminCategoryMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "PATCH") {
        const result = updateAdminCategory(auth.establishment.id, adminCategoryMatch[1], req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { category: result.value });
      }
      if (req.method === "DELETE") {
        const result = deleteAdminCategory(auth.establishment.id, adminCategoryMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { category: result.value });
      }
    }

    if (req.method === "POST" && path === "/admin/media/upload") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const parsed = parseBase64UploadBody(req.body);
      if ("error" in parsed) return json(res, 400, { error: parsed.error });
      const result = await uploadProductImage(auth.establishment.id, parsed);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 201, result);
    }

    if (req.method === "GET" && path === "/admin/operations") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER", "WAITER"]);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      return json(res, 200, listAdminOperations(auth.establishment.id));
    }

    const tableActivateMatch = path.match(/^\/admin\/tables\/([^/]+)\/activate$/);
    if (tableActivateMatch && req.method === "POST") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER", "WAITER"]);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = activateTable(auth.establishment.id, tableActivateMatch[1], auth.user.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }

    const guestKickMatch = path.match(/^\/admin\/guests\/([^/]+)\/kick$/);
    if (guestKickMatch && req.method === "POST") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = kickGuestParticipation(auth.establishment.id, guestKickMatch[1], auth.user.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }

    const forceClearMatch = path.match(/^\/admin\/tables\/([^/]+)\/force-clear$/);
    if (forceClearMatch && req.method === "POST") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = forceClearTable(auth.establishment.id, forceClearMatch[1], auth.user.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }

    const adminProductMatch = path.match(/^\/admin\/products\/([^/]+)$/);
    if (adminProductMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "PATCH") {
        const result = updateAdminProduct(auth.establishment.id, adminProductMatch[1], req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { product: result.value });
      }
      if (req.method === "DELETE") {
        const result = deleteAdminProduct(auth.establishment.id, adminProductMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { product: result.value });
      }
    }

    if (path === "/admin/tables") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "GET") {
        return json(res, 200, { tables: listAdminTables(auth.establishment.id) });
      }
      if (req.method === "POST") {
        const result = createAdminTable(auth.establishment.id, req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 201, { table: result.value });
      }
    }

    const cockpitMatch = path.match(/^\/admin\/tables\/([^/]+)\/cockpit$/);
    if (cockpitMatch) {
      const auth = staffAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "GET") {
        const cockpit = getTableCockpit(auth.establishment.id, cockpitMatch[1]);
        if (!cockpit) return json(res, 404, { error: "Mesa não encontrada." });
        return json(res, 200, cockpit);
      }
    }

    const commandPaymentsMatch = path.match(/^\/admin\/commands\/([^/]+)\/payments$/);
    if (commandPaymentsMatch && req.method === "POST") {
      const auth = staffAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = registerPayment(
        auth.establishment.id,
        commandPaymentsMatch[1],
        req.body,
        auth.user,
      );
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 201, result.value);
    }

    const commandSettleMatch = path.match(/^\/admin\/commands\/([^/]+)\/settle$/);
    if (commandSettleMatch && req.method === "POST") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER"]);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = settleCommand(auth.establishment.id, commandSettleMatch[1], auth.user);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }

    const commandSplitsMatch = path.match(/^\/admin\/commands\/([^/]+)\/splits$/);
    if (commandSplitsMatch && req.method === "PUT") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER"]);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = replaceOrderItemSplits(
        auth.establishment.id,
        commandSplitsMatch[1],
        req.body,
        auth.user.id,
      );
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }

    const closingConfirmMatch = path.match(/^\/admin\/closing\/([^/]+)\/confirm$/);
    if (closingConfirmMatch && req.method === "POST") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER"]);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = confirmClosingRequest(auth.establishment.id, closingConfirmMatch[1], auth.user);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }

    const paymentVoidMatch = path.match(/^\/admin\/payments\/([^/]+)\/void$/);
    if (paymentVoidMatch && req.method === "POST") {
      const auth = staffAuth(req, ["OWNER", "MANAGER", "COUNTER"]);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = voidPayment(auth.establishment.id, paymentVoidMatch[1], auth.user);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }

    const notificationReadMatch = path.match(/^\/admin\/notifications\/([^/]+)\/read$/);
    if (notificationReadMatch && req.method === "POST") {
      const auth = staffAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = markNotificationRead(auth.establishment.id, notificationReadMatch[1]);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }

    if (req.method === "GET" && path === "/admin/integrations") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      ensureIntegrationCatalog(auth.establishment.id);
      return json(res, 200, listIntegrations(auth.establishment.id));
    }

    const integrationConnectMatch = path.match(/^\/admin\/integrations\/([^/]+)\/connect$/);
    if (integrationConnectMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const provider = integrationConnectMatch[1];
      if (req.method === "POST") {
        const body = (req.body || {}) as { config?: Record<string, string> };
        const result = connectIntegration(
          auth.establishment.id,
          provider,
          body.config || {},
          auth.user.id,
        );
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, result.value);
      }
      if (req.method === "DELETE") {
        const result = disconnectIntegration(auth.establishment.id, provider, auth.user.id);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, result.value);
      }
    }

    if (req.method === "POST" && path === "/admin/integrations/webhook/test") {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      const result = await testWebhookStub(auth.establishment.id);
      if ("error" in result) return json(res, result.status, { error: result.error });
      return json(res, 200, result.value);
    }

    const regenerateQrMatch = path.match(/^\/admin\/tables\/([^/]+)\/regenerate-qr$/);
    if (regenerateQrMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "POST") {
        const result = regenerateAdminTableQr(auth.establishment.id, regenerateQrMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { table: result.value });
      }
    }

    const adminTableMatch = path.match(/^\/admin\/tables\/([^/]+)$/);
    if (adminTableMatch) {
      const auth = adminAuth(req);
      if (!auth) return json(res, 401, { error: "Não autorizado." });
      if (req.method === "PATCH") {
        const result = updateAdminTable(auth.establishment.id, adminTableMatch[1], req.body);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { table: result.value });
      }
      if (req.method === "DELETE") {
        const result = deleteAdminTable(auth.establishment.id, adminTableMatch[1]);
        if ("error" in result) return json(res, result.status, { error: result.error });
        return json(res, 200, { deleted: result.value.id });
      }
    }

    if (req.method === "POST" && path === "/rodizio/round") {
      const guestAuth = validateClientSession(readGuestToken(req));
      if (!guestAuth) return json(res, 401, { error: "Sessão de cliente obrigatória." });
      if (guestAuth.participation.status !== "OPEN") {
        return json(res, 403, { error: "Sua participação não permite novos pedidos." });
      }

      const body = (req.body || {}) as {
        rodizioId: string;
        items: OrderLineInput[];
      };
      const est = guestAuth.establishment;
      if (!est.rodizioEnabled) return json(res, 400, { error: "Rodízio indisponível." });
      const table = store.tables[guestAuth.participation.tableId];
      if (!table) return json(res, 404, { error: "Mesa inválida." });
      const rodizio = store.rodizios[body.rodizioId];
      if (!rodizio || rodizio.establishmentId !== est.id) {
        return json(res, 404, { error: "Rodízio não encontrado." });
      }
      const sectors = Object.fromEntries(
        Object.values(store.sectors)
          .filter((sector) => sector.establishmentId === est.id)
          .map((sector) => [sector.id, { name: sector.name }]),
      );
      const resolved = resolveOrderLines(store, est.id, sectors, body.items, {
        unitPriceFor: (product) => {
          if (rodizio.premiumProductIds.includes(product.id)) {
            return product.rodizioPremiumPrice ?? product.price;
          }
          if (rodizio.productIds.includes(product.id)) return 0;
          return product.price;
        },
      });
      if (!resolved.ok) return json(res, resolved.status, { error: resolved.error });
      if (resolved.items.length > rodizio.maxItemsPerRound) {
        return json(res, 400, { error: `Máximo ${rodizio.maxItemsPerRound} itens por rodada.` });
      }
      const command = getOrOpenCommand(table);
      const round = createRodizioRound({
        establishmentId: est.id,
        table,
        commandId: command.id,
        guestParticipationId: guestAuth.participation.id,
        rodizioId: body.rodizioId,
        items: resolved.items,
      });
      return json(res, 200, { round, message: "Rodada enviada para a cozinha." });
    }

    return json(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("[mesaflow] handler error", err);
    return json(res, 500, { error: "Internal error" });
  }
}
