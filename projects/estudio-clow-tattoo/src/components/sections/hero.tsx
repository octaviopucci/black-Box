"use client";

import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { SplitHeadline } from "@/components/artifacts/split-headline";
import { FilmStrip } from "@/components/artifacts/film-strip";
import { ParticleField } from "@/components/artifacts/particle-field";
import { DiagonalLines, ScrollIndicator } from "@/components/artifacts/kintaro-decor";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[max(100svh,680px)] items-end overflow-hidden bg-black"
    >
      <FilmStrip />

      <div className="absolute inset-0 bg-black/72" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

      <ParticleField />

      <DiagonalLines />
      <ScrollIndicator />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="max-w-4xl">
          <SplitHeadline
            lines={["Arte que fica", "marcada para sempre."]}
          />

          <div className="hero-enter-item mt-10 flex flex-wrap gap-3 [animation-delay:0.35s]">
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
      </div>
    </section>
  );
}
