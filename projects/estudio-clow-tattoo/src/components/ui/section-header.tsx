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
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      <div
        className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}
      >
        {index ? (
          <span className="font-mono text-[11px] tracking-[0.2em] text-ink/40">{index}</span>
        ) : null}
        <span className="h-px w-8 bg-line" aria-hidden />
        <span className="text-xs uppercase tracking-[0.4em] text-mute">{label}</span>
        <span className="h-px w-8 bg-line" aria-hidden />
      </div>

      <h2 className="mt-5 font-display text-4xl font-light italic leading-tight text-ink sm:text-5xl md:text-6xl">
        {title}
      </h2>

      {description ? (
        <p
          className={`mt-4 max-w-xl font-light leading-relaxed text-mute ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
