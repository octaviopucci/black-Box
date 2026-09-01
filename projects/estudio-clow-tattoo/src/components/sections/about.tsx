"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { InkFrame } from "@/components/artifacts/ink-frame";

export function About() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-paper py-24">
      <div className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 section-divider" />
      <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_68%)] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeader
            index="01"
            label="Sobre o Studio"
            title="Mais que uma tatuagem, uma identidade."
          />
        </Reveal>

        <div className="relative mt-16 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <Reveal className="relative z-10 space-y-5 pr-0 lg:pr-8">
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

          <Reveal delay={0.12} className="relative lg:-ml-12 lg:mt-8">
            <div className="relative aspect-[4/5] overflow-hidden bg-elevated">
              <Image
                src={site.assets.artist}
                alt="Ambiente do StudioClownTattoo"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover brightness-[0.72] contrast-[1.05]"
              />
              <div className="vignette absolute inset-0" />
              <InkFrame className="inset-4 sm:inset-6" />
            </div>

            <div className="glass-panel absolute -bottom-8 -right-2 z-20 w-[min(100%,340px)] p-6 sm:-right-6 sm:p-8 lg:-bottom-10">
              <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-mute">
                Números do atelier
              </p>
              <div className="grid grid-cols-2 gap-6">
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
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
