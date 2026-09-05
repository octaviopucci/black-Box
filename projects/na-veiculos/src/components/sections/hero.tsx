"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";
import { availableVehicles } from "@/data/vehicles";
import { asset } from "@/lib/assets";
import { scrollToHash } from "@/lib/whatsapp";
import { HeroFilmRolls } from "@/components/hero/hero-film-rolls";
import { HeroStarlight } from "@/components/hero/hero-starlight";

gsap.registerPlugin(ScrollTrigger);

const backdropCars = availableVehicles.slice(0, 3);

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=120%",
          pin: pin,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(leftRoll, { yPercent: 0 }, { yPercent: -32, ease: "none" }, 0);
      tl.fromTo(rightRoll, { yPercent: -12 }, { yPercent: 18, ease: "none" }, 0);
      tl.fromTo(content, { y: 0, opacity: 1 }, { y: -56, opacity: 0, ease: "none" }, 0);
      tl.fromTo(overlay, { opacity: 0.32 }, { opacity: 0.52, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="inicio" ref={sectionRef} className="relative h-[200vh] md:h-[220vh]">
      <div ref={pinRef} className="relative h-[100dvh] min-h-[680px] overflow-hidden bg-paper">
        <HeroFilmRolls ref={leftRollRef} side="left" />
        <HeroFilmRolls ref={rightRollRef} side="right" />

        {/* Colagem central — garante fotos visíveis no mobile */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center gap-2 px-[18%] opacity-70 sm:gap-3 sm:px-[24%] sm:opacity-55 md:opacity-48">
          {backdropCars.map((car, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={car.id}
              src={asset(car.image)}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className={`hero-backdrop-photo ${i === 1 ? "hero-backdrop-photo--center" : ""}`}
            />
          ))}
        </div>

        <div
          ref={overlayRef}
          className="absolute inset-0 z-[2] bg-black/24"
          aria-hidden
        />

        <div className="absolute inset-0 z-[3] kintaro-grid-bg opacity-20" aria-hidden />

        <HeroStarlight />

        <div className="grain pointer-events-none absolute inset-0 z-[5] opacity-[0.07]" aria-hidden />

        <div className="vignette pointer-events-none absolute inset-0 z-[5] opacity-55" aria-hidden />

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
