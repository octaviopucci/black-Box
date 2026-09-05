"use client";

import Image from "next/image";
import { useMemo } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

import { lerp } from "@/lib/hero-easing";

function dedupe(urls: readonly string[]): string[] {
  return [...new Set(urls)];
}

function buildPools() {
  const rafael = dedupe(site.heroRoll);
  const works = dedupe(site.gallery.map((g) => g.src)).filter((src) => !rafael.includes(src));
  return { rafael, works, all: dedupe([...rafael, ...works]) };
}

function buildColumn(
  rafael: string[],
  works: string[],
  all: string[],
  minItems: number,
): string[] {
  const col: string[] = [];
  let ri = 0;
  let wi = 0;

  const takeRafael = () => {
    while (ri < rafael.length) {
      const next = rafael[ri++];
      if (!col.includes(next) && col.at(-1) !== next) return next;
    }
    return null;
  };

  const takeWork = () => {
    while (wi < works.length) {
      const next = works[wi++];
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
    const lastIsRafael = last !== undefined && rafael.includes(last);

    let next = lastIsRafael || last === undefined ? takeWork() : takeRafael();
    if (!next) next = lastIsRafael ? takeRafael() : takeWork();
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
  const { rafael, works, all } = buildPools();
  const minPerColumn = 7;

  const col0 = buildColumn([...rafael], [...works], all, minPerColumn);
  const col1 = buildColumn(
    [...rafael].reverse(),
    [...works].reverse(),
    [...all].reverse(),
    minPerColumn,
  );

  return [loopTrack(col0), loopTrack(col1)];
}

type PhotoRollProps = {
  className?: string;
  scrollProgress?: number;
  /** Cantinho direito fixo — ignora scrollProgress */
  fixed?: boolean;
};

export function PhotoRoll({ className = "", scrollProgress = 0, fixed = false }: PhotoRollProps) {
  const columns = useMemo(() => buildColumns(), []);
  const t = fixed ? 0 : scrollProgress;
  const cinematic = 1 - t;

  // Collapsed: rolls on the right (~58% width). Expanded: full viewport, 50/50 columns.
  const shellStyle = {
    top: `${lerp(-8, 0, t)}%`,
    bottom: `${lerp(-8, 0, t)}%`,
    left: `${lerp(42, 0, t)}%`,
    right: 0,
  };

  const trackStyle = {
    transform: `translate3d(0, ${cinematic * -56}px, 0) scale(${lerp(1.22, 1, t)})`,
    transformOrigin: t > 0.45 ? "center center" : "center right",
    height: `${lerp(120, 100, t)}%`,
    gap: `${lerp(12, 6, t)}px`,
    paddingLeft: `${lerp(16, 8, t)}px`,
    paddingRight: `${lerp(16, 8, t)}px`,
    paddingTop: `${lerp(40, 12, t)}px`,
  };

  const maskOpacity = cinematic * 0.92;

  return (
    <div
      className={`pointer-events-none absolute z-[1] overflow-hidden ${className}`}
      style={shellStyle}
      aria-hidden
    >
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/25 to-transparent"
        style={{ opacity: maskOpacity }}
      />

      <div
        className="flex h-full w-full will-change-transform"
        style={trackStyle}
      >
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className={cn(
              "flex min-w-0 flex-col",
              colIndex === 0 ? "photo-roll-up" : "photo-roll-down",
            )}
            style={{
              width: "50%",
              gap: `${lerp(8, 6, t)}px`,
              transform: `translateY(${cinematic * (colIndex === 0 ? 28 : -28)}px)`,
            }}
          >
            {col.map((src, i) => (
              <div
                key={`${colIndex}-${i}-${src}`}
                className="relative aspect-[3/4] w-full shrink-0 overflow-hidden ring-1 ring-white/5"
                style={{
                  transform: `translateX(${cinematic * (i % 2 === 0 ? -8 : 8)}px)`,
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="50vw"
                  className="object-cover contrast-[1.05]"
                  style={{
                    filter: `grayscale(${0.35 * cinematic * 0.6}) contrast(1.05)`,
                  }}
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
