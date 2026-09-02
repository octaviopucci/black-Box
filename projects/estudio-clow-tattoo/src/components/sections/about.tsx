"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function About() {
  return (
    <section id="sobre" className="bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeader
            index="01"
            label="Sobre o Studio"
            title="Mais que uma tatuagem, uma identidade."
          />
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
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
              Ouvimos sua história, entendemos seu estilo e criamos um projeto
              exclusivo que reflete a sua essência.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="portfolio-frame relative aspect-[3/4] max-h-[560px] w-full">
              <Image
                src={site.assets.artist}
                alt="Ambiente do StudioClownTattoo"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="portfolio-img"
              />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-8">
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
