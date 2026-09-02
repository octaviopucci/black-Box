"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { site, type GalleryCategory } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const filters: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "blackgrey", label: "Preto & Cinza" },
  { id: "colorido", label: "Colorido" },
];

const INITIAL_VISIBLE = 10;
const LOAD_BATCH = 8;

export function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const items = useMemo(() => {
    if (filter === "all") return site.gallery;
    return site.gallery.filter((item) => item.category === filter);
  }, [filter]);

  const visibleItems = items.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [filter]);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const onScroll = () => {
      if (visibleCount >= items.length) return;
      const { scrollLeft, scrollWidth, clientWidth } = node;
      if (scrollLeft + clientWidth >= scrollWidth - 120) {
        setVisibleCount((count) => Math.min(count + LOAD_BATCH, items.length));
      }
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, [items.length, visibleCount]);

  const scrollBy = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goLightbox = (direction: -1 | 1) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + direction + items.length) % items.length;
    setLightboxIndex(next);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goLightbox(-1);
      if (event.key === "ArrowRight") goLightbox(1);
      if (event.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, items.length]);

  return (
    <section id="trabalhos" className="relative bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionHeader index="02" label="Portfólio" title="Nossos trabalhos" />
        </Reveal>

        <Reveal delay={0.08} className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((item) => {
            const count =
              item.id === "all"
                ? site.gallery.length
                : site.gallery.filter((g) => g.category === item.id).length;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "px-5 py-2.5 text-xs uppercase tracking-widest transition-colors duration-200",
                  filter === item.id
                    ? "bg-accent font-medium text-paper"
                    : "border border-line text-mute hover:border-ink hover:text-ink",
                )}
              >
                {item.label}
                {filter === item.id ? ` (${count})` : ""}
              </button>
            );
          })}
        </Reveal>

        <Reveal delay={0.1} className="group/row relative mt-8">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-paper/90 text-ink opacity-0 transition-opacity hover:bg-elevated group-hover/row:opacity-100 md:flex"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-paper/90 text-ink opacity-0 transition-opacity hover:bg-elevated group-hover/row:opacity-100 md:flex"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 md:gap-3"
          >
            {visibleItems.map((item, index) => (
              <button
                key={item.src}
                type="button"
                onClick={() => openLightbox(index)}
                className="group relative h-44 w-44 shrink-0 snap-start overflow-hidden bg-elevated sm:h-52 sm:w-52 md:h-56 md:w-56"
              >
                <Image
                  src={item.src}
                  alt={`Trabalho ${index + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 176px, 224px"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/35">
                  <Search
                    className="h-6 w-6 text-ink opacity-0 transition-opacity group-hover:opacity-100"
                    strokeWidth={1.5}
                  />
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        <p className="mt-3 text-center text-xs text-mute/70">
          ← deslize para ver mais →
        </p>
        {lightboxIndex !== null && (
          <p className="mt-1 text-center text-xs text-mute/60">
            {lightboxIndex + 1} de {items.length}
          </p>
        )}
      </div>

      {lightboxIndex !== null && items[lightboxIndex] && (
        <div
          className="lightbox-open fixed inset-0 z-[70] flex items-center justify-center bg-paper/95 p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-ink"
            onClick={closeLightbox}
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(-1);
            }}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line bg-paper/80"
            aria-label="Anterior"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(1);
            }}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-line bg-paper/80"
            aria-label="Próxima"
          >
            <ChevronRight />
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[lightboxIndex].src}
              alt="Trabalho ampliado"
              fill
              sizes="100vw"
              loading="eager"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
