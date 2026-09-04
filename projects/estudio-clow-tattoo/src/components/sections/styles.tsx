"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Styles() {
  return (
    <section id="estilos" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="002"
            label="Estilos"
            title="Especialidades em tatuagem — do realismo ao colorido, cada estilo com técnica e identidade própria."
          />
        </Reveal>

        <div className="mt-16 space-y-12">
          {site.styles.map((style, index) => (
            <Reveal key={style.title} delay={index * 0.06}>
              <article className="group grid gap-8 border-t border-line/40 pt-12 md:grid-cols-[80px_1fr_200px] md:items-start">
                <span className="font-mono text-4xl font-light text-line md:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="text-xl font-medium uppercase tracking-wide text-ink md:text-2xl">
                    {style.title}
                  </h3>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    {style.tagline}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-mute">
                    {style.desc}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {site.artistTags.slice(index, index + 2).map((tag) => (
                      <span
                        key={tag}
                        className="border border-line/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-mute"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToHash("#trabalhos")}
                  className="portfolio-frame group relative hidden aspect-square md:block"
                >
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    loading="lazy"
                    sizes="200px"
                    className="portfolio-img"
                  />
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
