"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { site, type GalleryCategory } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const filters: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "blackgrey", label: "Preto & Cinza" },
  { id: "colorido", label: "Colorido" },
];

const categoryLabel: Record<string, string> = {
  blackgrey: "Preto & Cinza",
  colorido: "Colorido",
};

export function Gallery() {
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = useMemo(() => {
    if (filter === "all") return site.gallery.slice(0, 9);
    return site.gallery.filter((item) => item.category === filter).slice(0, 9);
  }, [filter]);

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

  return (
    <section id="trabalhos" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="003"
            label="Trabalhos"
            title="Uma coleção de projetos, estilos e histórias eternizadas na pele."
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
                  ? "bg-ink text-paper"
                  : "border border-line text-mute hover:border-ink hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </Reveal>

        <div className="mt-12 grid gap-px bg-line/30 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.src} delay={index * 0.04}>
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative flex aspect-[4/5] flex-col justify-end bg-surface p-6 text-left transition-colors hover:bg-elevated"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={item.src}
                    alt={`Trabalho ${index + 1}`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-40 transition-opacity duration-500 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/60 to-transparent" />
                </div>

                <div className="relative z-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                    {categoryLabel[item.category] ?? item.category}
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-ink">
                    Projeto {String(index + 1).padStart(2, "0")}
                  </h3>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && items[lightboxIndex] && (
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
              src={items[lightboxIndex].src}
              alt="Trabalho ampliado"
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-contain"
            />
          </div>
          <p className="absolute bottom-5 font-mono text-xs tracking-widest text-mute">
            {lightboxIndex + 1} / {items.length}
          </p>
        </div>
      )}
    </section>
  );
}
