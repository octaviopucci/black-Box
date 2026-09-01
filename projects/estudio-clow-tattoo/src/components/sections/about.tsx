"use client";

import { site } from "@/data/site";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";

export function About() {
  return (
    <section id="sobre" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            Sobre o Studio
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] italic leading-[1.02] text-ink">
            Mais que uma tatuagem, uma identidade.
          </h2>
        </Reveal>

        <div className="mt-16 grid items-start gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal className="space-y-6 text-lg font-light leading-relaxed text-mute">
            <p>
              O StudioClownTattoo nasceu da paixão por transformar ideias em arte
              permanente. Com anos de dedicação ao aprimoramento técnico e artístico,
              nosso estúdio se tornou referência em tatuagens de alta qualidade.
            </p>
            <p>
              Cada projeto é tratado como uma obra única. Trabalhamos com os mais
              altos padrões de higiene, utilizamos materiais 100% descartáveis, e
              seguimos rigorosos protocolos de biossegurança para garantir a
              segurança de cada cliente.
            </p>
            <p>
              Nosso diferencial está no atendimento personalizado: ouvimos sua
              história, entendemos seu estilo e criamos um projeto exclusivo que
              reflete a sua essência.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="grid grid-cols-2 gap-x-8 gap-y-10">
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
