import type { OrderItem } from "./types";

export function lineTotal(item: Pick<OrderItem, "qty" | "unitPrice" | "variantDelta" | "addons">) {
  const addons = item.addons.reduce((s, a) => s + a.price * a.qty, 0);
  return item.qty * (item.unitPrice + item.variantDelta) + addons;
}
