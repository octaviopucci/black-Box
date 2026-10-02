"use client";

import { site } from "@/data/site";
import { locales, type Locale } from "@/i18n/types";
import { useLocale } from "@/i18n/locale-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const available = locales.filter((item) =>
    (site.i18nLocales as readonly Locale[]).includes(item.code),
  );

  if (available.length <= 1) return null;

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      role="group"
      aria-label={t.language.switchTo}
    >
      {available.map((item) => {
        const active = locale === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLocale(item.code as Locale)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-sm text-lg leading-none transition-all duration-300",
              active
                ? "scale-110 opacity-100 ring-1 ring-white/30"
                : "opacity-45 hover:scale-105 hover:opacity-80",
            )}
            aria-label={`${t.language.switchTo} ${item.label}`}
            aria-pressed={active}
            title={item.label}
          >
            <span aria-hidden>{item.flag}</span>
          </button>
        );
      })}
    </div>
  );
}
