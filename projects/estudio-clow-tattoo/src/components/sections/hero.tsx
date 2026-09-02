"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { InkFrame } from "@/components/artifacts/ink-frame";
import { SplitHeadline } from "@/components/artifacts/split-headline";
import { MagneticButton } from "@/components/artifacts/magnetic-button";

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={site.assets.hero}
          alt="Artista do StudioClownTattoo"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[center_15%] brightness-[0.55] contrast-[1.05]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/75 to-paper/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-paper/25" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <p
        aria-hidden
        className="pointer-events-none absolute -right-[8vw] top-[8vh] select-none font-display text-[clamp(6rem,22vw,18rem)] font-light leading-none tracking-tighter text-ink/[0.04]"
      >
        CLOW
      </p>

      <InkFrame />

      <div className="hero-enter relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <p className="hero-enter-item mb-8 max-w-md text-xs uppercase tracking-[0.45em] text-mute">
          {site.name} · São Paulo
        </p>

        <div className="max-w-4xl">
          <SplitHeadline
            lines={["Arte que fica", "marcada para sempre."]}
            italicFrom={1}
          />
        </div>

        <div className="hero-enter-item mt-12 flex flex-wrap gap-4 [animation-delay:0.45s]">
          <MagneticButton
            variant="solid"
            onClick={() => scrollToHash("#orcamento")}
          >
            Solicitar orçamento
          </MagneticButton>
          <MagneticButton
            variant="ghost"
            onClick={() => scrollToHash("#trabalhos")}
          >
            Ver trabalhos
          </MagneticButton>
        </div>

        <div className="hero-enter-line mt-16 h-px max-w-xs origin-left bg-gradient-to-r from-ink/50 to-transparent [animation-delay:0.55s]" />
      </div>

      <button
        type="button"
        onClick={() => scrollToHash("#sobre")}
        className="absolute bottom-10 right-6 z-10 hidden flex-col items-center gap-3 text-mute md:flex"
        aria-label="Rolar para sobre"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="block h-16 w-px bg-gradient-to-b from-transparent via-ink/50 to-transparent" />
      </button>
    </section>
  );
}
