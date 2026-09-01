"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";

export function Artist() {
  return (
    <section className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[50vh] lg:min-h-[80vh]">
          <ParallaxImage
            src={site.assets.artist}
            alt="Artista do StudioClownTattoo"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-paper/10 lg:bg-transparent" />
        </div>

        <div className="flex items-center px-6 py-20 lg:px-16 lg:py-28">
          <div className="max-w-xl">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
                O Artista
              </p>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.8rem)] italic leading-[1.05] text-ink">
                Cada tatuagem carrega uma história.
              </h2>
            </Reveal>

            <Reveal delay={0.12} className="mt-8 space-y-5 text-lg font-light leading-relaxed text-mute">
              <p>
                Nosso trabalho vai além de tatuar. É sobre transformar sua história
                em arte. Com domínio em preto e cinza e trabalhos coloridos de alto
                nível, cada projeto recebe atenção total: desde o conceito até o
                último detalhe na pele.
              </p>
              <p>
                A criatividade é o ponto de partida, mas é a técnica refinada, a
                higiene impecável e o compromisso com a excelência que definem o
                StudioClownTattoo. Aqui, não copiamos. Criamos projetos exclusivos
                para cada cliente.
              </p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <Image
                src={site.assets.logo}
                alt={site.name}
                width={120}
                height={48}
                className="h-10 w-auto opacity-80"
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
