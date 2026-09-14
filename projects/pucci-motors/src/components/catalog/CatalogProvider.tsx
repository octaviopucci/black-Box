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
import { site } from "@/data/site";
import { catalogVehicleToSite, type Vehicle } from "@/data/vehicles";
import { fetchLiveCatalog, type LiveCatalog } from "@/lib/catalog-api";
import { setActiveWhatsapp } from "@/lib/whatsapp";

const POLL_MS = 15_000;

interface CatalogContextValue {
  loading: boolean;
  live: boolean;
  storeName: string;
  whatsapp: string;
  city: string;
  vehicles: Vehicle[];
  refresh: () => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<LiveCatalog | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await fetchLiveCatalog();
    if (data?.whatsapp) setActiveWhatsapp(data.whatsapp);
    setCatalog(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(load, POLL_MS);
    return () => clearInterval(interval);
  }, [load]);

  const value = useMemo<CatalogContextValue>(() => {
    const vehicles = (catalog?.vehicles ?? []).map(catalogVehicleToSite);

    return {
      loading,
      live: Boolean(catalog),
      storeName: catalog?.storeName || site.name,
      whatsapp: catalog?.whatsapp || site.whatsapp,
      city: catalog?.city || site.city,
      vehicles,
      refresh: load,
    };
  }, [catalog, loading, load]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog precisa de CatalogProvider");
  return ctx;
}
