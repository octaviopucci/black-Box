import { createHmac, timingSafeEqual } from "crypto";
import { resolveSecret } from "./production-secrets";

const ADMIN_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type AdminTokenClaims = {
  userId: string;
  establishmentId: string;
  exp: number;
};

function secret() {
  return resolveSecret(
    ["MESAFLOW_ADMIN_SESSION_SECRET", "MESAFLOW_IDENTITY_SECRET"],
    "admin session signing",
  );
}

function sign(payloadB64: string) {
  return createHmac("sha256", secret()).update(payloadB64).digest("base64url");
}

function verifySig(payloadB64: string, sig: string) {
  const expected = sign(payloadB64);
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
}

export function issueAdminSessionToken(
  userId: string,
  establishmentId: string,
  ttlMs = ADMIN_SESSION_TTL_MS,
): string {
  const claims: AdminTokenClaims = { userId, establishmentId, exp: Date.now() + ttlMs };
  const payloadB64 = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function parseAdminSessionToken(token: string): AdminTokenClaims | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig || !verifySig(payloadB64, sig)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as AdminTokenClaims;
    if (!claims.userId || !claims.establishmentId || !claims.exp) return null;
    if (Date.now() > claims.exp) return null;
    return claims;
  } catch {
    return null;
  }
}
