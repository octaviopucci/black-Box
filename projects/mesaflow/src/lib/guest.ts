import { id } from "./crypto-utils";
import {
  decryptPhone,
  encryptPhone,
  generateOtpCode,
  hashToken,
  maskPhoneDisplay,
  normalizePhoneE164,
  otpCodeHash,
  phoneLookupHash,
} from "./identity-crypto";
import { isOtpBypassCode } from "./otp-bypass";
import {
  issueGuestSessionToken,
  parseGuestTokenClaims,
  type GuestTokenClaims,
} from "./guest-session-token";
import { resolveOperationMode } from "./operation-modes";
import {
  findEstablishmentBySlug,
  findTableByQr,
  getStore,
  saveStore,
  getOrOpenCommand,
  getActiveCommand,
} from "./store";
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

type MutationError = { error: string; status: number };
type MutationResult<T> = { value: T } | MutationError;

function invalid(error: string, status = 400): MutationError {
  return { error, status };
}

function ensureIdentityCollections(store: MesaFlowStore) {
  store.clientSessions ||= {};
  store.otpChallenges ||= {};
  store.guestPhoneSecrets ||= {};
  store.revokedGuestTokenHashes ||= {};
}

function normalizeComandaNumber(raw: string | undefined | null): string | undefined {
  if (raw === undefined || raw === null) return undefined;
  const trimmed = String(raw).trim();
  return trimmed || undefined;
}

function requireComandaIfNeeded(
  establishment: Establishment,
  comandaNumber: string | undefined,
): MutationError | null {
  if (resolveOperationMode(establishment) !== "comanda") return null;
  if (!comandaNumber || comandaNumber.length < 1 || comandaNumber.length > 20) {
    return invalid("Número da comanda é obrigatório (1 a 20 caracteres).");
  }
  return null;
}

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
  comandaNumber?: string;
}): GuestParticipation | MutationError {
  const comandaNumber = normalizeComandaNumber(input.comandaNumber);
  const comandaError = requireComandaIfNeeded(input.establishment, comandaNumber);
  if (comandaError) return comandaError;

  const store = getStore();
  const lookup = phoneLookupHash(input.establishment.id, input.phoneE164);
  const existing = findOpenParticipation(store, input.commandId, lookup);
  if (existing) {
    if (comandaNumber && !existing.comandaNumber) {
      existing.comandaNumber = comandaNumber;
      store.guestParticipations[existing.id] = existing;
      saveStore(store);
    }
    return existing;
  }

  const participation: GuestParticipation = {
    id: id("gp_"),
    establishmentId: input.establishment.id,
    commandId: input.commandId,
    tableId: input.table.id,
    phoneLookupHash: lookup,
    phoneDisplay: maskPhoneDisplay(input.phoneE164),
    displayName: input.displayName?.trim() || undefined,
    comandaNumber,
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

export function createClientSession(participation: GuestParticipation): { token: string; session: ClientSession } {
  const token = issueGuestSessionToken(participation, CLIENT_SESSION_TTL_MS);
  const now = new Date();
  const session: ClientSession = {
    id: id("cs_"),
    guestParticipationId: participation.id,
    tokenHash: hashToken(token),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + CLIENT_SESSION_TTL_MS).toISOString(),
    lastSeenAt: now.toISOString(),
  };
  const store = getStore();
  ensureIdentityCollections(store);
  store.clientSessions[session.id] = session;
  saveStore(store);
  return { token, session };
}

/** Returns null when the participation is CLOSED — never resurrect kicked guests from JWT. */
function participationFromClaims(claims: GuestTokenClaims): GuestParticipation | null {
  const store = getStore();
  const existing = store.guestParticipations[claims.id];
  if (existing) {
    if (existing.status === "CLOSED") return null;
    return existing;
  }

  if (claims.status === "CLOSED") return null;

  const table = store.tables[claims.tableId];
  const command = table ? getOrOpenCommand(table) : null;
  const participation: GuestParticipation = {
    id: claims.id,
    establishmentId: claims.establishmentId,
    commandId: command?.id || claims.commandId,
    tableId: claims.tableId,
    phoneLookupHash: claims.phoneLookupHash,
    phoneDisplay: claims.phoneDisplay,
    displayName: claims.displayName,
    participantIndex: claims.participantIndex,
    status: claims.status,
    joinedAt: claims.joinedAt,
    verifiedAt: claims.verifiedAt,
    orderCount: 0,
  };

  store.guestParticipations[participation.id] = participation;
  saveStore(store);
  return participation;
}

function resolveGuestSession(participation: GuestParticipation) {
  if (participation.status === "CLOSED") return null;
  const store = getStore();
  const establishment = store.establishments[participation.establishmentId];
  if (!establishment) return null;
  const now = new Date().toISOString();
  const session: ClientSession = {
    id: `stateless_${participation.id}`,
    guestParticipationId: participation.id,
    tokenHash: "",
    createdAt: now,
    expiresAt: now,
    lastSeenAt: now,
  };
  return { session, participation, establishment };
}

export function validateClientSession(token: string | undefined | null) {
  if (!token?.trim()) return null;
  const trimmed = token.trim();
  const store = getStore();
  ensureIdentityCollections(store);

  const tokenHash = hashToken(trimmed);
  if (store.revokedGuestTokenHashes[tokenHash]) return null;

  const claims = parseGuestTokenClaims(trimmed);
  if (claims) {
    const participation = participationFromClaims(claims);
    if (!participation) return null;
    return resolveGuestSession(participation);
  }

  const session = Object.values(store.clientSessions).find(
    (entry) => entry.tokenHash === tokenHash && !entry.revokedAt,
  );
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) return null;

  const participation = store.guestParticipations[session.guestParticipationId];
  if (!participation) return null;
  return resolveGuestSession(participation);
}

