import type { ClosingRequest, GuestParticipation, Order, OrderItemSplit } from "@/lib/types";
import {
  getCommandPaidTotal,
  getCommandTotal,
  getParticipantItemTotal,
  getParticipantPaidTotal,
} from "@/lib/accounting";

export interface ClosingSummary {
  commandTotal: number;
  paidTotal: number;
  remainingTotal: number;
  canSettle: boolean;
  participants: Array<{
    guestParticipationId: string;
    displayName: string;
    itemTotal: number;
    paidTotal: number;
    remainingTotal: number;
    isSettled: boolean;
  }>;
}

export function buildClosingSummary(
  orders: Order[],
  participations: GuestParticipation[],
  splits: OrderItemSplit[],
  payments: { guestParticipationId?: string; amount: number; status: string }[],
): ClosingSummary {
  const activeOrders = orders.filter((order) => order.status !== "CANCELADO");
  const commandTotal = getCommandTotal(activeOrders);
  const paidTotal = getCommandPaidTotal(payments);
  const remainingTotal = Math.max(0, commandTotal - paidTotal);

  const participants = participations.map((participation) => {
    const itemTotal = getParticipantItemTotal(activeOrders, splits, participation.id);
    const participantPaid = getParticipantPaidTotal(payments, participation.id);
    const participantRemaining = Math.max(0, itemTotal - participantPaid);
    const displayName =
      participation.displayName?.trim() || `Participante ${participation.participantIndex}`;
    return {
      guestParticipationId: participation.id,
      displayName,
      itemTotal,
      paidTotal: participantPaid,
      remainingTotal: participantRemaining,
      isSettled: participantRemaining <= 0.009,
    };
  });

  const canSettle =
    remainingTotal <= 0.009 &&
    participants.every((participant) => participant.isSettled || participant.itemTotal <= 0.009);

  return {
    commandTotal,
    paidTotal,
    remainingTotal,
    canSettle,
    participants,
  };
}

export function canConfirmClosing(
  request: ClosingRequest,
  summary: ClosingSummary,
): boolean {
  if (request.status !== "PENDING") return false;
  if (request.scope === "TABLE") {
    return summary.canSettle;
  }
  if (request.scope === "SELF") {
    const targetId = request.targetGuestParticipationIds[0];
    const participant = summary.participants.find(
      (entry) => entry.guestParticipationId === targetId,
    );
    return participant?.isSettled ?? false;
  }
  if (request.scope === "SELECTED") {
    const requestedIds = request.targetGuestParticipationIds;
    if (requestedIds.length === 0) return false;
    return requestedIds.every((id) => {
      const participant = summary.participants.find((entry) => entry.guestParticipationId === id);
      return participant?.isSettled ?? false;
    });
  }
  return false;
}

export function describeClosingScope(scope: ClosingRequest["scope"]): string {
  switch (scope) {
    case "TABLE":
      return "Conta inteira";
    case "SELF":
      return "Só minha parte";
    case "SELECTED":
      return "Participantes selecionados";
    default:
      return scope;
  }
}
