"use client";

import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { PhotoRoll } from "@/components/artifacts/photo-roll";
import { ParticleField } from "@/components/artifacts/particle-field";
import { DiagonalLines, ScrollIndicator } from "@/components/artifacts/kintaro-decor";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[max(100svh,720px)] items-end overflow-hidden bg-black"
    >
      <PhotoRoll />

      <div className="absolute inset-0 z-[2] bg-black/28 md:bg-black/22" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-black/10 to-black/5" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/50 via-black/10 to-transparent" />

      <ParticleField />

      <DiagonalLines className="z-[4]" />
      <ScrollIndicator className="z-[5]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-28 md:pb-20 md:pt-36">
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
    </section>
  );
}
