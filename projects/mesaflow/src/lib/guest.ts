import { id } from "./crypto-utils";
import {
  decryptPhone,
  encryptPhone,
  generateClientSessionToken,
  generateOtpCode,
  hashToken,
  maskPhoneDisplay,
  normalizePhoneE164,
  otpCodeHash,
  phoneLookupHash,
} from "./identity-crypto";
import { isOtpBypassCode } from "./otp-bypass";
import { getStore, saveStore, getOrOpenCommand, getActiveCommand } from "./store";
import type {
  ClientSession,
  Establishment,
  GuestParticipation,
  MesaFlowStore,
  OtpChallenge,
  Table,
} from "./types";

const CLIENT_SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

export function otpRequiredForEstablishment(est: Establishment): boolean {
  if (process.env.MESAFLOW_DEV_SKIP_OTP === "1") return false;
  return est.settings.otpRequired !== false;
}

export function findOpenParticipation(
  store: MesaFlowStore,
  commandId: string,
  lookupHash: string,
): GuestParticipation | null {
  return (
    Object.values(store.guestParticipations).find(
      (gp) =>
        gp.commandId === commandId &&
        gp.phoneLookupHash === lookupHash &&
        (gp.status === "OPEN" || gp.status === "CLOSING_REQUESTED"),
    ) || null
  );
}

function nextParticipantIndex(store: MesaFlowStore, commandId: string): number {
  const active = Object.values(store.guestParticipations).filter(
    (gp) =>
      gp.commandId === commandId && gp.status !== "CLOSED",
  );
  return active.length + 1;
}

export function upsertGuestPhoneSecret(participationId: string, phoneE164: string) {
  const store = getStore();
  store.guestPhoneSecrets[participationId] = { phoneCiphertext: encryptPhone(phoneE164) };
  saveStore(store);
}

export function createGuestParticipation(input: {
  establishment: Establishment;
  table: Table;
  commandId: string;
  phoneE164: string;
  displayName?: string;
}): GuestParticipation {
  const store = getStore();
  const lookup = phoneLookupHash(input.establishment.id, input.phoneE164);
  const existing = findOpenParticipation(store, input.commandId, lookup);
  if (existing) return existing;

  const participation: GuestParticipation = {
    id: id("gp_"),
    establishmentId: input.establishment.id,
    commandId: input.commandId,
    tableId: input.table.id,
    phoneLookupHash: lookup,
    phoneDisplay: maskPhoneDisplay(input.phoneE164),
    displayName: input.displayName?.trim() || undefined,
    participantIndex: nextParticipantIndex(store, input.commandId),
    status: "OPEN",
    joinedAt: new Date().toISOString(),
    verifiedAt: new Date().toISOString(),
    orderCount: 0,
  };
  store.guestParticipations[participation.id] = participation;
  upsertGuestPhoneSecret(participation.id, input.phoneE164);
  saveStore(store);
  return participation;
}

export function createClientSession(participationId: string): { token: string; session: ClientSession } {
  const store = getStore();
  const token = generateClientSessionToken();
  const now = new Date();
  const session: ClientSession = {
    id: id("cs_"),
    guestParticipationId: participationId,
    tokenHash: hashToken(token),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CLIENT_SESSION_TTL_MS).toISOString(),
    lastSeenAt: now.toISOString(),
  };
  store.clientSessions[session.id] = session;
  saveStore(store);
  return { token, session };
}

export function validateClientSession(token: string | undefined | null) {
  if (!token?.trim()) return null;
  const store = getStore();
  const tokenHash = hashToken(token.trim());
  const session = Object.values(store.clientSessions).find(
    (entry) => entry.tokenHash === tokenHash && !entry.revokedAt,
  );
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;

  const participation = store.guestParticipations[session.guestParticipationId];
  if (!participation || participation.status === "CLOSED") return null;

  session.lastSeenAt = new Date().toISOString();
  store.clientSessions[session.id] = session;
  saveStore(store);

  const establishment = store.establishments[participation.establishmentId];
  if (!establishment) return null;

  return { session, participation, establishment };
}

export function revokeClientSession(token: string | undefined | null) {
  if (!token?.trim()) return;
  const store = getStore();
  const tokenHash = hashToken(token.trim());
  const session = Object.values(store.clientSessions).find((entry) => entry.tokenHash === tokenHash);
  if (!session) return;
  session.revokedAt = new Date().toISOString();
  store.clientSessions[session.id] = session;
  saveStore(store);
}

export function joinGuestAtTable(input: {
  establishment: Establishment;
  table: Table;
  phoneE164: string;
  displayName?: string;
}) {
  const store = getStore();
  const command = getOrOpenCommand(input.table);
  const lookup = phoneLookupHash(input.establishment.id, input.phoneE164);
  const existing = findOpenParticipation(store, command.id, lookup);
  const participation =
    existing ||
    createGuestParticipation({
      establishment: input.establishment,
      table: input.table,
      commandId: command.id,
      phoneE164: input.phoneE164,
      displayName: input.displayName,
    });
  const { token } = createClientSession(participation.id);
  return {
    token,
    participation,
    command,
    message: existing ? "Você já está participando desta mesa." : undefined,
  };
}

