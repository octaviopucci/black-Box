"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  site,
  galleryFilterLabels,
  type GalleryCategory,
} from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 12;
const LOAD_BATCH = 9;

const filters: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "realismo", label: "Realismo" },
  { id: "cobertura", label: "Coberturas" },
  { id: "delicadas", label: "Delicadas" },
  { id: "estilos", label: "Estilos" },
];

export function Gallery() {
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

  const goLightbox = (direction: -1 | 1) => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex + direction + visibleItems.length) % visibleItems.length,
    );
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
  }, [lightboxIndex, visibleItems.length]);

  return (
    <section id="trabalhos" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="003"
            label="Portfólio"
            title="Conheça meu trabalho — realismo, coberturas, delicadas e estilos clássicos."
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors",
                filter === item.id
                  ? "bg-accent text-paper"
                  : "border border-line text-mute hover:border-accent hover:text-accent",
              )}
            >
              {item.label}
            </button>
          ))}
        </Reveal>

        <div className="mt-12 grid gap-px bg-line/30 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item, index) => (
            <Reveal key={item.src} delay={index * 0.03}>
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-[4/5] overflow-hidden bg-elevated"
              >
                <Image
                  src={item.src}
                  alt={`${galleryFilterLabels[item.category]} — trabalho ${index + 1}`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-paper/90 to-transparent p-4 text-left">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    {galleryFilterLabels[item.category]}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {visibleCount < items.length && (
          <Reveal delay={0.1} className="mt-10 text-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + LOAD_BATCH, items.length),
                )
              }
              className="btn-ghost"
            >
              Carregar mais
            </button>
          </Reveal>
        )}
      </div>

      {lightboxIndex !== null && visibleItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-paper/96 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-ink"
            onClick={() => setLightboxIndex(null)}
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
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-surface"
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
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-surface"
            aria-label="Próxima"
          >
            <ChevronRight />
          </button>
          <div
            className="relative h-[min(85vh,900px)] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={visibleItems[lightboxIndex].src}
              alt="Trabalho ampliado"
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
            />
          </div>
          <p className="absolute bottom-5 font-mono text-xs tracking-widest text-mute">
            {lightboxIndex + 1} / {visibleItems.length}
          </p>
        </div>
      )}
    </section>
  );
}
