"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Styles() {
  return (
    <section id="estilos" className="bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader align="center" index="03" label="Especialidades" title="Estilos de tatuagem" />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {site.styles.map((style, index) => (
            <Reveal key={style.title} delay={index * 0.06}>
              <article className="group flex h-full flex-col border border-line/70 bg-surface">
                <div className="portfolio-frame relative aspect-[3/4] w-full">
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="portfolio-img"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="editorial-label mb-2">{style.tagline}</p>
                  <h3 className="font-display text-2xl text-ink">{style.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">{style.desc}</p>
                  <button
                    type="button"
                    onClick={() => scrollToHash("#trabalhos")}
                    className="mt-5 self-start text-xs uppercase tracking-widest text-accent-soft transition-colors hover:text-accent"
                  >
                    Ver trabalhos →
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
