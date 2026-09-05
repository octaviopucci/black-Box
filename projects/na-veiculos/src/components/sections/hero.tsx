"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { availableVehicles } from "@/data/vehicles";
import { asset } from "@/lib/assets";
import { scrollToHash } from "@/lib/whatsapp";

const featured = availableVehicles[0];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[max(100svh,680px)] flex-col justify-end kintaro-grid-bg"
    >
      {featured && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <Image
            src={asset(featured.image)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-paper/70 to-paper" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 md:pb-24 md:pt-40">
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

        <p className="hero-enter-item mt-8 max-w-xl text-base leading-relaxed text-mute md:text-lg [animation-delay:0.26s]">
          Seu sonho está aqui. Estoque real da loja em Capão Bonito, com preço
          no anúncio, foto do carro de verdade e negociação direta no WhatsApp —
          financiamento, cartão, troca ou consignação.
        </p>

        <div className="hero-enter-item mt-10 flex flex-wrap gap-3 [animation-delay:0.34s]">
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
    </section>
  );
}
