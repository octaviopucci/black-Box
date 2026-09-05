"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { HeroFilmGrid } from "@/components/hero/hero-film-grid";
import { HeroStarlight } from "@/components/hero/hero-starlight";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const grid = gridRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    if (!section || !pin || !grid || !content || !overlay) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=140%",
          pin: pin,
          scrub: 1.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(grid, { scale: 1, y: 0 }, { scale: 1.06, y: -24, ease: "none" }, 0);
      tl.fromTo(content, { y: 0, opacity: 1 }, { y: -72, opacity: 0, ease: "none" }, 0);
      tl.fromTo(overlay, { opacity: 0.48 }, { opacity: 0.68, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" ref={sectionRef} className="relative h-[210vh] md:h-[230vh]">
      <div ref={pinRef} className="relative h-[100dvh] min-h-[680px] overflow-hidden bg-paper">
        <div ref={gridRef} className="absolute inset-0">
          <HeroFilmGrid />
        </div>

        <div
          ref={overlayRef}
          className="hero-overlay absolute inset-0 z-[2]"
          aria-hidden
        />

        <div className="absolute inset-0 z-[3] kintaro-grid-bg opacity-[0.14]" aria-hidden />

        <HeroStarlight />

        <div className="grain pointer-events-none absolute inset-0 z-[5] opacity-[0.06]" aria-hidden />

        <div className="vignette pointer-events-none absolute inset-0 z-[5] opacity-70" aria-hidden />

        <div
          ref={contentRef}
          className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-6 pb-24 pt-28 md:justify-end md:pb-24 md:pt-40"
        >
          <p className="hero-enter-item font-mono text-xs tracking-[0.3em] text-mute">
            {"//// "}
            {site.city}
          </p>

          <h1 className="hero-enter-item mt-6 max-w-4xl text-[clamp(2.75rem,11vw,7.5rem)] font-bold uppercase leading-[0.88] tracking-tighter text-ink [animation-delay:0.1s]">
            Seu carro
            <br />
            está aqui
          </h1>

          <p className="hero-enter-item mt-6 max-w-md text-base leading-relaxed text-mute md:text-lg [animation-delay:0.18s]">
            Novos e seminovos com preço no anúncio, foto real e atendimento direto
            no WhatsApp.
          </p>

          <div className="hero-enter-item mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap [animation-delay:0.26s]">
            <button
              type="button"
              className="btn-primary w-full sm:w-auto"
              onClick={() => scrollToHash("#orcamento")}
            >
              Quero comprar
            </button>
            <button
              type="button"
              className="btn-ghost w-full sm:w-auto"
              onClick={() => scrollToHash("#estoque")}
            >
              Ver estoque
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollToHash("#sobre")}
          className="relative z-10 mx-auto mb-8 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-mute"
          aria-label="Rolar para sobre"
        >
          Scroll
          <span className="block h-8 w-px bg-line" />
        </button>
      </div>
    </section>
  );
}
