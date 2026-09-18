import { appendAuditEvent } from "./audit-log";
import { decryptPhone } from "./identity-crypto";
import { revokeSessionsForParticipation } from "./guest";
import { getStore, saveStore } from "./store";
import type { GuestParticipation, MesaFlowStore, User } from "./types";

type DsrError = { error: string; status: number };

function notFound(msg: string): DsrError {
  return { error: msg, status: 404 };
}

export function exportGuestSubjectData(participationId: string) {
  const store = getStore();
  const participation = store.guestParticipations[participationId];
  if (!participation) return notFound("Participação não encontrada.");

  const secret = store.guestPhoneSecrets[participation.id];
  const phoneE164 = secret ? decryptPhone(secret.phoneCiphertext) : null;
  const orders = Object.values(store.orders)
    .filter((o) => o.guestParticipationId === participationId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    exportedAt: new Date().toISOString(),
    participation,
    phoneE164,
    orders,
  };
}

export function deleteGuestSubjectData(participationId: string) {
  const store = getStore();
  const participation = store.guestParticipations[participationId];
  if (!participation) return notFound("Participação não encontrada.");

  anonymizeGuestParticipation(store, participation);
  for (const order of Object.values(store.orders)) {
    if (order.guestParticipationId !== participationId) continue;
    order.notes = order.notes ? "[redacted]" : undefined;
  }
  appendAuditEvent(store, {
    establishmentId: participation.establishmentId,
    type: "dsr.guest_delete",
    actorType: "GUEST",
    targetType: "guest_participation",
    targetId: participationId,
    metadata: { scope: "guest" },
  });
  saveStore(store);
  return { deletedAt: new Date().toISOString(), participationId };
}

function anonymizeGuestParticipation(store: MesaFlowStore, participation: GuestParticipation) {
  delete store.guestPhoneSecrets[participation.id];
  participation.displayName = "Anônimo";
  participation.phoneDisplay = "+** ****-****";
  participation.phoneLookupHash = `anon_${participation.id}`;
  participation.status = "CLOSED";
  participation.closedAt = participation.closedAt || new Date().toISOString();
  store.guestParticipations[participation.id] = participation;
  revokeSessionsForParticipation(store, participation.id);
}

export function exportMerchantSubjectData(userId: string, establishmentId: string) {
  const store = getStore();
  const user = store.users[userId];
  const establishment = store.establishments[establishmentId];
  if (!user || user.establishmentId !== establishmentId) {
    return notFound("Usuário não encontrado.");
  }

  const staffUsers = Object.values(store.users).filter((u) => u.establishmentId === establishmentId);
  const orderCount = Object.values(store.orders).filter((o) => o.establishmentId === establishmentId).length;

  return {
    exportedAt: new Date().toISOString(),
    user: publicMerchantUser(user),
    establishment: {
      id: establishment.id,
      slug: establishment.slug,
      name: establishment.name,
      plan: establishment.plan,
      platformStatus: establishment.platformStatus,
      createdAt: establishment.createdAt,
    },
    staffCount: staffUsers.length,
    orderCount,
  };
}

export function deleteMerchantSubjectData(userId: string, establishmentId: string) {
  const store = getStore();
  const user = store.users[userId];
  const establishment = store.establishments[establishmentId];
  if (!user || user.establishmentId !== establishmentId || user.role !== "OWNER") {
    return { error: "Somente o titular OWNER pode solicitar exclusão.", status: 403 };
  }

  user.email = `deleted+${user.id}@anon.namesa.local`;
  user.name = "Conta excluída";
  user.active = false;
  user.passwordHash = "$2a$12$invalidhashinvalidhashinvalidhashinv";
  store.users[user.id] = user;

  establishment.platformStatus = "inactive";
  establishment.name = `${establishment.name} (conta encerrada)`;
  store.establishments[establishment.id] = establishment;

  appendAuditEvent(store, {
    establishmentId,
    type: "dsr.merchant_delete",
    actorType: "STAFF",
    actorUserId: userId,
    targetType: "establishment",
    targetId: establishmentId,
    metadata: { scope: "owner" },
  });
  saveStore(store);
  return { deletedAt: new Date().toISOString(), userId, establishmentId };
}

export function publicMerchantUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    active: user.active,
    privacyConsent: user.privacyConsent,
  };
}
