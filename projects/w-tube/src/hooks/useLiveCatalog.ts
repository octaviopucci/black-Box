"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchLiveCatalog, type LiveCatalog } from "@/lib/catalog-api";
import { products as staticProducts } from "@/data/products";
import { categories as staticCategories } from "@/data/categories";
import type { Product, Category } from "@/types";

interface CatalogState {
  loading: boolean;
  live: boolean;
  storeName?: string;
  products: Product[];
  categories: Category[];
  refresh: () => void;
}

export function useLiveCatalog(): CatalogState {
  const [catalog, setCatalog] = useState<LiveCatalog | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchLiveCatalog();
    setCatalog(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  if (!catalog) {
    return {
      loading,
      live: false,
      products: staticProducts,
      categories: staticCategories,
      refresh: load,
    };
  }

  return {
    loading,
    live: true,
    storeName: catalog.storeName,
    products: catalog.products,
    categories: catalog.categories,
    refresh: load,
  };
}
