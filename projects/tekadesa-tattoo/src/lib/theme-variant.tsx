"use client";

import { createContext, useContext, type ReactNode } from "react";

export type ThemeVariant = "default" | "victorian";

const ThemeVariantContext = createContext<ThemeVariant>("default");

export function ThemeVariantProvider({
  variant,
  children,
}: {
  variant: ThemeVariant;
  children: ReactNode;
}) {
  return (
    <ThemeVariantContext.Provider value={variant}>{children}</ThemeVariantContext.Provider>
  );
}

export function useThemeVariant() {
  return useContext(ThemeVariantContext);
}
