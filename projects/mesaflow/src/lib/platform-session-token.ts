import { createHmac, timingSafeEqual } from "crypto";

const PLATFORM_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type PlatformTokenClaims = {
  scope: "platform";
  platformUserId: string;
  exp: number;
};

function secret() {
  return (
    process.env.MESAFLOW_PLATFORM_SESSION_SECRET ||
    process.env.MESAFLOW_ADMIN_SESSION_SECRET ||
    process.env.MESAFLOW_IDENTITY_SECRET ||
    "mesaflow-dev-only-change-in-production"
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

export function issuePlatformSessionToken(
  platformUserId: string,
  ttlMs = PLATFORM_SESSION_TTL_MS,
): string {
  const claims: PlatformTokenClaims = {
    scope: "platform",
    platformUserId,
    exp: Date.now() + ttlMs,
  };
  const payloadB64 = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function parsePlatformSessionToken(token: string): PlatformTokenClaims | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig || !verifySig(payloadB64, sig)) return null;
  try {
    const claims = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as PlatformTokenClaims;
    if (claims.scope !== "platform" || !claims.platformUserId || !claims.exp) return null;
    if (Date.now() > claims.exp) return null;
    return claims;
  } catch {
    return null;
  }
}
