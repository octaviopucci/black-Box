import { appendAuditEvent } from "./audit-log";
import { issuePlatformSessionToken, parsePlatformSessionToken } from "./platform-session-token";
import { getMerchantDetail, listMerchants, platformDashboard } from "./platform-analytics";
import { hashPassword, id, verifyPassword } from "./crypto-utils";
import { PLATFORM_OWNER_LOGIN } from "./demo";
import { ensureProductionSeed } from "./production-seed";
import { getStore, saveStore } from "./store";
import type { PlatformStatus, PlatformUser } from "./types";

const PLATFORM_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function findPlatformUserByEmail(email: string): PlatformUser | undefined {
  const normalized = email.toLowerCase().trim();
  return Object.values(getStore().platformUsers || {}).find((u) => u.email === normalized);
}

export function publicPlatformUser(user: PlatformUser) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

type PlatformLoginResult =
  | { token: string; user: ReturnType<typeof publicPlatformUser> }
  | { error: string; status?: number };

function attemptPlatformLogin(email: string, password: string): PlatformLoginResult {
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

/** Never throws — seeds empty store then retries; 401 only for invalid credentials. */
export function loginPlatformUser(email: string, password: string): PlatformLoginResult {
  ensureProductionSeed();

  const run = (): PlatformLoginResult => {
    try {
      return attemptPlatformLogin(email, password);
    } catch (error) {
      console.warn("[mesaflow] platform login attempt failed", error);
      return { error: "E-mail ou senha inválidos.", status: 503 };
    }
  };

  let result = run();
  if ("error" in result && result.error === "E-mail ou senha inválidos." && !result.status) {
    const store = getStore();
    if (
      Object.keys(store.platformUsers || {}).length === 0 ||
      Object.keys(store.establishments).length === 0
    ) {
      ensureProductionSeed();
      result = run();
    }
  }

  if ("error" in result && result.status) {
    ensureProductionSeed();
    const retry = run();
    if (!("error" in retry) || retry.error === "E-mail ou senha inválidos.") return retry;
  }

  return result;
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

/** @deprecated Prefer ensureProductionSeed — kept for tests and explicit platform-only seed. */
export function ensurePlatformOwnerSeed() {
  ensureProductionSeed();
  const store = getStore();
  if (Object.keys(store.platformUsers || {}).length === 0) return null;
  const email = (
    process.env.MESAFLOW_PLATFORM_OWNER_EMAIL?.trim() || PLATFORM_OWNER_LOGIN.email
  ).toLowerCase();
  return findPlatformUserByEmail(email) ?? null;
}

export function updateMerchantStatus(
  establishmentId: string,
  status: PlatformStatus,
  reason?: string,
) {
  const store = getStore();
  const establishment = store.establishments[establishmentId];
  if (!establishment) return { error: "Estabelecimento não encontrado.", status: 404 };

  establishment.platformStatus = status;
  if (status === "suspended") {
    establishment.suspendedAt = new Date().toISOString();
    establishment.suspendedReason = reason?.trim() || undefined;
  } else {
    establishment.suspendedAt = undefined;
    establishment.suspendedReason = undefined;
  }

  appendAuditEvent(store, {
    establishmentId,
    type: "platform.merchant_status",
    actorType: "PLATFORM",
    targetType: "establishment",
    targetId: establishmentId,
    metadata: { status, reason: reason?.trim() || null },
  });
  saveStore(store);
  return { value: getMerchantDetail(establishmentId)! };
}

export { listMerchants, getMerchantDetail, platformDashboard };
