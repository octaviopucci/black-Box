import type { CSSProperties } from "react";

export function VictorianScrollIndicator({
  label = "Scroll",
  className = "",
  style,
}: {
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`pointer-events-none absolute right-4 top-1/2 z-[6] hidden -translate-y-1/2 flex-col items-center gap-2 md:right-6 lg:flex ${className}`}
      style={style}
      aria-hidden
    >
      <span className="font-display text-[9px] italic tracking-[0.35em] text-accent/70">{label}</span>
      <span className="block h-14 w-px bg-gradient-to-b from-transparent via-[var(--gold)] to-transparent" />
    </div>
  );
}
