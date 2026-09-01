"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { site, type GalleryCategory } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const filters: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "blackgrey", label: "Preto & Cinza" },
  { id: "colorido", label: "Colorido" },
];

export function Gallery() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(() => {
    if (filter === "all") return site.gallery;
    return site.gallery.filter((item) => item.category === filter);
  }, [filter]);

  const current = items[index] ?? items[0];

  const go = (direction: -1 | 1) => {
    if (!items.length) return;
    setIndex((prev) => (prev + direction + items.length) % items.length);
  };

  return (
    <section id="trabalhos" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
              Portfólio
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] italic leading-[1.02] text-ink">
              Nossos trabalhos
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFilter(item.id);
                  setIndex(0);
                }}
                className={cn(
                  "px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition-colors",
                  filter === item.id
                    ? "bg-ink text-paper"
                    : "border border-ink/15 text-mute hover:text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink/5 md:aspect-[16/10]">
            <AnimatePresence mode="wait">
              {current && (
                <motion.button
                  key={current.src}
                  type="button"
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.55 }}
                  onClick={() => setLightbox(index)}
                  className="relative h-full w-full"
                >
                  <Image
                    src={current.src}
                    alt="Trabalho StudioClownTattoo"
                    fill
                    sizes="(max-width: 768px) 100vw, 1200px"
                    className="object-cover"
                  />
                </motion.button>
              )}
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />

            <div className="absolute inset-y-0 left-0 flex items-center px-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="flex h-11 w-11 items-center justify-center border border-ink/15 bg-paper/70 backdrop-blur-sm transition-colors hover:bg-paper"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-3">
              <button
                type="button"
                onClick={() => go(1)}
                className="flex h-11 w-11 items-center justify-center border border-ink/15 bg-paper/70 backdrop-blur-sm transition-colors hover:bg-paper"
                aria-label="Próxima"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-sm text-mute">
            <span>
              {index + 1} de {items.length}
            </span>
            <div className="hidden gap-2 md:flex">
              {items.slice(0, 8).map((item, i) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 transition-all",
                    i === index ? "w-8 bg-ink" : "w-3 bg-ink/20",
                  )}
                  aria-label={`Ir para imagem ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {lightbox !== null && items[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-paper/95 p-4 backdrop-blur-md"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute right-6 top-6 text-ink"
              onClick={() => setLightbox(null)}
              aria-label="Fechar"
            >
              <X className="h-6 w-6" />
            </button>
            <div
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={items[lightbox].src}
                alt="Trabalho ampliado"
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
