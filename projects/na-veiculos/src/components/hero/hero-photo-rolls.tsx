"use client";

import { useMemo } from "react";
import Image from "next/image";
import { buildHeroPhotoColumns } from "@/components/hero/hero-photo-rolls-data";
import { cn } from "@/lib/utils";

export function HeroPhotoRolls() {
  const columns = useMemo(() => buildHeroPhotoColumns(), []);

  return (
    <div
      className="pointer-events-none absolute inset-y-[-8%] right-0 left-[42%] z-[1] overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/25 to-transparent" />

      <div className="flex h-[120%] gap-2 px-2 pt-6 md:gap-3 md:px-4 md:pt-10">
        {columns.map((photos, columnIndex) => (
          <div key={columnIndex} className="min-w-0 flex-1">
            <div
              className={cn(
                "flex flex-col gap-2 md:gap-3",
                columnIndex === 0 ? "photo-roll-up" : "photo-roll-down",
              )}
            >
              {photos.map((src, photoIndex) => (
                <div
                  key={`${columnIndex}-${photoIndex}-${src}`}
                  className={cn(
                    "relative aspect-[3/4] w-full shrink-0 overflow-hidden ring-1 ring-white/5",
                    photoIndex % 2 === 0 ? "-translate-x-1 md:-translate-x-2" : "translate-x-1 md:translate-x-2",
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 100vw"
                    className="hero-photo object-cover contrast-[1.05]"
                    style={{ filter: "grayscale(0.14) contrast(1.05)" }}
                    priority={columnIndex === 0 && photoIndex < 2}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
