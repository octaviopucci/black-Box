"use client";

import type { CSSProperties } from "react";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { HeroParticles } from "@/components/hero/hero-particles";
import { HeroPhotoRolls } from "@/components/hero/hero-photo-rolls";
import { useHeroScrollProgress, smoothstep } from "@/hooks/use-hero-scroll-progress";

function HeroDecorLeft({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`pointer-events-none absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1.5 md:left-8 lg:flex ${className}`}
      style={style}
      aria-hidden
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} className="block h-px w-8 origin-left rotate-[135deg] bg-white/25" />
      ))}
    </div>
  );
}

function HeroScrollHint({
  className = "",
  style,
  label = "Scroll",
}: {
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute right-3 top-1/2 z-[6] hidden -translate-y-1/2 flex-col items-center gap-3 md:right-5 lg:flex ${className}`}
      style={style}
      aria-hidden
    >
      <span className="block h-16 w-px bg-white/20" />
      <span
        className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/40"
        style={{ writingMode: "vertical-rl" }}
      >
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  const { sectionRef, progress } = useHeroScrollProgress();
  const p = smoothstep(progress);

  const contentY = 88 * p;
  const contentOpacity = 1 - 0.92 * p;
  const overlayDark = 0.35 * p;
  const overlayOpacity = 1 - 0.72 * p;
  const fadeStyle = { opacity: 1 - 0.85 * p };
  const scrollStyle = { opacity: Math.max(0, 1 - 1.15 * p) };

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative h-[185svh] min-h-[920px]"
      style={{ ["--hero-p" as string]: progress }}
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[720px] items-end overflow-hidden bg-black">
        <HeroPhotoRolls />

        <div
          className="absolute inset-0 z-[2] bg-black/28 md:bg-black/22"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-black/10 to-black/5"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />
        <div
          className="absolute inset-0 z-[2] bg-gradient-to-r from-black/50 via-black/10 to-transparent"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />
        <div className="absolute inset-0 z-[2] bg-black" style={{ opacity: overlayDark }} aria-hidden />

        <HeroParticles scrollProgress={progress} />

        <HeroDecorLeft className="transition-opacity duration-300" style={fadeStyle} />
        <HeroScrollHint label="Scroll" className="transition-opacity duration-300" style={scrollStyle} />

        <div
          className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-28 will-change-transform md:pb-20 md:pt-36"
          style={{ transform: `translate3d(0, ${contentY}px, 0)`, opacity: contentOpacity }}
        >
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_min(42%,480px)]">
            <div className="max-w-2xl">
              <p className="hero-enter-item font-mono text-[10px] uppercase tracking-[0.42em] text-white/35">
                {"//// "}
                {site.city}
              </p>

              <h1 className="hero-enter-item mt-5 text-[clamp(2.4rem,7.5vw,4.75rem)] font-bold uppercase leading-[0.9] tracking-tighter text-white [animation-delay:0.08s]">
                <span className="headline-line block overflow-hidden">
                  <span className="headline-line-inner inline-block">NA</span>
                </span>
                <span className="headline-line block overflow-hidden">
                  <span className="headline-line-inner inline-block" style={{ animationDelay: "0.2s" }}>
                    Veículos
                  </span>
                </span>
              </h1>

              <p className="hero-enter-item mt-5 max-w-md text-sm leading-relaxed text-white/55 md:text-base [animation-delay:0.28s]">
                O seu Sonho está Aqui!
              </p>

              <div className="hero-enter-item mt-9 flex flex-wrap gap-3 [animation-delay:0.38s]">
                <button
                  type="button"
                  className="btn-pill-primary"
                  onClick={() => scrollToHash("#orcamento")}
                >
                  Quero comprar →
                </button>
                <button
                  type="button"
                  className="btn-pill-ghost"
                  onClick={() => scrollToHash("#estoque")}
                >
                  Ver estoque
                </button>
              </div>
            </div>

            <div className="hidden lg:block" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
