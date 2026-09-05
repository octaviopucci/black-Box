"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageCarouselProps = {
  images: readonly string[];
  altPrefix: string;
  className?: string;
  labels?: {
    prev: string;
    next: string;
    close: string;
    of: string;
    swipeHint: string;
  };
};

export function ImageCarousel({
  images,
  altPrefix,
  className,
  labels = {
    prev: "Anterior",
    next: "Próxima",
    close: "Fechar",
    of: "de",
    swipeHint: "Deslize para ver mais",
  },
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = useCallback(
    (direction: -1 | 1) => {
      setIndex((current) => (current + direction + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  if (images.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="group relative">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="portfolio-frame relative aspect-[4/5] w-full overflow-hidden ring-1 ring-white/10"
        >
          <Image
            src={images[index]!}
            alt={`${altPrefix} ${index + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            className="portfolio-img object-cover"
            priority={index === 0}
          />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-line/40 bg-paper/90 text-ink opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
              aria-label={labels.prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-line/40 bg-paper/90 text-ink opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100"
              aria-label={labels.next}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <>
          <div className="flex justify-center gap-1.5">
            {images.map((src, dotIndex) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(dotIndex)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  dotIndex === index ? "w-5 bg-accent" : "w-1.5 bg-white/25",
                )}
                aria-label={`${altPrefix} ${dotIndex + 1}`}
              />
            ))}
          </div>
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-mute">
            {labels.swipeHint}
          </p>
        </>
      )}

      {lightbox && (
        <div
          className="lightbox-open fixed inset-0 z-[70] flex items-center justify-center bg-paper/96 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-ink"
            onClick={() => setLightbox(false)}
            aria-label={labels.close}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-surface"
            aria-label={labels.prev}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-surface"
            aria-label={labels.next}
          >
            <ChevronRight />
          </button>
          <div
            className="relative h-[min(85vh,900px)] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]!}
              alt={`${altPrefix} ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
            />
          </div>
          <p className="absolute bottom-5 text-xs tracking-widest text-mute">
            {index + 1} {labels.of} {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
