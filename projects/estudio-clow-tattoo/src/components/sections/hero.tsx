"use client";

import { site } from "@/data/site";
import { openWhatsApp, scrollToHash } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[max(100svh,680px)] flex-col justify-end kintaro-grid-bg"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-paper/50 to-paper" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <p className="hero-enter-item font-mono text-xs tracking-[0.3em] text-mute">
          //// São Paulo, SP
        </p>

        <h1 className="hero-enter-item mt-6 text-[clamp(3.5rem,12vw,9rem)] font-bold uppercase leading-[0.85] tracking-tighter text-ink [animation-delay:0.1s]">
          Studio
          <br />
          Clown
        </h1>

        <p className="hero-enter-item mt-2 font-mono text-sm uppercase tracking-[0.4em] text-accent [animation-delay:0.18s]">
          Tattoo
        </p>

        <p className="hero-enter-item mt-8 max-w-xl text-base leading-relaxed text-mute md:text-lg [animation-delay:0.26s]">
          Tatuagens exclusivas com técnica, personalidade e dedicação em cada
          detalhe. Realismo, preto & cinza e colorido — cada projeto é uma obra
          única.
        </p>

        <div className="hero-enter-item mt-10 flex flex-wrap gap-3 [animation-delay:0.34s]">
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              openWhatsApp("Olá! Gostaria de solicitar um orçamento de tatuagem.")
            }
          >
            Falar comigo
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => scrollToHash("#trabalhos")}
          >
            Ver trabalhos
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
    </section>
  );
}
