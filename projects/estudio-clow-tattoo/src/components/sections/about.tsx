"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function About() {
  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="001"
            label="Sobre"
            title="Mais que uma tatuagem, uma identidade."
          />
        </Reveal>

        <div className="mt-16 grid items-start gap-14 lg:grid-cols-[1fr_320px] lg:gap-20">
          <Reveal className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                {site.name}
              </span>
              <span className="h-px flex-1 bg-white/15" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                Artista
              </span>
            </div>

            <div className="space-y-5 text-sm leading-relaxed text-mute md:text-base">
              <p>
                O StudioClownTattoo nasceu da paixão por transformar ideias em arte
                permanente. Com anos de dedicação ao aprimoramento técnico e artístico,
                nosso estúdio se tornou referência em tatuagens de alta qualidade.
              </p>
              <p>
                Cada projeto é tratado como uma obra única. Trabalhamos com os mais
                altos padrões de higiene, materiais 100% descartáveis e protocolos
                rigorosos de biossegurança.
              </p>
              <p>
                Nosso diferencial está no atendimento personalizado: ouvimos sua
                história, entendemos seu estilo e criamos um projeto exclusivo que
                reflete a sua essência.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="space-y-8">
            <div className="relative aspect-[3/4] overflow-hidden ring-1 ring-white/10">
              <Image
                src={site.assets.artist}
                alt="Rafael Mactura — Studio Clown Tattoo"
                fill
                loading="lazy"
                sizes="320px"
                className="object-cover object-top grayscale-[0.2]"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
              {site.stats.map((stat) => (
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
