import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en } from "./locales/en";
import { fr } from "./locales/fr";
import { pt } from "./locales/pt";
import { localeHtmlLang, type Locale, type Messages } from "./types";

const STORAGE_KEY = "caio-locale";

const messagesMap: Record<Locale, Messages> = { pt, en, fr };

type LocaleContextValue = {
  locale: Locale;
  t: Messages;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "pt";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "fr" || stored === "pt") return stored;
  return "pt";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = localeHtmlLang[locale];
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, ready]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
  };

  const value = useMemo(
    () => ({
      locale,
      t: messagesMap[locale],
      setLocale,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useMessages() {
  return useLocale().t;
}
