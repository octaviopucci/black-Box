"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { openWhatsApp, scrollToHash } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[max(100svh,720px)]">
      <div className="absolute inset-0">
        <Image
          src={site.assets.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/30 via-paper/70 to-paper" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <p className="hero-enter-item font-mono text-xs tracking-[0.3em] text-mute">
          //// {site.hero.eyebrow}
        </p>

        <h1 className="hero-enter-item mt-6 max-w-4xl font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[1.05] tracking-tight text-ink [animation-delay:0.1s]">
          {site.hero.title}
        </h1>

        <p className="hero-enter-item mt-8 max-w-2xl text-base leading-relaxed text-mute md:text-lg [animation-delay:0.18s]">
          {site.hero.subtitle}
        </p>

        <div className="hero-enter-item mt-10 flex flex-wrap gap-3 [animation-delay:0.26s]">
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              openWhatsApp("Olá André! Gostaria de solicitar um orçamento de tatuagem.")
            }
          >
            {site.hero.ctaQuote}
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => scrollToHash("#trabalhos")}
          >
            {site.hero.ctaWorks}
          </button>
        </div>

        <div className="hero-enter-item mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [animation-delay:0.34s]">
          {site.heroCards.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={() => scrollToHash("#trabalhos")}
              className="group overflow-hidden border border-line/80 bg-surface/80 text-left backdrop-blur-sm transition-colors hover:border-accent"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-display text-sm uppercase tracking-[0.15em] text-ink">
                  {card.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  ver mais
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
