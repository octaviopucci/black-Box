"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { site, type GalleryCategory, type GalleryItem } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 8;
const LOAD_BATCH = 6;

function galleryItemKey(item: GalleryItem) {
  return `${item.type}:${item.src}`;
}

function GalleryVideoCard({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={alt}
      className="portfolio-img h-full w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function GalleryLightboxMedia({ item }: { item: GalleryItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || item.type !== "video") return;
    void video.play().catch(() => {});
    return () => {
      video.pause();
    };
  }, [item]);

  if (item.type === "video") {
    return (
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        controls
        playsInline
        muted
        preload="metadata"
        aria-label={item.alt}
        className="h-full w-full object-contain"
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      loading="lazy"
      sizes="(max-width: 1024px) 100vw, 896px"
      className="object-contain"
    />
  );
}

export function Gallery() {
  const { t } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const filters: { id: GalleryCategory; label: string }[] = [
    { id: "all", label: t.gallery.filters.all },
    { id: "blackgrey", label: t.gallery.filters.blackgrey },
    { id: "fineline", label: t.gallery.filters.fineline },
  ];

  const items = useMemo(() => {
    if (filter === "all") return site.gallery;
    return site.gallery.filter((item) => item.category === filter);
  }, [filter]);

  const visibleItems = items.slice(0, visibleCount);

  const selectFilter = (id: GalleryCategory) => {
    setFilter(id);
    setVisibleCount(INITIAL_VISIBLE);
  };

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

  const goLightbox = useCallback(
    (direction: -1 | 1) => {
      setLightboxIndex((current) => {
        if (current === null) return null;
        return (current + direction + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goLightbox(-1);
      if (event.key === "ArrowRight") goLightbox(1);
      if (event.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, goLightbox]);

  const lightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section id="trabalhos" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader
            align="center"
            index="002"
            label={t.gallery.label}
            title={t.gallery.title}
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((item) => {
            const count =
              item.id === "all"
                ? site.gallery.length
                : site.gallery.filter((g) => g.category === item.id).length;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectFilter(item.id)}
                className={cn(
                  "px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all duration-300",
                  filter === item.id
                    ? "bg-white text-black"
                    : "border border-white/15 text-mute hover:border-white/40 hover:text-white",
                )}
              >
                {item.label}
                {filter === item.id ? ` (${count})` : ""}
              </button>
            );
          })}
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
            {visibleItems.map((item) => {
              const globalIndex = items.indexOf(item);
              return (
                <button
                  key={galleryItemKey(item)}
                  type="button"
                  onClick={() => setLightboxIndex(globalIndex)}
                  className="portfolio-frame group relative h-[17.5rem] w-[13.125rem] shrink-0 snap-start overflow-hidden sm:h-[20rem] sm:w-[15rem] md:h-[22rem] md:w-[16.5rem]"
                >
                  {item.type === "video" ? (
                    <GalleryVideoCard
                      src={item.src}
                      poster={item.poster}
                      alt={item.alt}
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 210px, 264px"
                      className="portfolio-img"
                    />
                  )}
                  <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-paper/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <Search className="h-5 w-5 text-ink" strokeWidth={1.5} />
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>

        <p className="mt-4 text-xs text-mute">{t.gallery.swipeHint}</p>
      </div>

      {lightboxItem && lightboxIndex !== null && (
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
            <GalleryLightboxMedia item={lightboxItem} />
          </div>
          <p className="absolute bottom-5 max-w-lg px-6 text-center text-xs tracking-wide text-mute">
            {lightboxItem.alt}
          </p>
          <p className="absolute bottom-12 text-[10px] tracking-widest text-mute/80">
            {lightboxIndex + 1} {t.gallery.of} {items.length}
          </p>
        </div>
      )}
    </section>
  );
}
