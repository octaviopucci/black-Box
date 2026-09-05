type InkFrameProps = {
  className?: string;
};

export function InkFrame({ className = "" }: InkFrameProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-6 sm:inset-10 ${className}`}
    >
      <span className="absolute left-0 top-0 h-10 w-10 border-l border-t border-ink/25" />
      <span className="absolute right-0 top-0 h-10 w-10 border-r border-t border-ink/25" />
      <span className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-ink/25" />
      <span className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-ink/25" />
    </div>
  );
}
