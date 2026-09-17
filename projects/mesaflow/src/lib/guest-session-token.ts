import { createHmac, timingSafeEqual } from "crypto";

const CLIENT_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function secret() {
  return (
    process.env.MESAFLOW_CLIENT_SESSION_SECRET ||
    process.env.MESAFLOW_IDENTITY_SECRET ||
    "mesaflow-dev-only-change-in-production"
  );
}

export function issueGuestSessionToken(participationId: string, ttlMs = CLIENT_SESSION_TTL_MS): string {
  const exp = Date.now() + ttlMs;
  const payload = `${participationId}:${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${sig}`;
}

export function parseGuestSessionToken(token: string): string | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;
  let payload: string;
  try {
    payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null;
  const [participationId, expStr] = payload.split(":");
  if (!participationId || !expStr) return null;
  if (Date.now() > Number(expStr)) return null;
  return participationId;
}
