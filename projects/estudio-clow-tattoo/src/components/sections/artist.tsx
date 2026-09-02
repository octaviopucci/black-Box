"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";

export function Artist() {
  return (
    <section className="bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="portfolio-frame relative aspect-[3/4] max-h-[620px] w-full">
              <Image
                src={site.assets.artist}
                alt="Artista do StudioClownTattoo"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 480px"
                className="portfolio-img"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="space-y-5">
            <p className="editorial-label">O Artista</p>
            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-ink">
              Cada tatuagem carrega uma história.
            </h2>
            <div className="h-px w-14 bg-accent" />
            <p className="text-base leading-relaxed text-mute md:text-lg">
              Nosso trabalho vai além de tatuar. É sobre transformar sua história
              em arte — do conceito ao último detalhe na pele.
            </p>
            <p className="text-base leading-relaxed text-mute md:text-lg">
              Domínio em preto e cinza e colorido de alto nível, com higiene
              impecável e projetos exclusivos para cada cliente.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {site.artistTags.map((tag) => (
                <span
                  key={tag}
                  className="border border-line px-3 py-1.5 text-[11px] uppercase tracking-widest text-mute"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
