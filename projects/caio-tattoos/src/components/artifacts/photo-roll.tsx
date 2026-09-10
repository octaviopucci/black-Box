"use client";

import Image from "next/image";
import { useMemo } from "react";
import { site, type RollItem } from "@/data/site";
import { cn } from "@/lib/utils";

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function dedupe(urls: readonly string[]): string[] {
  return [...new Set(urls)];
}

function buildPools() {
  const photos = dedupe([
    ...site.heroRoll,
    ...site.gallery.map((g) => g.src),
  ]);
  const sponsors: RollItem[] = site.sponsors.map((s) => ({
    kind: "sponsor" as const,
    src: s.logo,
    name: s.name,
  }));
  return { photos, sponsors };
}

function buildColumn(
  photos: string[],
  sponsors: RollItem[],
  minItems: number,
  sponsorOffset: number,
): RollItem[] {
  const col: RollItem[] = [];
  let pi = 0;
  let si = sponsorOffset;

  const takePhoto = (): RollItem | null => {
    const start = pi;
    while (pi < photos.length + start) {
      const next = photos[pi % photos.length];
      pi++;
      const last = col.at(-1);
      if (last?.kind === "photo" && last.src === next) continue;
      return { kind: "photo", src: next };
    }
    return null;
  };

  const takeSponsor = (): RollItem | null => {
    if (sponsors.length === 0) return null;
    for (let attempt = 0; attempt < sponsors.length; attempt++) {
      const sponsor = sponsors[si % sponsors.length];
      si++;
      if (col.at(-1)?.kind === "sponsor") continue;
      return sponsor;
    }
    return null;
  };

  let photosSinceSponsor = 0;

  while (col.length < minItems) {
    const shouldInsertSponsor =
      sponsors.length > 0 &&
      photosSinceSponsor >= 2 &&
      col.at(-1)?.kind !== "sponsor";

    if (shouldInsertSponsor) {
      const sponsor = takeSponsor();
      if (sponsor) {
        col.push(sponsor);
        photosSinceSponsor = 0;
        continue;
      }
    }

    const photo = takePhoto();
    if (!photo) break;
    col.push(photo);
    photosSinceSponsor++;
  }

  return col;
}

function fixLoopBoundary(track: RollItem[]): RollItem[] {
  if (track.length < 2) return track;
  const first = track[0];
  const last = track.at(-1);
  if (first && last && first.kind === last.kind) {
    if (first.kind === "sponsor" && first.src === last.src) {
      for (let i = 1; i < track.length - 1; i++) {
        if (track[i].kind === "photo") {
          const tmp = track[i];
          track[i] = track[track.length - 1];
          track[track.length - 1] = tmp;
          break;
        }
      }
    } else if (first.kind === "photo" && first.src === last.src) {
      for (let i = 1; i < track.length - 1; i++) {
        if (track[i].kind === "photo" && track[i].src !== first.src) {
          const tmp = track[i];
          track[i] = track[track.length - 1];
          track[track.length - 1] = tmp;
          break;
        }
      }
    }
  }
  return track;
}

function loopTrack(column: RollItem[]): RollItem[] {
  const track = fixLoopBoundary([...column]);
  if (track.length <= 1) return track;
  return [...track, ...track];
}

function buildColumns(): [RollItem[], RollItem[]] {
  const { photos, sponsors } = buildPools();
  const minPerColumn = 8;

  const col0 = buildColumn(photos, sponsors, minPerColumn, 0);
  const col1 = buildColumn(photos, sponsors, minPerColumn, 1);

  return [loopTrack(col0), loopTrack(col1)];
}

type PhotoRollProps = {
  className?: string;
  scrollProgress?: number;
};

function RollTile({
  item,
  colIndex,
  index,
  t,
}: {
  item: RollItem;
  colIndex: number;
  index: number;
  t: number;
}) {
  const offsetClass =
    index % 2 === 0 ? "-translate-x-1 md:-translate-x-2" : "translate-x-1 md:translate-x-2";

  if (item.kind === "sponsor") {
    return (
      <div
        className={cn(
          "relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-black ring-1 ring-white/10",
          offsetClass,
        )}
      >
        <Image
          src={item.src}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 100vw"
          className="object-contain p-6 md:p-8"
          priority={colIndex === 0 && index < 2}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[3/4] w-full shrink-0 overflow-hidden ring-1 ring-white/5",
        offsetClass,
      )}
    >
      <Image
        src={item.src}
        alt=""
        fill
        sizes="(max-width: 768px) 50vw, 100vw"
        className="object-cover contrast-[1.05]"
        style={{
          filter: `grayscale(${0.35 * (1 - t * 0.6)}) contrast(1.05)`,
        }}
        priority={colIndex === 0 && index < 2}
      />
    </div>
  );
}

export function PhotoRoll({ className = "", scrollProgress = 0 }: PhotoRollProps) {
  const columns = useMemo(() => buildColumns(), []);
  const t = smoothstep(scrollProgress);

  const leftPct = (1 - t) * 42;
  const innerScale = 1 + t * 0.35;
  const innerY = scrollProgress * -80;
  const maskOpacity = 1 - t * 0.92;

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
        className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/25 to-transparent transition-opacity duration-100"
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
            {col.map((item, i) => (
              <RollTile
                key={`${colIndex}-${i}-${item.kind}-${item.src}`}
                item={item}
                colIndex={colIndex}
                index={i}
                t={t}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
