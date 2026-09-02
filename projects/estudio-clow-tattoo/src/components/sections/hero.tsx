"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { SplitHeadline } from "@/components/artifacts/split-headline";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[max(100svh,620px)] items-end overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={site.assets.hero}
          alt="Artista do StudioClownTattoo"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="hero-photo scale-105"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/55 to-paper/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-paper/80 via-paper/25 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="max-w-3xl">
          <SplitHeadline
            lines={["Arte que fica", "marcada para sempre."]}
            italicFrom={1}
          />

          <div className="hero-enter-item mt-10 flex flex-wrap gap-3 [animation-delay:0.35s]">
            <button type="button" className="btn-primary" onClick={() => scrollToHash("#orcamento")}>
              Solicitar orçamento
            </button>
            <button type="button" className="btn-ghost" onClick={() => scrollToHash("#trabalhos")}>
              Ver trabalhos
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollToHash("#sobre")}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-mute md:flex"
        aria-label="Rolar para sobre"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
