"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";

export function Artist() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="relative">
            <div className="relative overflow-hidden ring-1 ring-white/10">
              <Image
                src={site.assets.hero}
                alt="Artista do StudioClownTattoo"
                width={900}
                height={1100}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 480px"
                className="h-auto w-full object-cover contrast-[1.05] brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paper/60 to-transparent" />
            </div>
            <div className="absolute -left-4 -top-4 h-24 w-24 border-l border-t border-white/15" />
            <div className="absolute -bottom-4 -right-4 h-24 w-24 border-b border-r border-white/15" />
          </Reveal>

          <Reveal delay={0.08} className="space-y-5">
            <p className="editorial-label">O Artista</p>
            <h2 className="text-3xl font-bold uppercase leading-tight tracking-tight text-ink sm:text-4xl">
              Cada tatuagem carrega uma história.
            </h2>
            <div className="h-px w-14 bg-white/20" />
            <p className="text-base leading-relaxed text-mute md:text-lg">
              Nosso trabalho vai além de tatuar — é sobre transformar sua história
              em arte. Com domínio em preto e cinza e trabalhos coloridos de alto
              nível, cada projeto recebe atenção total: desde o conceito até o
              último detalhe na pele.
            </p>
            <p className="text-base leading-relaxed text-mute md:text-lg">
              A criatividade é o ponto de partida, mas é a técnica refinada, a
              higiene impecável e o compromisso com a excelência que definem o
              StudioClownTattoo. Aqui, não copiamos. Criamos projetos exclusivos
              para cada cliente.
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
