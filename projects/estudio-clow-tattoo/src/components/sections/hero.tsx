"use client";

import { scrollToHash } from "@/lib/whatsapp";
import { useHeroScrub } from "@/lib/use-hero-scrub";
import { PhotoRoll } from "@/components/artifacts/photo-roll";
import { ParticleField } from "@/components/artifacts/particle-field";
import { DiagonalLines, ScrollIndicator } from "@/components/artifacts/kintaro-decor";

export function Hero() {
  const { sectionRef, progress } = useHeroScrub();

  const contentY = progress * 88;
  const contentOpacity = 1 - progress * 0.92;
  const overlayBoost = progress * 0.35;

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative h-[185svh] min-h-[920px]"
      style={{ ["--hero-p" as string]: progress }}
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[720px] items-end overflow-hidden bg-black">
        <PhotoRoll scrollProgress={progress} />

        <div className="absolute inset-0 z-[2] bg-black/28 md:bg-black/22" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-black/10 to-black/5" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
        <div
          className="absolute inset-0 z-[2] bg-black"
          style={{ opacity: overlayBoost * 0.55 }}
        />

        <ParticleField scrollProgress={progress} />

        <DiagonalLines
          className="z-[4] transition-opacity duration-300"
          style={{ opacity: 1 - progress * 0.8 }}
        />
        <ScrollIndicator
          className="z-[5] transition-opacity duration-300"
          style={{ opacity: 1 - progress * 1.2 }}
        />

        <div
          className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-28 will-change-transform md:pb-20 md:pt-36"
          style={{
            transform: `translate3d(0, ${contentY}px, 0)`,
            opacity: contentOpacity,
          }}
        >
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_min(42%,480px)]">
            <div className="max-w-2xl">
              <p className="hero-enter-item font-mono text-[10px] uppercase tracking-[0.42em] text-white/35">
                ////
              </p>

              <h1 className="hero-enter-item mt-5 text-[clamp(2.4rem,7.5vw,4.75rem)] font-bold uppercase leading-[0.9] tracking-tighter text-white [animation-delay:0.08s]">
                <span className="headline-line block overflow-hidden">
                  <span className="headline-line-inner inline-block">Studio Clown</span>
                </span>
                <span className="headline-line block overflow-hidden">
                  <span
                    className="headline-line-inner inline-block"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Tattoo
                  </span>
                </span>
              </h1>

              <p className="hero-enter-item mt-5 max-w-md text-sm leading-relaxed text-white/55 md:text-base [animation-delay:0.28s]">
                Arte que fica marcada para sempre.
              </p>

              <div className="hero-enter-item mt-9 flex flex-wrap gap-3 [animation-delay:0.38s]">
                <button
                  type="button"
                  className="btn-pill-primary"
                  onClick={() => scrollToHash("#orcamento")}
                >
                  Solicitar orçamento →
                </button>
                <button
                  type="button"
                  className="btn-pill-ghost"
                  onClick={() => scrollToHash("#trabalhos")}
                >
                  Ver trabalhos
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
