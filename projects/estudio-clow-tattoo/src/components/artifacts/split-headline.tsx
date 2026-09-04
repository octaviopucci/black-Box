type SplitHeadlineProps = {
  lines: string[];
  italicFrom?: number;
  className?: string;
};

export function SplitHeadline({
  lines,
  italicFrom = 1,
  className = "",
}: SplitHeadlineProps) {
  return (
    <h1
      className={`font-display text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.92] tracking-tight text-ink ${className}`}
    >
      {lines.map((line, lineIndex) => (
        <span key={line} className="headline-line block overflow-hidden">
          <span
            className={`headline-line-inner inline-block ${lineIndex >= italicFrom ? "italic" : ""}`}
            style={{ animationDelay: `${0.15 + lineIndex * 0.12}s` }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
