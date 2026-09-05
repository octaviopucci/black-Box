"use client";

import { useMemo } from "react";
import Image from "next/image";
import { buildHeroPhotoColumns } from "@/components/hero/hero-photo-rolls-data";
import { smoothstep } from "@/hooks/use-hero-scroll-progress";
import { cn } from "@/lib/utils";

type HeroPhotoRollsProps = {
  scrollProgress?: number;
  className?: string;
};

export function HeroPhotoRolls({ scrollProgress = 0, className = "" }: HeroPhotoRollsProps) {
  const columns = useMemo(() => buildHeroPhotoColumns(), []);
  const eased = smoothstep(scrollProgress);

  const inset = {
    top: `${-8 * eased}%`,
    right: 0,
    bottom: `${-8 * eased}%`,
    left: `${(1 - eased) * 42}%`,
  };

  const transform = {
    transform: `translate3d(${-6 * eased}%, ${-80 * scrollProgress}px, 0) scale(${1 + 0.35 * eased})`,
    transformOrigin: "center right",
  };

  return (
    <div
      className={cn("pointer-events-none absolute z-[1] overflow-hidden", className)}
      style={inset}
      aria-hidden
    >
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/25 to-transparent transition-opacity duration-100"
        style={{ opacity: 1 - 0.92 * eased }}
      />

      <div
        className="flex h-[120%] gap-2 px-2 pt-6 will-change-transform md:gap-3 md:px-4 md:pt-10"
        style={transform}
      >
        {columns.map((photos, columnIndex) => (
          <div
            key={columnIndex}
            className={cn(
              "flex min-w-0 flex-1 flex-col gap-2 md:gap-3",
              columnIndex === 0 ? "photo-roll-up" : "photo-roll-down",
            )}
            style={{ transform: `translateY(${scrollProgress * (columnIndex === 0 ? 32 : -32)}px)` }}
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
                  style={{ filter: `grayscale(${0.35 * (1 - 0.6 * eased)}) contrast(1.05)` }}
                  priority={columnIndex === 0 && photoIndex < 2}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
