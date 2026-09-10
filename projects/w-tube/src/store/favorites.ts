"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  ids: string[];
  toggle: (productId: string) => boolean;
  isFavorite: (productId: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (productId) => {
        const { ids } = get();
        const isFav = ids.includes(productId);
        set({ ids: isFav ? ids.filter((id) => id !== productId) : [...ids, productId] });
        return !isFav;
      },

      isFavorite: (productId) => get().ids.includes(productId),

      clear: () => set({ ids: [] }),
    }),
    { name: "w-tube-favorites" }
  )
);
