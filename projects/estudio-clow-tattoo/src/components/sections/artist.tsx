"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";

export function Artist() {
  return (
    <section className="relative bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal className="relative">
            <div className="relative overflow-hidden">
              <Image
                src={site.assets.artist}
                alt="Artista do StudioClownTattoo"
                width={900}
                height={1100}
                className="h-auto w-full object-cover contrast-[1.05] brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paper/60 to-transparent" />
            </div>
            <div className="absolute -left-4 -top-4 h-24 w-24 border-l border-t border-line" />
            <div className="absolute -bottom-4 -right-4 h-24 w-24 border-b border-r border-line" />
          </Reveal>

          <Reveal delay={0.15} className="space-y-4">
            <span className="text-xs uppercase tracking-[0.4em] text-mute">
              O Artista
            </span>
            <h2 className="font-display text-4xl font-light italic leading-tight text-ink sm:text-5xl">
              Cada tatuagem carrega uma história.
            </h2>
            <div className="h-px w-16 bg-line" />
            <p className="text-lg font-light leading-relaxed text-mute">
              Nosso trabalho vai além de tatuar. É sobre transformar sua história
              em arte. Com domínio em preto e cinza e trabalhos coloridos de alto
              nível, cada projeto recebe atenção total: desde o conceito até o
              último detalhe na pele.
            </p>
            <p className="text-lg font-light leading-relaxed text-mute">
              A criatividade é o ponto de partida, mas é a técnica refinada, a
              higiene impecável e o compromisso com a excelência que definem o
              StudioClownTattoo. Aqui, não copiamos. Criamos projetos exclusivos
              para cada cliente.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              {site.artistTags.map((tag) => (
                <span
                  key={tag}
                  className="border border-line px-4 py-2 text-xs uppercase tracking-widest text-mute"
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
