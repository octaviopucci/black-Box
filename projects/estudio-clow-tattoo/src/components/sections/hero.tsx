"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { SplitHeadline } from "@/components/artifacts/split-headline";

export function Hero() {
  return (
    <section
      id="inicio"
      className="grid min-h-[100svh] lg:grid-cols-[minmax(0,42%)_minmax(0,58%)]"
    >
      <div className="relative z-10 flex flex-col justify-end bg-paper px-6 pb-12 pt-28 lg:px-10 lg:py-16 xl:px-14">
        <p className="hero-enter-item editorial-label mb-6">{site.name} · São Paulo</p>

        <SplitHeadline
          lines={["Arte que fica", "marcada para sempre."]}
          italicFrom={1}
        />

        <p className="hero-enter-item mt-6 max-w-md text-sm leading-relaxed text-mute [animation-delay:0.2s]">
          Tatuagens exclusivas com técnica, personalidade e dedicação em cada detalhe.
        </p>

        <div className="hero-enter-item mt-10 flex flex-wrap gap-3 [animation-delay:0.35s]">
          <button type="button" className="btn-primary" onClick={() => scrollToHash("#orcamento")}>
            Solicitar orçamento
          </button>
          <button type="button" className="btn-ghost" onClick={() => scrollToHash("#trabalhos")}>
            Ver trabalhos
          </button>
        </div>
      </div>

      <div className="relative min-h-[52vh] lg:min-h-[100svh]">
        <div className="portfolio-frame absolute inset-0 lg:inset-y-8 lg:right-8 lg:left-0">
          <Image
            src={site.assets.hero}
            alt="Artista do StudioClownTattoo"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="portfolio-img"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent lg:hidden" />
      </div>
    </section>
  );
}
