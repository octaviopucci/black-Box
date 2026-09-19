import type { OrderItem, OrderItemAddon, ProductVariant } from "./types";

export function variantDeltaValue(variant?: Pick<ProductVariant, "priceDelta"> | null): number {
  return variant?.priceDelta ?? 0;
}

export function addonsTotal(addons: readonly Pick<OrderItemAddon, "price" | "qty">[]): number {
  return addons.reduce((sum, addon) => sum + addon.price * addon.qty, 0);
}

/** Preço unitário da linha: base + variante + adicionais (por unidade quando qty > 0). */
export function lineUnitPrice(
  unitPrice: number,
  variantDelta: number,
  addons: readonly Pick<OrderItemAddon, "price" | "qty">[],
  qty = 1,
): number {
  const addonShare = qty > 0 ? addonsTotal(addons) / qty : addonsTotal(addons);
  return unitPrice + variantDelta + addonShare;
}

export function lineTotal(item: Pick<OrderItem, "qty" | "unitPrice" | "variantDelta" | "addons">) {
  return item.qty * (item.unitPrice + item.variantDelta) + addonsTotal(item.addons);
}
