"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { TiltCard } from "@/components/artifacts/tilt-card";

const layoutClasses = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1 md:mt-16",
  "md:col-span-1 md:row-span-1 md:-mt-8",
];

export function Styles() {
  return (
    <section id="estilos" className="relative overflow-hidden bg-paper py-24">
      <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader index="03" label="Especialidades" title="Estilos de tatuagem" />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:grid-rows-2 md:gap-6">
          {site.styles.map((style, index) => (
            <Reveal
              key={style.title}
              delay={index * 0.1}
              className={layoutClasses[index] ?? ""}
            >
              <TiltCard className="h-full">
                <article className="group relative h-full cursor-pointer overflow-hidden border border-line/60 bg-elevated">
                  <div
                    className={`relative overflow-hidden ${index === 0 ? "aspect-[4/5] md:aspect-auto md:h-full md:min-h-[520px]" : "aspect-[3/4]"}`}
                  >
                    <Image
                      src={style.image}
                      alt={style.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />
                    <span className="absolute left-5 top-5 font-mono text-[10px] tracking-[0.25em] text-ink/50">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="glass-panel absolute inset-x-0 bottom-0 m-4 p-6 md:m-5">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-mute">
                      {style.tagline}
                    </p>
                    <h3 className="mb-3 font-display text-2xl italic text-ink md:text-3xl">
                      {style.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-mute/90">
                      {style.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => scrollToHash("#trabalhos")}
                      className="mt-5 border-b border-ink/30 pb-1 text-xs uppercase tracking-widest text-ink transition-colors hover:border-ink"
                    >
                      Ver trabalhos
                    </button>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
