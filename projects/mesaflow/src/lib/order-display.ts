import { formatCurrency } from "./format";
import { lineTotal, lineUnitPrice } from "./order-math";
import type { GuestParticipation, Order, OrderItem, OrderServiceType } from "./types";

export type OrderGuestInfo = {
  name?: string;
  phone?: string;
  comandaNumber?: string;
};

export type EnrichedOrder = Order & { guest?: OrderGuestInfo };

export function serviceTypeLabel(type?: OrderServiceType): string {
  if (type === "PARA_VIAGEM") return "Para viagem";
  return "Comer aqui";
}

export function formatItemAddons(item: OrderItem): string {
  const parts: string[] = [];
  if (item.variantName) parts.push(item.variantName);
  for (const addon of item.addons) {
    const prefix = addon.qty > 1 ? `${addon.qty}x ` : "";
    parts.push(`${prefix}${addon.name}`);
  }
  if (item.notes) parts.push(`Obs: ${item.notes}`);
  return parts.join(" · ");
}

export function formatItemPreview(item: OrderItem): string {
  const extras = formatItemAddons(item);
  return extras ? `${item.qty}x ${item.productName} (${extras})` : `${item.qty}x ${item.productName}`;
}

export function orderLineUnitPrice(item: OrderItem): number {
  return lineUnitPrice(item.unitPrice, item.variantDelta, item.addons, item.qty);
}

export function orderLineSubtotal(item: OrderItem): number {
  return lineTotal(item);
}

export function orderItemsSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function enrichOrderWithGuest(
  participations: Record<string, GuestParticipation>,
  order: Order,
): EnrichedOrder {
  const gp = participations[order.guestParticipationId];
  if (!gp) return order;
  return {
    ...order,
    guest: {
      name: gp.displayName,
      phone: gp.phoneDisplay,
      comandaNumber: gp.comandaNumber,
    },
  };
}

export function formatOrderDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatLineMoney(item: OrderItem): { unit: string; subtotal: string } {
  return {
    unit: formatCurrency(orderLineUnitPrice(item)),
    subtotal: formatCurrency(orderLineSubtotal(item)),
  };
}
