"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type HorizontalScrollCarouselProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
};

export function HorizontalScrollCarousel({
  children,
  className,
  trackClassName,
  ariaLabel,
  prevLabel = "Anterior",
  nextLabel = "Próximo",
}: HorizontalScrollCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollBy = useCallback((direction: -1 | 1) => {
    const track = ref.current;
    if (!track) return;

    const slide = track.querySelector<HTMLElement>("[data-carousel-slide]");
    const gap = 12;
    const step = slide ? slide.offsetWidth + gap : track.clientWidth * 0.88;

    track.scrollBy({
      left: direction * step,
      behavior: track.scrollWidth > track.clientWidth ? "smooth" : "auto",
    });
  }, []);

  return (
    <div className={cn("group/carousel relative", className)}>
      <div
        ref={ref}
        className={cn(
          "carousel-track scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-1",
          trackClassName,
        )}
        aria-label={ariaLabel}
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-line/50 bg-paper/95 text-ink shadow-sm transition-opacity group-hover/carousel:opacity-100 md:flex md:opacity-0"
        aria-label={prevLabel}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-line/50 bg-paper/95 text-ink shadow-sm transition-opacity group-hover/carousel:opacity-100 md:flex md:opacity-0"
        aria-label={nextLabel}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

type CarouselSlideProps = {
  children: ReactNode;
  className?: string;
};

export function CarouselSlide({ children, className }: CarouselSlideProps) {
  return (
    <div
      data-carousel-slide
      className={cn("shrink-0 snap-center snap-always scroll-ml-1", className)}
    >
      {children}
    </div>
  );
}
