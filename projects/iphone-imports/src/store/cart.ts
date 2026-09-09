"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, color?: string, storage?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    color?: string,
    storage?: string
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getSubtotal: () => number;
  getSavings: () => number;
  getItemCount: () => number;
}

function itemKey(productId: string, color?: string, storage?: string) {
  return `${productId}-${color ?? ""}-${storage ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const { items } = get();
        const key = itemKey(item.productId, item.color, item.storage);
        const existing = items.find(
          (i) => itemKey(i.productId, i.color, i.storage) === key
        );

        if (existing) {
          set({
            items: items.map((i) =>
              itemKey(i.productId, i.color, i.storage) === key
                ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity ?? 1 }],
          });
        }
      },

      removeItem: (productId, color, storage) => {
        const key = itemKey(productId, color, storage);
        set({
          items: get().items.filter(
            (i) => itemKey(i.productId, i.color, i.storage) !== key
          ),
        });
      },

      updateQuantity: (productId, quantity, color, storage) => {
        if (quantity <= 0) {
          get().removeItem(productId, color, storage);
          return;
        }
        const key = itemKey(productId, color, storage);
        set({
          items: get().items.map((i) =>
            itemKey(i.productId, i.color, i.storage) === key
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getSavings: () =>
        get().items.reduce((sum, i) => {
          if (i.oldPrice && i.oldPrice > i.price) {
            return sum + (i.oldPrice - i.price) * i.quantity;
          }
          return sum;
        }, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "iphone-imports-cart" }
  )
);
