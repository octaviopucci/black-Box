type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-3xl ${alignClass} ${className}`}>
      <span className="text-xs uppercase tracking-[0.4em] text-mute">{label}</span>
      <h2 className="mt-4 font-display text-4xl font-light italic leading-tight text-ink sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-xl font-light leading-relaxed text-mute">{description}</p>
      ) : null}
    </div>
  );
}
