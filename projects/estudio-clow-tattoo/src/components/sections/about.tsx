"use client";

import { site } from "@/data/site";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function About() {
  return (
    <section id="sobre" className="relative bg-paper py-20 md:py-24">
      <div className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 section-divider" />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeader
            align="center"
            label="Sobre o Studio"
            title="Mais que uma tatuagem, uma identidade."
          />
        </Reveal>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="space-y-5">
            <p className="text-base leading-relaxed text-mute md:text-lg">
              O StudioClownTattoo nasceu da paixão por transformar ideias em arte
              permanente. Com anos de dedicação ao aprimoramento técnico e artístico,
              nosso estúdio se tornou referência em tatuagens de alta qualidade.
            </p>
            <p className="text-base leading-relaxed text-mute md:text-lg">
              Cada projeto é tratado como uma obra única. Trabalhamos com os mais
              altos padrões de higiene, materiais 100% descartáveis e protocolos
              rigorosos de biossegurança.
            </p>
            <p className="text-base leading-relaxed text-mute md:text-lg">
              Nosso diferencial está no atendimento personalizado: ouvimos sua
              história, entendemos seu estilo e criamos um projeto exclusivo que
              reflete a sua essência.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid grid-cols-2 gap-8 border border-line/60 bg-surface p-8">
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
