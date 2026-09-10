"use client";

import { useThemeVariant } from "@/lib/theme-variant";

type SectionHeaderProps = {
  index?: string;
  label: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  variant?: "default" | "victorian";
};

export function SectionHeader({
  index,
  label,
  title,
  description,
  align = "left",
  className = "",
  variant,
}: SectionHeaderProps) {
  const themeVariant = useThemeVariant();
  const resolved = variant ?? themeVariant;
  const isVictorian = resolved === "victorian";

  const alignClass =
    align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left";

  return (
    <div
      className={`${alignClass} ${isVictorian ? "vic-section-header" : ""} ${className}`}
    >
      {index ? (
        <p
          className={
            isVictorian
              ? "vic-index text-[11px] tracking-[0.22em]"
              : "font-mono text-[11px] tracking-[0.22em] text-accent/80"
          }
        >
          {isVictorian ? `§ ${index}` : `[${index}]`}
        </p>
      ) : null}

      <h2
        className={
          isVictorian
            ? "mt-3 leading-[1.05] text-ink"
            : "mt-3 text-[clamp(2rem,5vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-tight text-ink"
        }
      >
        {label}
      </h2>

      <p
        className={`${isVictorian ? "vic-title" : "text-lg font-medium leading-snug text-mute md:text-xl"} mt-4 ${align === "center" ? "mx-auto" : ""}`}
      >
        {title}
      </p>

      {description ? (
        <p
          className={`mt-4 max-w-xl text-sm leading-relaxed text-mute/80 md:text-base ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