export function requestOtpChallenge(input: {
  establishment: Establishment;
  table: Table;
  phoneRaw: string;
  purpose: OtpChallenge["purpose"];
}) {
  const phoneE164 = normalizePhoneE164(input.phoneRaw);
  if (!phoneE164) return { error: "Telefone inválido." as const };

  const command = getActiveCommand(input.table) || getOrOpenCommand(input.table);
  const store = getStore();
  const lookup = phoneLookupHash(input.establishment.id, phoneE164);

  for (const challenge of Object.values(store.otpChallenges)) {
    if (
      challenge.commandId === command.id &&
      challenge.phoneLookupHash === lookup &&
      !challenge.consumedAt &&
      new Date(challenge.expiresAt).getTime() > Date.now()
    ) {
      challenge.consumedAt = new Date().toISOString();
      store.otpChallenges[challenge.id] = challenge;
    }
  }

  const code = generateOtpCode();
  const challengeId = id("otp_");
  const challenge: OtpChallenge = {
    id: challengeId,
    establishmentId: input.establishment.id,
    commandId: command.id,
    tableId: input.table.id,
    phoneLookupHash: lookup,
    codeHash: otpCodeHash(challengeId, code),
    purpose: input.purpose,
    expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    attempts: 0,
    maxAttempts: OTP_MAX_ATTEMPTS,
    sentAt: new Date().toISOString(),
    resendCount: 0,
  };
  store.otpChallenges[challenge.id] = challenge;
  storePhoneForOtpLookup(input.establishment.id, phoneE164);
  saveStore(store);

  const mockCode =
    process.env.MESAFLOW_OTP_MOCK === "1" || process.env.MESAFLOW_DEV_SKIP_OTP === "1"
      ? code
      : undefined;

  return { challengeId: challenge.id, mockCode };
}

export function verifyOtpChallenge(input: {
  challengeId: string;
  code: string;
  displayName?: string;
}) {
  const store = getStore();
  const challenge = store.otpChallenges[input.challengeId];
  if (!challenge || challenge.consumedAt) {
    return { error: "Código inválido ou expirado." as const };
  }
  if (new Date(challenge.expiresAt).getTime() < Date.now()) {
    return { error: "Código expirado." as const };
  }
  if (challenge.attempts >= challenge.maxAttempts) {
    return { error: "Limite de tentativas excedido." as const };
  }

  const code = input.code.trim();
  const expected = otpCodeHash(challenge.id, code);
  if (expected !== challenge.codeHash && !isOtpBypassCode(code)) {
    challenge.attempts += 1;
    store.otpChallenges[challenge.id] = challenge;
    saveStore(store);
    return { error: "Código incorreto." as const };
  }

  challenge.consumedAt = new Date().toISOString();
  store.otpChallenges[challenge.id] = challenge;

  const establishment = store.establishments[challenge.establishmentId];
  const table = store.tables[challenge.tableId];
  if (!establishment || !table) return { error: "Mesa indisponível." as const };

  const secret = store.guestPhoneSecrets[challenge.phoneLookupHash];
  const phoneE164 = secret ? decryptPhone(secret.phoneCiphertext) : null;
  if (!phoneE164) return { error: "Telefone não encontrado para este código." as const };

  const participation = createGuestParticipation({
    establishment,
    table,
    commandId: challenge.commandId,
    phoneE164,
    displayName: input.displayName,
  });
  const { token } = createClientSession(participation.id);
  saveStore(store);
  return { token, participation };
}

export function guestTableSummary(establishmentId: string, commandId: string | undefined) {
  const store = getStore();
  if (!commandId) {
    return { participantCount: 0, tableTotal: 0 };
  }
  const participants = Object.values(store.guestParticipations).filter(
    (gp) => gp.commandId === commandId && gp.status !== "CLOSED",
  );
  const command = store.commands[commandId];
  return {
    participantCount: participants.length,
    tableTotal: command?.total || 0,
  };
}

export function publicParticipation(gp: GuestParticipation) {
  return {
    id: gp.id,
    displayName: gp.displayName || `Participante ${gp.participantIndex}`,
    participantIndex: gp.participantIndex,
    status: gp.status,
    phoneDisplay: gp.phoneDisplay,
    orderCount: gp.orderCount,
  };
}

export function storePhoneForOtpLookup(establishmentId: string, phoneE164: string) {
  const store = getStore();
  const lookup = phoneLookupHash(establishmentId, phoneE164);
  store.guestPhoneSecrets[lookup] = { phoneCiphertext: encryptPhone(phoneE164) };
  saveStore(store);
  return lookup;
}
