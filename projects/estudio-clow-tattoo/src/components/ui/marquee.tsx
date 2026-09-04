"use client";

type MarqueeProps = {
  items: readonly string[];
  className?: string;
};

export function Marquee({ items, className = "" }: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div
      className={`overflow-hidden border-y border-white/10 bg-black py-4 ${className}`}
      aria-hidden
    >
      <div className="marquee-track flex w-max gap-10 md:gap-14">
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.38em] text-white/35"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
