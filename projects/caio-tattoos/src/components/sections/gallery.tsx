"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { site, type PortfolioCategory } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 8;
const LOAD_BATCH = 6;

type PortfolioGalleryProps = {
  category: PortfolioCategory;
  sectionId: string;
  index: string;
};

export function PortfolioGallery({ category, sectionId, index }: PortfolioGalleryProps) {
  const { t } = useLocale();
  const block = t.portfolio[category];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const items = useMemo(
    () => site.gallery.filter((item) => item.category === category),
    [category],
  );

  const visibleItems = items.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [category]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const onScroll = () => {
      if (visibleCount >= items.length) return;
      const { scrollLeft, scrollWidth, clientWidth } = node;
      if (scrollLeft + clientWidth >= scrollWidth - 160) {
        setVisibleCount((count) => Math.min(count + LOAD_BATCH, items.length));
      }
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, [items.length, visibleCount]);

  const scrollBy = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: direction * 280, behavior: "auto" });
  };

  const goLightbox = (direction: -1 | 1) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + direction + items.length) % items.length);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goLightbox(-1);
      if (event.key === "ArrowRight") goLightbox(1);
      if (event.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, items.length]);

  if (items.length === 0) return null;

  return (
    <section
      id={sectionId}
      className={cn("py-24 md:py-32", category === "adidas" ? "bg-surface" : "bg-paper")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            align="center"
            index={index}
            label={block.label}
            title={block.title}
          />
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-mute md:text-base">
            {block.intro}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="group/row relative mt-10">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-paper text-ink opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
            aria-label={t.gallery.scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-line bg-paper text-ink opacity-0 transition-opacity group-hover/row:opacity-100 md:flex"
            aria-label={t.gallery.scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 md:gap-4"
          >
            {visibleItems.map((item, itemIndex) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setLightboxIndex(itemIndex)}
                className="portfolio-frame group relative h-[17.5rem] w-[13.125rem] shrink-0 snap-start sm:h-[20rem] sm:w-[15rem] md:h-[22rem] md:w-[16.5rem]"
              >
                <Image
                  src={item.src}
                  alt={`${block.workAlt} ${itemIndex + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 210px, 264px"
                  className="portfolio-img"
                />
                <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-paper/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <Search className="h-5 w-5 text-ink" strokeWidth={1.5} />
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        <p className="mt-4 text-xs text-mute">{t.gallery.swipeHint}</p>
      </div>

      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          className="lightbox-open fixed inset-0 z-[70] flex items-center justify-center bg-paper/96 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-ink"
            onClick={() => setLightboxIndex(null)}
            aria-label={t.gallery.close}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(-1);
            }}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-surface"
            aria-label={t.gallery.prev}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(1);
            }}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-surface"
            aria-label={t.gallery.next}
          >
            <ChevronRight />
          </button>
          <div
            className="relative h-[min(85vh,900px)] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[lightboxIndex].src}
              alt={t.gallery.workEnlarged}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
            />
          </div>
          <p className="absolute bottom-5 text-xs tracking-widest text-mute">
            {lightboxIndex + 1} {t.gallery.of} {items.length}
          </p>
        </div>
      )}
    </section>
  );
}
