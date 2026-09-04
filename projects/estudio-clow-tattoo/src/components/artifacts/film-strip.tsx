"use client";

import Image from "next/image";
import { useMemo } from "react";
import { site } from "@/data/site";

type FilmStripProps = {
  className?: string;
};

export function FilmStrip({ className = "" }: FilmStripProps) {
  const columns = useMemo(() => {
    const imgs = site.gallery.map((g) => g.src);
    const col1 = imgs.filter((_, i) => i % 3 === 0);
    const col2 = imgs.filter((_, i) => i % 3 === 1);
    const col3 = imgs.filter((_, i) => i % 3 === 2);
    return [col1, col2, col3];
  }, []);

  const animClass = ["film-scroll-up", "film-scroll-down", "film-scroll-up"] as const;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 flex gap-3 px-4 opacity-50 md:gap-4 md:px-8">
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className={`film-column flex min-w-0 flex-1 flex-col gap-3 md:gap-4 ${animClass[colIndex]}`}
          >
            {[...col, ...col].map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-2xl grayscale"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                  priority={colIndex === 1 && i < 2}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
