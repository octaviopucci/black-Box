"use client";

import Image from "next/image";
import { useMemo } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function dedupe(urls: readonly string[]): string[] {
  return [...new Set(urls)];
}

function buildPools() {
  const featured = dedupe(site.heroRoll);
  const portfolio = dedupe(site.gallery.map((g) => g.src)).filter(
    (src) => !featured.includes(src),
  );
  return { featured, portfolio, all: dedupe([...featured, ...portfolio]) };
}

function buildColumn(
  featured: string[],
  portfolio: string[],
  all: string[],
  minItems: number,
): string[] {
  const col: string[] = [];
  let fi = 0;
  let pi = 0;

  const takeFeatured = () => {
    while (fi < featured.length) {
      const next = featured[fi++];
      if (!col.includes(next) && col.at(-1) !== next) return next;
    }
    return null;
  };

  const takePortfolio = () => {
    while (pi < portfolio.length) {
      const next = portfolio[pi++];
      if (!col.includes(next) && col.at(-1) !== next) return next;
    }
    return null;
  };

  const takeAny = () => {
    for (const next of all) {
      if (!col.includes(next) && col.at(-1) !== next) return next;
    }
    return null;
  };

  while (col.length < minItems) {
    const last = col.at(-1);
    const lastIsFeatured = last !== undefined && featured.includes(last);

    let next = lastIsFeatured || last === undefined ? takePortfolio() : takeFeatured();
    if (!next) next = lastIsFeatured ? takeFeatured() : takePortfolio();
    if (!next) next = takeAny();
    if (!next) break;
    col.push(next);
  }

  return col;
}

function fixLoopBoundary(track: string[]): string[] {
  if (track.length < 2) return track;
  if (track[0] === track.at(-1)) {
    for (let i = 1; i < track.length - 1; i++) {
      if (track[i] !== track[0] && track[i] !== track.at(-2)) {
        const last = track.length - 1;
        const tmp = track[i];
        track[i] = track[last];
        track[last] = tmp;
        break;
      }
    }
  }
  return track;
}

function loopTrack(column: string[]): string[] {
  const track = fixLoopBoundary([...column]);
  if (track.length === 0) return track;
  if (track.length === 1) return track;
  return [...track, ...track];
}

function buildColumns(): [string[], string[]] {
  const { featured, portfolio, all } = buildPools();
  const minPerColumn = 8;

  const col0 = buildColumn([...featured], [...portfolio], all, minPerColumn);
  const col1 = buildColumn(
    [...featured].reverse(),
    [...portfolio].reverse(),
    [...all].reverse(),
    minPerColumn,
  );

  return [loopTrack(col0), loopTrack(col1)];
}

type PhotoRollProps = {
  className?: string;
  scrollProgress?: number;
};

export function PhotoRoll({ className = "", scrollProgress = 0 }: PhotoRollProps) {
  const columns = useMemo(() => buildColumns(), []);
  const t = smoothstep(scrollProgress);

  const leftPct = (1 - t) * 42;
  const innerScale = 1 + t * 0.35;
  const innerY = scrollProgress * -80;
  const maskOpacity = 1 - t * 0.85;

  const shellStyle = {
    top: `${-t * 8}%`,
    right: 0,
    bottom: `${-t * 8}%`,
    left: `${leftPct}%`,
  };

  const trackStyle = {
    transform: `translate3d(${-t * 6}%, ${innerY}px, 0) scale(${innerScale})`,
    transformOrigin: "center right" as const,
  };

  return (
    <div
      className={`pointer-events-none absolute z-[1] overflow-hidden ${className}`}
      style={shellStyle}
      aria-hidden
    >
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-paper via-paper/55 to-transparent transition-opacity duration-100"
        style={{ opacity: maskOpacity }}
      />

      <div
        className="flex h-[120%] gap-2 px-2 pt-6 will-change-transform md:gap-3 md:px-4 md:pt-10"
        style={trackStyle}
      >
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className={cn(
              "flex min-w-0 flex-1 flex-col gap-2 md:gap-3",
              colIndex === 0 ? "photo-roll-up" : "photo-roll-down",
            )}
            style={{
              transform: `translateY(${scrollProgress * (colIndex === 0 ? 32 : -32)}px)`,
            }}
          >
            {col.map((src, i) => (
              <div
                key={`${colIndex}-${i}-${src}`}
                className={cn(
                  "relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-sm ring-1 ring-line/60",
                  i % 2 === 0 ? "-translate-x-1 md:-translate-x-2" : "translate-x-1 md:translate-x-2",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority={colIndex === 0 && i < 2}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
