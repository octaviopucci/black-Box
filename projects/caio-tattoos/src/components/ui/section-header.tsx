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
    align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left";

  return (
    <div className={`${alignClass} ${className}`}>
      {index ? (
        <p className="font-mono text-[11px] tracking-[0.22em] text-white/35">
          [{index}]
        </p>
      ) : null}

      <h2 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-tight text-ink">
        {label}
      </h2>

      <p
        className={`mt-4 text-lg font-medium leading-snug text-white/75 md:text-xl ${align === "center" ? "mx-auto" : ""}`}
      >
        {title}
      </p>

      {description ? (
        <p
          className={`mt-4 max-w-xl text-sm leading-relaxed text-mute md:text-base ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
