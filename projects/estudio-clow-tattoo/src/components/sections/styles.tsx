"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Styles() {
  return (
    <section id="estilos" className="relative bg-paper py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader label="Especialidades" title="Estilos de tatuagem" />
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {site.styles.map((style, index) => (
            <Reveal key={style.title} delay={index * 0.12}>
              <article className="group relative cursor-pointer overflow-hidden bg-elevated">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-elevated via-elevated/30 to-transparent" />
                </div>

                <div className="relative z-10 -mt-20 p-8">
                  <p className="mb-2 text-xs uppercase tracking-[0.3em] text-mute">
                    {style.tagline}
                  </p>
                  <h3 className="mb-4 font-display text-3xl italic text-ink">
                    {style.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-mute">
                    {style.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToHash("#trabalhos")}
                    className="mt-6 border-b border-ink/30 pb-1 text-sm uppercase tracking-widest text-ink transition-colors hover:border-ink"
                  >
                    Ver trabalhos
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
