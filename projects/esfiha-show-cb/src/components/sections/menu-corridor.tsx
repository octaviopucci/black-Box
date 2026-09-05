"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { menuCategories, formatPrice } from "@/data/menu";
import { site } from "@/data/site";

export function MenuCorridor() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;

    if (reduced || mobile) return;

    const ctx = gsap.context(() => {
      const scrollWidth = track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cardapio"
      className="relative overflow-hidden bg-show-green-dark py-16 md:py-0"
    >
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 md:px-8 md:pb-12 md:pt-16">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">
          Cardápio completo
        </p>
        <h2 className="display mt-2 text-4xl text-white md:text-5xl">
          {menuCategories.length} categorias · arraste no scroll
        </h2>
        <p className="mt-3 max-w-xl text-white/80">
          Preços do delivery oficial. Toque em Fazer pedido para montar com adicionais e combos.
        </p>
      </div>

      <div
        ref={trackRef}
        className="menu-scroll flex gap-5 px-4 pb-16 md:gap-6 md:px-8 md:pb-24"
      >
        {menuCategories.map((cat) => (
          <a
            key={cat.id}
            href={`#cat-${cat.id}`}
            className="group flex w-[280px] shrink-0 flex-col justify-between rounded-2xl bg-white p-6 shadow-xl transition-transform hover:-translate-y-1 md:w-[320px]"
          >
            <div>
              <p className="display text-3xl text-show-dark">{cat.name}</p>
              {cat.subtitle && (
                <p className="mt-2 text-sm text-show-muted">{cat.subtitle}</p>
              )}
            </div>
            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-show-muted">
                  {cat.items.length} itens
                </p>
                {cat.fromPrice && (
                  <p className="price mt-1 text-xl">
                    a partir de {formatPrice(cat.fromPrice)}
                  </p>
                )}
                {!cat.fromPrice && cat.items[0] && (
                  <p className="price mt-1 text-xl">
                    a partir de {formatPrice(cat.items[0].price)}
                  </p>
                )}
              </div>
              <span className="display rounded-full bg-show-green/15 px-3 py-1 text-sm text-show-green-dark group-hover:bg-show-green group-hover:text-white">
                Ver →
              </span>
            </div>
          </a>
        ))}

        <a
          href={site.links.delivery}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-[280px] shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/40 p-6 text-center md:w-[320px]"
        >
          <p className="display text-2xl text-white">Pedir agora</p>
          <p className="mt-2 text-sm text-white/70">Delivery com fotos e adicionais</p>
        </a>
      </div>
    </section>
  );
}
