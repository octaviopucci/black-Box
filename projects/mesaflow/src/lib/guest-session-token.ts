import { createHmac, timingSafeEqual } from "crypto";
import { resolveSecret } from "./production-secrets";
import type { GuestParticipation, GuestParticipationStatus } from "./types";

const CLIENT_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export type GuestTokenClaims = {
  v: 2;
  id: string;
  establishmentId: string;
  commandId: string;
  tableId: string;
  phoneLookupHash: string;
  phoneDisplay: string;
  displayName?: string;
  participantIndex: number;
  status: GuestParticipationStatus;
  joinedAt: string;
  verifiedAt: string;
  exp: number;
};

function secret() {
  return resolveSecret(
    ["MESAFLOW_CLIENT_SESSION_SECRET", "MESAFLOW_IDENTITY_SECRET"],
    "guest session signing",
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

export function claimsFromParticipation(
  participation: GuestParticipation,
  ttlMs = CLIENT_SESSION_TTL_MS,
): GuestTokenClaims {
  return {
    v: 2,
    id: participation.id,
    establishmentId: participation.establishmentId,
    commandId: participation.commandId,
    tableId: participation.tableId,
    phoneLookupHash: participation.phoneLookupHash,
    phoneDisplay: participation.phoneDisplay,
    displayName: participation.displayName,
    participantIndex: participation.participantIndex,
    status: participation.status,
    joinedAt: participation.joinedAt,
    verifiedAt: participation.verifiedAt,
    exp: Date.now() + ttlMs,
  };
}

export function issueGuestSessionToken(
  participation: GuestParticipation,
  ttlMs = CLIENT_SESSION_TTL_MS,
): string {
  const payloadB64 = Buffer.from(JSON.stringify(claimsFromParticipation(participation, ttlMs))).toString(
    "base64url",
  );
  return `${payloadB64}.${sign(payloadB64)}`;
}

/** @deprecated Use parseGuestTokenClaims — kept for tests */
export function parseGuestSessionToken(token: string): string | null {
  const claims = parseGuestTokenClaims(token);
  return claims?.id || null;
}

export function parseGuestTokenClaims(token: string): GuestTokenClaims | null {
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig || !verifySig(payloadB64, sig)) return null;

  let raw: string;
  try {
    raw = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return null;
  }

  if (raw.startsWith("{")) {
    try {
      const claims = JSON.parse(raw) as GuestTokenClaims;
      if (claims.v !== 2 || !claims.id || !claims.establishmentId || !claims.tableId) return null;
      if (Date.now() > claims.exp) return null;
      return claims;
    } catch {
      return null;
    }
  }

  const [participationId, expStr] = raw.split(":");
  if (!participationId || !expStr) return null;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  return null;
}
