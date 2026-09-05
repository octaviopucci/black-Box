"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { openWhatsApp } from "@/lib/whatsapp";
import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function About() {
  return (
    <section id="sobre" className="relative bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="001"
            label={site.about.label}
            title={site.about.headline}
          />
        </Reveal>

        <div className="mt-16 grid items-start gap-16 lg:grid-cols-[1fr_320px]">
          <Reveal className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-display text-sm uppercase tracking-[0.2em] text-accent">
                {site.about.title}
              </span>
              <span className="h-px flex-1 bg-line" />
            </div>

            {site.about.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="max-w-2xl text-base leading-relaxed text-mute"
              >
                {paragraph}
              </p>
            ))}

            <button
              type="button"
              className="btn-primary mt-4"
              onClick={() =>
                openWhatsApp("Olá André! Gostaria de solicitar um orçamento de tatuagem.")
              }
            >
              Fazer Orçamento
            </button>
          </Reveal>

          <Reveal delay={0.08} className="space-y-8">
            <div className="relative aspect-[3/4] overflow-hidden ring-1 ring-line/40">
              <Image
                src={site.assets.artist}
                alt={`${site.about.title} — tatuador em Sorocaba`}
                fill
                loading="lazy"
                sizes="320px"
                className="object-cover object-top"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-line/40 pt-8">
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
