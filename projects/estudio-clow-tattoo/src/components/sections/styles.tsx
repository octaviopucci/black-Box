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
            index="003"
            align="center"
            label="Estilos"
            title="Estilos de tatuagem"
          />
        </Reveal>

        <div className="mt-16 space-y-0">
          {site.styles.map((style, index) => (
            <Reveal key={style.title} delay={index * 0.06}>
              <article className="group grid gap-8 border-t border-white/10 py-12 md:grid-cols-[72px_1fr_180px] md:items-start">
                <span className="font-mono text-4xl font-light leading-none text-white/15 md:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-ink md:text-2xl">
                    {style.title}
                  </h3>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                    {style.tagline}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-mute md:text-base">
                    {style.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToHash("#trabalhos")}
                    className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 transition-colors duration-300 hover:text-white"
                  >
                    Ver trabalhos →
                  </button>
                </div>

                <div className="relative hidden aspect-square overflow-hidden ring-1 ring-white/10 md:block">
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    loading="lazy"
                    sizes="180px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
