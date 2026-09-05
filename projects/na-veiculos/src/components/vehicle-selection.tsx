"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { scrollToHash } from "@/lib/whatsapp";

type VehicleSelection = {
  selectedId: string;
  setSelectedId: (id: string) => void;
  /** Seleciona o carro no formulário e rola até ele. */
  chooseAndGo: (id: string) => void;
};

const Ctx = createContext<VehicleSelection | null>(null);

export function VehicleSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState("");

  const chooseAndGo = useCallback((id: string) => {
    setSelectedId(id);
    scrollToHash("#orcamento");
    document.getElementById("carro")?.focus({ preventScroll: true });
  }, []);

  const value = useMemo(
    () => ({ selectedId, setSelectedId, chooseAndGo }),
    [selectedId, chooseAndGo],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVehicleSelection() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useVehicleSelection precisa de VehicleSelectionProvider");
  return ctx;
}
