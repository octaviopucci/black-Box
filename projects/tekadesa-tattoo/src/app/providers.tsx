"use client";

import { LocaleProvider } from "@/i18n/locale-provider";
import { ThemeVariantProvider, type ThemeVariant } from "@/lib/theme-variant";

export function Providers({
  children,
  themeVariant = "default",
}: {
  children: React.ReactNode;
  themeVariant?: ThemeVariant;
}) {
  return (
    <ThemeVariantProvider variant={themeVariant}>
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeVariantProvider>
  );
}
