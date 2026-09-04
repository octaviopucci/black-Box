type SectionHeaderProps = {
  index: string;
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
      <p className="font-mono text-xs tracking-[0.2em] text-mute/60">[{index}]</p>
      <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase leading-[0.95] tracking-tight text-ink">
        {label}
      </h2>
      {title ? (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute md:text-lg">
          {title}
        </p>
      ) : null}
      {description ? (
        <p
          className={`mt-3 max-w-xl text-sm leading-relaxed text-mute/80 ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
