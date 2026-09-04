export function DiagonalLines({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1.5 md:left-8 lg:flex ${className}`}
      aria-hidden
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="block h-px w-8 origin-left rotate-[135deg] bg-white/25"
        />
      ))}
    </div>
  );
}

export function ScrollIndicator({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 md:right-8 lg:flex ${className}`}
      aria-hidden
    >
      <span className="block h-16 w-px bg-white/20" />
      <span
        className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/40"
        style={{ writingMode: "vertical-rl" }}
      >
        Scroll
      </span>
    </div>
  );
}
