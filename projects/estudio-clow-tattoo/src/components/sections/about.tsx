"use client";

import { site } from "@/data/site";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function About() {
  return (
    <section id="sobre" className="relative bg-paper py-20">
      <div className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 section-divider" />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeader
            label="Sobre o Studio"
            title="Mais que uma tatuagem, uma identidade."
          />
        </Reveal>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-2">
          <Reveal className="space-y-4">
            <p className="text-lg font-light leading-relaxed text-mute">
              O StudioClownTattoo nasceu da paixão por transformar ideias em arte
              permanente. Com anos de dedicação ao aprimoramento técnico e artístico,
              nosso estúdio se tornou referência em tatuagens de alta qualidade.
            </p>
            <p className="text-lg font-light leading-relaxed text-mute">
              Cada projeto é tratado como uma obra única. Trabalhamos com os mais
              altos padrões de higiene, utilizamos materiais 100% descartáveis, e
              seguimos rigorosos protocolos de biossegurança para garantir a
              segurança de cada cliente.
            </p>
            <p className="text-lg font-light leading-relaxed text-mute">
              Nosso diferencial está no atendimento personalizado: ouvimos sua
              história, entendemos seu estilo e criamos um projeto exclusivo que
              reflete a sua essência.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="grid grid-cols-2 gap-8">
            {site.stats.map((stat) => (
              <Counter
                key={stat.label}
                value={stat.value}
                suffix={"suffix" in stat ? stat.suffix : undefined}
                label={stat.label}
              />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
