import { buildClosingSummary } from "@/lib/closing";
import { id } from "@/lib/crypto-utils";
import { revokeSessionsForParticipation, validateClientSession } from "@/lib/guest";
import { getStore, saveStore } from "@/lib/store";
import type { GuestParticipation, MesaFlowStore, Order, OrderItemSplit } from "@/lib/types";

export interface GuestPaymentStatus {
  itemTotal: number;
  paidTotal: number;
  remainingTotal: number;
  isSettled: boolean;
  paymentConfirmedAt?: string;
  canLeave: boolean;
}

function commandOrders(store: MesaFlowStore, commandId: string): Order[] {
  return Object.values(store.orders).filter((order) => order.commandId === commandId);
}

function commandSplits(store: MesaFlowStore, commandId: string): OrderItemSplit[] {
  return Object.values(store.orderItemSplits || {}).filter((split) => split.commandId === commandId);
}

function commandPayments(store: MesaFlowStore, commandId: string) {
  return Object.values(store.payments || {}).filter((payment) => payment.commandId === commandId);
}

export function getGuestPaymentStatus(participation: GuestParticipation): GuestPaymentStatus {
  const store = getStore();
  const orders = commandOrders(store, participation.commandId);
  const splits = commandSplits(store, participation.commandId);
  const payments = commandPayments(store, participation.commandId);
  const summary = buildClosingSummary(orders, [participation], splits, payments);
  const participant = summary.participants[0];
  const itemTotal = participant?.itemTotal ?? 0;
  const paidTotal = participant?.paidTotal ?? 0;
  const remainingTotal = participant?.remainingTotal ?? 0;
  const isSettled = participant?.isSettled ?? itemTotal <= 0.009;
  const paymentConfirmedAt = participation.paymentConfirmedAt;
  const canLeave = canGuestLeave(participation, itemTotal);

  return {
    itemTotal,
    paidTotal,
    remainingTotal,
    isSettled,
    paymentConfirmedAt,
    canLeave,
  };
}

export function canGuestLeave(participation: GuestParticipation, itemTotal?: number): boolean {
  if (participation.status === "CLOSED") return false;
  const owed = itemTotal ?? getGuestPaymentStatus(participation).itemTotal;
  if (owed <= 0.009) return true;
  return Boolean(participation.paymentConfirmedAt);
}

export function clearPaymentConfirmationIfUnsettled(store: MesaFlowStore, participationId: string) {
  const participation = store.guestParticipations[participationId];
  if (!participation?.paymentConfirmedAt) return;
  const status = getGuestPaymentStatus(participation);
  if (!status.isSettled) {
    participation.paymentConfirmedAt = undefined;
    participation.paymentConfirmedByUserId = undefined;
    store.guestParticipations[participationId] = participation;
  }
}

export function leaveGuestTable(token: string): { ok: true } | { error: string; status: number } {
  const guestAuth = validateClientSession(token);
  if (!guestAuth) {
    return { error: "Sessão de cliente inválida.", status: 401 };
  }

  const store = getStore();
  const participation = store.guestParticipations[guestAuth.participation.id];
  if (!participation || participation.status === "CLOSED") {
    return { error: "Participação encerrada.", status: 409 };
  }

  const paymentStatus = getGuestPaymentStatus(participation);
  if (!canGuestLeave(participation, paymentStatus.itemTotal)) {
    return {
      error: "Aguarde a confirmação do pagamento pelo restaurante antes de sair da mesa.",
      status: 403,
    };
  }

  const now = new Date().toISOString();
  participation.status = "CLOSED";
  participation.closedAt = now;
  store.guestParticipations[participation.id] = participation;
  revokeSessionsForParticipation(store, participation.id);

  store.auditEvents ||= {};
  const auditId = id("aud_");
  store.auditEvents[auditId] = {
    id: auditId,
    establishmentId: participation.establishmentId,
    type: "guest.left",
    actorType: "SYSTEM",
    targetType: "guest_participation",
    targetId: participation.id,
    metadata: { tableId: participation.tableId, commandId: participation.commandId },
    createdAt: now,
  };

  saveStore(store);
  return { ok: true };
}
