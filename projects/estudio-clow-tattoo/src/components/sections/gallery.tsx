"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { site, type GalleryCategory } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const filters: { id: GalleryCategory; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "blackgrey", label: "Preto & Cinza" },
  { id: "colorido", label: "Colorido" },
];

export function Gallery() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items = useMemo(() => {
    if (filter === "all") return site.gallery;
    return site.gallery.filter((item) => item.category === filter);
  }, [filter]);

  const scrollBy = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
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

  useEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!section || !pin || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getScroll = () => Math.max(track.scrollWidth - window.innerWidth + 96, 0);

      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScroll() + window.innerHeight * 0.35}`,
          pin: pin,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [items, reduceMotion]);

  return (
    <section id="trabalhos" ref={sectionRef} className="relative bg-surface">
      <div ref={pinRef} className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.04),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
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
                    "px-5 py-2.5 text-xs uppercase tracking-widest transition-all duration-300",
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

          {/* Desktop: GSAP pinned corridor */}
          <div className="relative mt-10 hidden md:block">
            <div className="absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-surface to-transparent" />
            <div className="absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-surface to-transparent" />

            <div ref={trackRef} className="flex w-max gap-3 will-change-transform">
              {items.map((item, index) => (
                <motion.button
                  key={item.src}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.02 }}
                  onClick={() => openLightbox(index)}
                  className="group relative h-[min(62vh,520px)] w-[min(42vw,380px)] shrink-0 overflow-hidden bg-elevated"
                >
                  <Image
                    src={item.src}
                    alt={`Trabalho ${index + 1}`}
                    fill
                    sizes="380px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-paper/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 flex items-end justify-between p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="font-mono text-xs text-ink/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Search className="h-5 w-5 text-ink" strokeWidth={1.5} />
                  </div>
                </motion.button>
              ))}
            </div>

            <p className="mt-6 text-center text-[10px] uppercase tracking-[0.35em] text-mute/60">
              Scroll para percorrer o corredor
            </p>
          </div>

          {/* Mobile: horizontal strip */}
          <Reveal delay={0.12} className="group/row relative mt-8 md:hidden">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-paper/80 text-ink opacity-0 transition-opacity hover:bg-elevated group-hover/row:opacity-100"
              aria-label="Rolar para esquerda"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-paper/80 text-ink opacity-0 transition-opacity hover:bg-elevated group-hover/row:opacity-100"
              aria-label="Rolar para direita"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div
              ref={scrollRef}
              className="scrollbar-hide flex gap-2 overflow-x-auto scroll-smooth px-1"
            >
              {items.map((item, index) => (
                <motion.button
                  key={item.src}
                  type="button"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  onClick={() => openLightbox(index)}
                  className="group relative h-44 w-44 shrink-0 overflow-hidden bg-elevated sm:h-48 sm:w-48"
                >
                  <Image
                    src={item.src}
                    alt={`Trabalho ${index + 1}`}
                    fill
                    sizes="192px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/50">
                    <Search
                      className="h-7 w-7 text-ink opacity-0 transition-opacity group-hover:opacity-100"
                      strokeWidth={1.5}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </Reveal>

          <p className="mt-3 text-center text-xs text-mute/70 md:hidden">
            ← deslize para ver mais →
          </p>
          {lightboxIndex !== null && (
            <p className="mt-1 text-center text-xs text-mute/60">
              {lightboxIndex + 1} de {items.length}
            </p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && items[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-paper/95 p-4 backdrop-blur-md"
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
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
