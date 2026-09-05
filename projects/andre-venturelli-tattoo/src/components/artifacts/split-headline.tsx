type SplitHeadlineProps = {
  lines: string[];
  italicFrom?: number;
  className?: string;
};

export function SplitHeadline({
  lines,
  className = "",
}: SplitHeadlineProps) {
  return (
    <h1
      className={`text-[clamp(2.5rem,9vw,5.5rem)] font-bold uppercase leading-[0.92] tracking-tighter text-white ${className}`}
    >
      {lines.map((line, lineIndex) => (
        <span key={line} className="headline-line block overflow-hidden">
          <span
            className="headline-line-inner inline-block"
            style={{ animationDelay: `${0.15 + lineIndex * 0.12}s` }}
          >
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
