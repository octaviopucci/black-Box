import type { MesaFlowStore } from "./types";

export const RETENTION_MS = {
  otpChallenge: 24 * 60 * 60 * 1000,
  closedGuest: 90 * 24 * 60 * 60 * 1000,
  revokedToken: 90 * 24 * 60 * 60 * 1000,
  clientSession: 90 * 24 * 60 * 60 * 1000,
} as const;

export type PurgeStats = {
  otpChallenges: number;
  clientSessions: number;
  revokedGuestTokenHashes: number;
  guestParticipations: number;
  guestPhoneSecrets: number;
};

function anonymizeParticipationId(participationId: string) {
  return participationId.replace(/^gp_/, "gp_anon_");
}

export function purgeStaleData(store: MesaFlowStore): PurgeStats {
  const stats: PurgeStats = {
    otpChallenges: 0,
    clientSessions: 0,
    revokedGuestTokenHashes: 0,
    guestParticipations: 0,
    guestPhoneSecrets: 0,
  };
  const now = Date.now();

  store.otpChallenges ||= {};
  for (const [id, challenge] of Object.entries(store.otpChallenges)) {
    const expired = new Date(challenge.expiresAt).getTime() + RETENTION_MS.otpChallenge < now;
    if (expired || challenge.consumedAt) {
      delete store.otpChallenges[id];
      stats.otpChallenges += 1;
    }
  }

  store.clientSessions ||= {};
  for (const [id, session] of Object.entries(store.clientSessions)) {
    const expired = new Date(session.expiresAt).getTime() < now;
    const revokedOld =
      session.revokedAt &&
      new Date(session.revokedAt).getTime() + RETENTION_MS.clientSession < now;
    if (expired || revokedOld) {
      delete store.clientSessions[id];
      stats.clientSessions += 1;
    }
  }

  store.revokedGuestTokenHashes ||= {};
  for (const [hash, revokedAt] of Object.entries(store.revokedGuestTokenHashes)) {
    if (new Date(revokedAt).getTime() + RETENTION_MS.revokedToken < now) {
      delete store.revokedGuestTokenHashes[hash];
      stats.revokedGuestTokenHashes += 1;
    }
  }

  for (const participation of Object.values(store.guestParticipations)) {
    if (participation.status !== "CLOSED" || !participation.closedAt) continue;
    if (new Date(participation.closedAt).getTime() + RETENTION_MS.closedGuest >= now) continue;

    delete store.guestPhoneSecrets[participation.id];
    stats.guestPhoneSecrets += 1;
    participation.phoneDisplay = "+** ****-****";
    participation.displayName = "Anônimo";
    participation.phoneLookupHash = anonymizeParticipationId(participation.id);
    store.guestParticipations[participation.id] = participation;
    stats.guestParticipations += 1;
  }

  return stats;
}
