"use client";

type MarqueeProps = {
  items: readonly string[];
  className?: string;
};

export function Marquee({ items, className = "" }: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div
      className={`overflow-hidden border-y border-line/60 bg-surface py-4 ${className}`}
      aria-hidden
    >
      <div className="marquee-track flex w-max gap-10 md:gap-14">
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.38em] text-mute/70"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
