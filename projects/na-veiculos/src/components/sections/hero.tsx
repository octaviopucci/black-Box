"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { HeroFilmRolls } from "@/components/hero/hero-film-rolls";
import { HeroSparkles } from "@/components/hero/hero-sparkles";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const leftRollRef = useRef<HTMLDivElement>(null);
  const rightRollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const leftRoll = leftRollRef.current;
    const rightRoll = rightRollRef.current;
    const content = contentRef.current;
    const overlay = overlayRef.current;
    if (!section || !pin || !leftRoll || !rightRoll || !content || !overlay) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=130%",
            pin: pin,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(leftRoll, { yPercent: 0 }, { yPercent: -38, ease: "none" }, 0);
        tl.fromTo(rightRoll, { yPercent: -18 }, { yPercent: 22, ease: "none" }, 0);
        tl.fromTo(content, { y: 0, opacity: 1 }, { y: -64, opacity: 0, ease: "none" }, 0);
        tl.fromTo(overlay, { opacity: 0.42 }, { opacity: 0.68, ease: "none" }, 0);
      }, section);

      return () => ctx.revert();
    });

    mm.add("(max-width: 767px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=90%",
            pin: pin,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(content, { y: 0, opacity: 1 }, { y: -40, opacity: 0, ease: "none" }, 0);
        tl.fromTo(overlay, { opacity: 0.48 }, { opacity: 0.62, ease: "none" }, 0);
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="inicio" ref={sectionRef} className="relative h-[200vh] md:h-[220vh]">
      <div ref={pinRef} className="relative h-[100dvh] min-h-[680px] overflow-hidden">
        <HeroFilmRolls ref={leftRollRef} side="left" />
        <HeroFilmRolls ref={rightRollRef} side="right" />

        <div className="absolute inset-0 z-[2] kintaro-grid-bg opacity-25" aria-hidden />

        <div
          ref={overlayRef}
          className="absolute inset-0 z-[2] bg-black/45"
          aria-hidden
        />

        <HeroSparkles />

        <div className="grain pointer-events-none absolute inset-0 z-[3] opacity-[0.18]" aria-hidden />

        <div className="vignette pointer-events-none absolute inset-0 z-[3]" aria-hidden />

        <div
          ref={contentRef}
          className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:pb-24 md:pt-40"
        >
          <p className="hero-enter-item font-mono text-xs tracking-[0.3em] text-mute">
            {"//// "}
            {site.city}
          </p>

          <h1 className="hero-enter-item mt-6 text-[clamp(3.5rem,12vw,9rem)] font-bold uppercase leading-[0.85] tracking-tighter text-ink [animation-delay:0.1s]">
            NA
            <br />
            Veículos
          </h1>

          <p className="hero-enter-item mt-2 font-mono text-sm uppercase tracking-[0.4em] text-accent [animation-delay:0.18s]">
            Novos e seminovos
          </p>

          <div className="hero-enter-item mt-10 flex flex-wrap gap-3 [animation-delay:0.26s]">
            <button
              type="button"
              className="btn-primary"
              onClick={() => scrollToHash("#orcamento")}
            >
              Quero comprar
            </button>
            <button
              type="button"
              className="btn-ghost"
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
