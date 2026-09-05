"use client";

import { useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { asset } from "@/lib/assets";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function About() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader index="001" label="Sobre" title="" />
        </Reveal>

        <div className="mt-16 grid items-start gap-16 lg:grid-cols-[1fr_280px]">
          <Reveal className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                {site.name}
              </span>
              <span className="h-px flex-1 bg-line" />
              <span className="font-mono text-xs text-mute">Loja física</span>
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-mute md:text-lg">
              A NA Veículos fica na Rua Altino Arantes, 635, no Centro de Capão
              Bonito. Cada carro anunciado está na loja, com o valor no anúncio
              e as fotos da unidade — sem banco de imagem, sem “chama no privado
              pra saber o preço”.
            </p>

            {expanded && (
              <div className="max-w-2xl space-y-4 border-l border-line/60 pl-6">
                {site.truths.map((truth) => (
                  <div key={truth.title}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                      {truth.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-mute">{truth.text}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute transition-colors hover:text-ink"
            >
              {expanded ? "← Versão resumida" : "Como a NA trabalha →"}
            </button>
          </Reveal>

          <Reveal delay={0.08} className="space-y-8">
            <div className="relative flex aspect-[3/4] items-center justify-center px-4">
              <Image
                src={asset(site.assets.logo)}
                alt={`Logo ${site.name}`}
                width={280}
                height={90}
                loading="lazy"
                className="h-auto w-full max-w-[240px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-line/40 pt-8 lg:grid-cols-1">
              {site.stats.map((stat) => (
                <Counter key={stat.label} value={stat.value} label={stat.label} align="left" />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
