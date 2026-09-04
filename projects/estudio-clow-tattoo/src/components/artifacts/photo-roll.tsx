"use client";

import Image from "next/image";
import { useMemo } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

function dedupe(urls: readonly string[]): string[] {
  return [...new Set(urls)];
}

function interleave(rafael: string[], works: string[]): string[] {
  const out: string[] = [];
  let r = 0;
  let w = 0;

  while (r < rafael.length || w < works.length) {
    if (r < rafael.length) {
      const next = rafael[r++];
      if (out.at(-1) !== next) out.push(next);
    }
    if (w < works.length) {
      const next = works[w++];
      if (out.at(-1) !== next) out.push(next);
    }
  }

  return out;
}

function fixConsecutive(seq: string[]): string[] {
  if (seq.length < 2) return seq;

  const result = [...seq];

  for (let i = 1; i < result.length; i++) {
    if (result[i] === result[i - 1]) {
      const swap = result.findIndex(
        (url, j) => j > i && url !== result[i - 1] && url !== result[i + 1],
      );
      if (swap !== -1) [result[i], result[swap]] = [result[swap], result[i]];
    }
  }

  if (result[0] === result.at(-1)) {
    const last = result.length - 1;
    const swap = result.findIndex(
      (url, j) => j > 0 && j < last && url !== result[0] && url !== result[last - 1],
    );
    if (swap !== -1) {
      const tmp = result[swap];
      result[swap] = result[last];
      result[last] = tmp;
    }
  }

  return result;
}

function buildMasterSequence(): string[] {
  const rafael = dedupe(site.heroRoll);
  const works = dedupe(site.gallery.map((g) => g.src)).filter((src) => !rafael.includes(src));

  let sequence = interleave(rafael, works);

  const target = Math.max(14, Math.min(20, rafael.length + Math.min(works.length, 12)));
  let cursor = 0;
  const pool = [...sequence];

  while (sequence.length < target && pool.length > 0) {
    const next = pool[cursor % pool.length];
    cursor++;
    if (sequence.at(-1) !== next) sequence.push(next);
    if (cursor > pool.length * 4) break;
  }

  return fixConsecutive(sequence);
}

function splitColumns(sequence: string[]): [string[], string[]] {
  const col0: string[] = [];
  const col1: string[] = [];

  sequence.forEach((src, i) => {
    (i % 2 === 0 ? col0 : col1).push(src);
  });

  return [fixConsecutive(col0), fixConsecutive(col1)];
}

function loopTrack(column: string[]): string[] {
  const track = fixConsecutive(column);
  if (track.length === 0) return track;
  if (track.length === 1) return [...track, ...track];
  return [...track, ...track];
}

type PhotoRollProps = {
  className?: string;
  scrollProgress?: number;
};

export function PhotoRoll({ className = "", scrollProgress = 0 }: PhotoRollProps) {
  const columns = useMemo(() => {
    const master = buildMasterSequence();
    const [col0, col1] = splitColumns(master);
    return [loopTrack(col0), loopTrack(col1)];
  }, []);

  const parallaxY = scrollProgress * -160;
  const scale = 1 - scrollProgress * 0.07;
  const rollStyle = {
    transform: `translate3d(0, ${parallaxY}px, 0) scale(${scale})`,
    transformOrigin: "center right" as const,
  };

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 right-0 z-[1] w-[min(54vw,560px)] overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/25 to-transparent" />

      <div className="flex h-[120%] gap-2 px-2 pt-6 md:gap-3 md:px-4 md:pt-10" style={rollStyle}>
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className={cn(
              "flex min-w-0 flex-1 flex-col gap-2 md:gap-3",
              colIndex === 0 ? "photo-roll-up" : "photo-roll-down",
            )}
            style={{
              transform: `translateY(${scrollProgress * (colIndex === 0 ? 48 : -48)}px)`,
            }}
          >
            {col.map((src, i) => (
              <div
                key={`${colIndex}-${i}-${src}`}
                className={cn(
                  "relative aspect-[3/4] w-full shrink-0 overflow-hidden ring-1 ring-white/5",
                  i % 2 === 0 ? "-translate-x-1 md:-translate-x-2" : "translate-x-1 md:translate-x-2",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 27vw, 280px"
                  className="object-cover grayscale-[0.35] contrast-[1.05]"
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
