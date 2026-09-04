"use client";

import Image from "next/image";
import { useMemo } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

function buildRollImages() {
  const rafael = [...site.heroRoll];
  const works = site.gallery.map((g) => g.src);

  const merged: string[] = [];
  let r = 0;
  let w = 0;

  while (merged.length < 20) {
    if (r < rafael.length) merged.push(rafael[r++]);
    if (w < works.length && merged.length < 20) merged.push(works[w++]);
  }

  return merged;
}

export function PhotoRoll({ className = "" }: { className?: string }) {
  const columns = useMemo(() => {
    const imgs = buildRollImages();
    return [imgs.filter((_, i) => i % 2 === 0), imgs.filter((_, i) => i % 2 === 1)];
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 right-0 z-[1] w-[min(54vw,560px)] overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/25 to-transparent" />

      <div className="flex h-[120%] gap-2 px-2 pt-6 md:gap-3 md:px-4 md:pt-10">
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className={cn(
              "flex min-w-0 flex-1 flex-col gap-2 md:gap-3",
              colIndex === 0 ? "photo-roll-up" : "photo-roll-down",
            )}
          >
            {[...col, ...col].map((src, i) => (
              <div
                key={`${src}-${i}`}
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
