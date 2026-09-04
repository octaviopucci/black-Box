"use client";

import { useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="001"
            label="Sobre"
            title="Sou um tatuador focado em transformar histórias em arte permanente — com técnica, higiene e atenção a cada detalhe."
          />
        </Reveal>

        <div className="mt-16 grid items-start gap-16 lg:grid-cols-[1fr_280px]">
          <Reveal className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                {site.name}
              </span>
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-xs text-mute">Artista</span>
            </div>

            <h3 className="text-2xl font-medium leading-snug text-ink md:text-3xl">
              Mais que uma tatuagem — uma identidade eterna na pele.
            </h3>

            <p className="max-w-2xl text-base leading-relaxed text-mute">
              O StudioClownTattoo nasceu da paixão por transformar ideias em arte
              permanente. Cada projeto é tratado como uma obra única, com os mais
              altos padrões de higiene e materiais 100% descartáveis.
            </p>

            {expanded && (
              <div className="max-w-2xl space-y-4 text-base leading-relaxed text-mute">
                <p>
                  Nosso diferencial está no atendimento personalizado: ouvimos sua
                  história, entendemos seu estilo e criamos um projeto exclusivo
                  que reflete a sua essência.
                </p>
                <p>
                  Com domínio em preto & cinza, realismo e colorido, cada tatuagem
                  recebe atenção total — desde o conceito até o último detalhe na
                  pele.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute transition-colors hover:text-ink"
            >
              {expanded ? "← Versão resumida" : "Ler versão completa →"}
            </button>
          </Reveal>

          <Reveal delay={0.08} className="space-y-8">
            <div className="relative aspect-[3/4] overflow-hidden ring-1 ring-line/40">
              <Image
                src={site.assets.artist}
                alt="Rafael Mactura — StudioClownTattoo"
                fill
                loading="lazy"
                sizes="280px"
                className="object-cover object-top"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-line/40 pt-8">
              {site.stats.slice(0, 2).map((stat) => (
                <Counter
                  key={stat.label}
                  value={stat.value}
                  suffix={"suffix" in stat ? stat.suffix : undefined}
                  label={stat.label}
                  align="left"
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
