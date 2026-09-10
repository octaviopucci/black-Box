export function VictorianDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden>
      <span className="vic-ornament-line h-px flex-1" />
      <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 text-[var(--gold)]">
        <path
          fill="currentColor"
          d="M6 0 7.4 4.6 12 6 7.4 7.4 6 12 4.6 7.4 0 6 4.6 4.6Z"
        />
      </svg>
      <span className="vic-ornament-line h-px flex-1" />
    </div>
  );
}

export function VictorianCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute text-[var(--gold)]/50 ${className}`}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 2h20M2 2v20M2 2c8 4 14 10 18 18"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
