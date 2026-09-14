"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { lineTotal } from "@/lib/order-math";
import type { OrderItem, OrderItemAddon, Product, ProductVariant } from "@/lib/types";

export type CartLine = {
  key: string;
  product: Product;
  qty: number;
  variant?: ProductVariant;
  addons: OrderItemAddon[];
  notes?: string;
};

type CartContextValue = {
  lines: CartLine[];
  add: (product: Product, opts?: Partial<Pick<CartLine, "qty" | "variant" | "addons" | "notes">>) => void;
  remove: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  toOrderItems: (sectors: Record<string, { name: string }>) => OrderItem[];
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, variantId?: string, addons?: OrderItemAddon[], notes?: string) {
  return `${productId}:${variantId || ""}:${JSON.stringify(addons || [])}:${notes || ""}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const value = useMemo<CartContextValue>(() => ({
    lines,
    add(product, opts) {
      const variant = opts?.variant;
      const addons = opts?.addons || [];
      const notes = opts?.notes;
      const key = lineKey(product.id, variant?.id, addons, notes);
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.key === key);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + (opts?.qty || 1) };
          return next;
        }
        return [
          ...prev,
          { key, product, qty: opts?.qty || 1, variant, addons, notes },
        ];
      });
    },
    remove(key) {
      setLines((prev) => prev.filter((l) => l.key !== key));
    },
    updateQty(key, qty) {
      if (qty <= 0) {
        setLines((prev) => prev.filter((l) => l.key !== key));
        return;
      }
      setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty } : l)));
    },
    clear() {
      setLines([]);
    },
    total: lines.reduce((s, l) => {
      const item: OrderItem = {
        id: l.key,
        productId: l.product.id,
        productName: l.product.name,
        sectorId: l.product.sectorId,
        sectorName: "",
        qty: l.qty,
        unitPrice: l.product.price,
        variantDelta: l.variant?.priceDelta || 0,
        addons: l.addons,
        notes: l.notes,
        status: "NOVO",
      };
      return s + lineTotal(item);
    }, 0),
    count: lines.reduce((s, l) => s + l.qty, 0),
    toOrderItems(sectors) {
      return lines.map((l) => ({
        id: `oi_${l.key}`,
        productId: l.product.id,
        productName: l.product.name,
        sectorId: l.product.sectorId,
        sectorName: sectors[l.product.sectorId]?.name || "",
        qty: l.qty,
        unitPrice: l.product.price,
        variantName: l.variant?.name,
        variantDelta: l.variant?.priceDelta || 0,
        addons: l.addons,
        notes: l.notes,
        status: "NOVO" as const,
      }));
    },
  }), [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}
