"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchLiveCatalog, type LiveCatalog } from "@/lib/catalog-api";
import { products as staticProducts } from "@/data/products";
import { categories as staticCategories } from "@/data/categories";
import type { Product, Category } from "@/types";

const POLL_MS = 15_000;

interface CatalogContextValue {
  loading: boolean;
  live: boolean;
  storeName?: string;
  products: Product[];
  categories: Category[];
  refresh: () => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

function mergeCatalog(staticList: Product[], liveList: Product[]): Product[] {
  const bySlug = new Map<string, Product>();
  for (const p of staticList) bySlug.set(p.slug, p);
  for (const p of liveList) bySlug.set(p.slug, p);
  return [...bySlug.values()];
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<LiveCatalog | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetchLiveCatalog();
    setCatalog(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
  }, [load]);

  const value = useMemo<CatalogContextValue>(() => {
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
      products: mergeCatalog(staticProducts, catalog.products),
      categories: catalog.categories.length > 0 ? catalog.categories : staticCategories,
      refresh: load,
    };
  }, [catalog, loading, load]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
