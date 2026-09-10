"use client";

import { LocaleProvider } from "@/i18n/locale-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
