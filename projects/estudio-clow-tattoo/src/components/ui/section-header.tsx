type SectionHeaderProps = {
  index?: string;
  label: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeader({
  index,
  label,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const alignClass =
    align === "center" ? "mx-auto max-w-3xl text-center items-center" : "max-w-3xl text-left";

  return (
    <div className={`${alignClass} ${className}`}>
      <div
        className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="h-px w-10 bg-accent" aria-hidden />
        {index ? (
          <span className="font-mono text-[11px] tracking-[0.2em] text-mute">{index}</span>
        ) : null}
        <span className="editorial-label">{label}</span>
      </div>

      <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] text-ink">
        {title}
      </h2>

      {description ? (
        <p
          className={`mt-4 max-w-xl text-base font-light leading-relaxed text-mute ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