export function revokeClientSession(token: string | undefined | null) {
  if (!token?.trim()) return;
  const store = getStore();
  ensureIdentityCollections(store);
  const tokenHash = hashToken(token.trim());
  const now = new Date().toISOString();
  store.revokedGuestTokenHashes[tokenHash] = now;

  for (const session of Object.values(store.clientSessions)) {
    if (session.tokenHash !== tokenHash) continue;
    session.revokedAt = now;
    store.clientSessions[session.id] = session;
  }
  saveStore(store);
}

function revokeSessionsForParticipation(store: MesaFlowStore, participationId: string) {
  ensureIdentityCollections(store);
  const now = new Date().toISOString();
  for (const session of Object.values(store.clientSessions)) {
    if (session.guestParticipationId !== participationId || session.revokedAt) continue;
    session.revokedAt = now;
    store.clientSessions[session.id] = session;
    if (session.tokenHash) {
      store.revokedGuestTokenHashes[session.tokenHash] = now;
    }
  }
}

export function joinGuestAtTable(input: {
  establishment: Establishment;
  table: Table;
  phoneE164: string;
  displayName?: string;
  comandaNumber?: string;
}) {
  const comandaNumber = normalizeComandaNumber(input.comandaNumber);
  const comandaError = requireComandaIfNeeded(input.establishment, comandaNumber);
  if (comandaError) return comandaError;

  const store = getStore();
  const command = getOrOpenCommand(input.table);
  const lookup = phoneLookupHash(input.establishment.id, input.phoneE164);
  const existing = findOpenParticipation(store, command.id, lookup);
  const created =
    existing ||
    createGuestParticipation({
      establishment: input.establishment,
      table: input.table,
      commandId: command.id,
      phoneE164: input.phoneE164,
      displayName: input.displayName,
      comandaNumber,
    });
  if ("error" in created) return created;

  if (existing && comandaNumber && !existing.comandaNumber) {
    existing.comandaNumber = comandaNumber;
    store.guestParticipations[existing.id] = existing;
    saveStore(store);
  }

  const { token } = createClientSession(created);
  return {
    token,
    participation: created,
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
  slug?: string;
  tableToken?: string;
  phoneRaw?: string;
  comandaNumber?: string;
}) {
  const code = input.code.trim();
  const comandaNumber = normalizeComandaNumber(input.comandaNumber);

  if (isOtpBypassCode(code) && input.slug && input.tableToken && input.phoneRaw) {
    const establishment = findEstablishmentBySlug(input.slug);
    if (!establishment) return { error: "Estabelecimento não encontrado." as const };
    const table = findTableByQr(establishment.id, input.tableToken);
    if (!table) return { error: "Mesa inválida." as const };
    const phoneE164 = normalizePhoneE164(input.phoneRaw);
    if (!phoneE164) return { error: "Telefone inválido." as const };
    const joined = joinGuestAtTable({
      establishment,
      table,
      phoneE164,
      displayName: input.displayName,
      comandaNumber,
    });
    if ("error" in joined) return { error: joined.error as string };
    return { token: joined.token, participation: joined.participation };
  }

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
    comandaNumber,
  });
  if ("error" in participation) return { error: participation.error };
  const { token } = createClientSession(participation);
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
    comandaNumber: gp.comandaNumber,
  };
}

export function storePhoneForOtpLookup(establishmentId: string, phoneE164: string) {
  const store = getStore();
  const lookup = phoneLookupHash(establishmentId, phoneE164);
  store.guestPhoneSecrets[lookup] = { phoneCiphertext: encryptPhone(phoneE164) };
  saveStore(store);
  return lookup;
}

export function kickGuestParticipation(
  establishmentId: string,
  participationId: string,
  actorUserId: string,
): MutationResult<{ participation: GuestParticipation }> {
  const store = getStore();
  ensureIdentityCollections(store);
  const participation = store.guestParticipations[participationId];
  if (!participation || participation.establishmentId !== establishmentId) {
    return invalid("Participação não encontrada.", 404);
  }
  if (participation.status === "CLOSED") {
    return { value: { participation } };
  }

  const now = new Date().toISOString();
  participation.status = "CLOSED";
  participation.closedAt = now;
  participation.closedByUserId = actorUserId;
  store.guestParticipations[participation.id] = participation;
  revokeSessionsForParticipation(store, participation.id);

  store.auditEvents ||= {};
  const auditId = id("aud_");
  store.auditEvents[auditId] = {
    id: auditId,
    establishmentId,
    type: "guest.kicked",
    actorType: "STAFF",
    actorUserId,
    targetType: "guest_participation",
    targetId: participation.id,
    metadata: { tableId: participation.tableId, commandId: participation.commandId },
    createdAt: now,
  };

  saveStore(store);
  return { value: { participation } };
}

export { revokeSessionsForParticipation };
