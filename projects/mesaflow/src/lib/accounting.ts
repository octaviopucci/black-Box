import { lineTotal } from "@/lib/order-math";
import type { Order, OrderItemSplit } from "@/lib/types";

export function getOrderItemLineTotal(order: Order, orderItemId: string): number {
  const item = order.items.find((entry) => entry.id === orderItemId);
  if (!item) return 0;
  return lineTotal(item);
}

export function getParticipantItemTotal(
  orders: Order[],
  splits: OrderItemSplit[],
  guestParticipationId: string,
): number {
  const splitMap = new Map<string, OrderItemSplit[]>();
  for (const split of splits) {
    const list = splitMap.get(split.orderItemId) ?? [];
    list.push(split);
    splitMap.set(split.orderItemId, list);
  }

  let total = 0;
  for (const order of orders) {
    for (const item of order.items) {
      const itemSplits = splitMap.get(item.id) ?? [];
      const participantSplit = itemSplits.find(
        (split) => split.guestParticipationId === guestParticipationId,
      );
      if (participantSplit) {
        const lineTotalValue = lineTotal(item);
        const unitShare = item.qty > 0 ? lineTotalValue / item.qty : 0;
        total += unitShare * participantSplit.quantity;
        continue;
      }

      if (itemSplits.length === 0 && order.guestParticipationId === guestParticipationId) {
        total += lineTotal(item);
      }
    }
  }

  return total;
}

export function getCommandTotal(orders: Order[]): number {
  return orders
    .filter((order) => order.status !== "CANCELADO")
    .reduce((sum, order) => sum + order.total, 0);
}

export function getParticipantPaidTotal(
  payments: { guestParticipationId?: string; amount: number; status: string }[],
  guestParticipationId: string,
): number {
  return payments
    .filter(
      (payment) =>
        payment.status === "registered" && payment.guestParticipationId === guestParticipationId,
    )
    .reduce((sum, payment) => sum + payment.amount, 0);
}

export function getCommandPaidTotal(
  payments: { amount: number; status: string }[],
): number {
  return payments
    .filter((payment) => payment.status === "registered")
    .reduce((sum, payment) => sum + payment.amount, 0);
}
