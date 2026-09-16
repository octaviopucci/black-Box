import { lineTotal } from "./order-math";
import type { MesaFlowStore, OrderItem, OrderLineInput, Product } from "./types";

export type ResolveOrderLinesResult =
  | { ok: true; items: OrderItem[]; total: number }
  | { ok: false; status: number; error: string };

function hasClientPricing(item: Record<string, unknown>) {
  return (
    "unitPrice" in item ||
    "variantDelta" in item ||
    (Array.isArray(item.addons) &&
      item.addons.some((addon) => typeof addon === "object" && addon !== null && "price" in addon))
  );
}

function resolveAddon(
  product: Product,
  addonId: string,
  qty: number,
): { addonId: string; name: string; price: number; qty: number } | null {
  const addon = product.addons.find((entry) => entry.id === addonId);
  if (!addon) return null;
  const maxQty = addon.maxQty ?? 99;
  if (qty < 1 || qty > maxQty) return null;
  return { addonId: addon.id, name: addon.name, price: addon.price, qty };
}

export function resolveOrderLines(
  store: MesaFlowStore,
  establishmentId: string,
  sectors: Record<string, { name: string }>,
  lines: OrderLineInput[],
  options?: { unitPriceFor?: (product: Product) => number },
): ResolveOrderLinesResult {
  if (!lines.length) {
    return { ok: false, status: 400, error: "Carrinho vazio." };
  }

  const items: OrderItem[] = [];
  let lineIndex = 0;

  for (const raw of lines) {
    const line = raw as OrderLineInput & Record<string, unknown>;
    if (hasClientPricing(line)) {
      return {
        ok: false,
        status: 400,
        error: "Preços devem ser calculados pelo servidor. Envie apenas productId, qty, variantId e addonIds.",
      };
    }

    const product = store.products[line.productId];
    if (!product || product.establishmentId !== establishmentId || !product.active) {
      return { ok: false, status: 400, error: `Produto inválido: ${line.productId}` };
    }

    const qty = Number(line.qty);
    if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
      return { ok: false, status: 400, error: `Quantidade inválida para ${product.name}.` };
    }

    let variantName: string | undefined;
    let variantDelta = 0;
    if (line.variantId) {
      const variant = product.variants.find((entry) => entry.id === line.variantId);
      if (!variant) {
        return { ok: false, status: 400, error: `Variação inválida para ${product.name}.` };
      }
      variantName = variant.name;
      variantDelta = variant.priceDelta;
    } else if (product.variants.length > 0) {
      return { ok: false, status: 400, error: `Selecione uma variação para ${product.name}.` };
    }

    const addonCounts = new Map<string, number>();
    for (const addonId of line.addonIds || []) {
      addonCounts.set(addonId, (addonCounts.get(addonId) || 0) + 1);
    }

    const addons: OrderItem["addons"] = [];
    for (const [addonId, addonQty] of addonCounts) {
      const resolved = resolveAddon(product, addonId, addonQty);
      if (!resolved) {
        return { ok: false, status: 400, error: `Adicional inválido para ${product.name}.` };
      }
      addons.push(resolved);
    }

    const item: OrderItem = {
      id: `oi_${Date.now()}_${lineIndex++}`,
      productId: product.id,
      productName: product.name,
      sectorId: product.sectorId,
      sectorName: sectors[product.sectorId]?.name || "",
      qty,
      unitPrice: options?.unitPriceFor ? options.unitPriceFor(product) : product.price,
      variantName,
      variantDelta,
      addons,
      notes: line.notes?.trim() || undefined,
      status: "NOVO",
    };
    items.push(item);
  }

  const total = items.reduce((sum, item) => sum + lineTotal(item), 0);
  return { ok: true, items, total };
}
