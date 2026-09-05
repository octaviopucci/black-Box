"use client";

import Image from "next/image";
import { site } from "@/data/site";
import { asset } from "@/lib/assets";
import { scrollToHash } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function HowToBuy() {
  return (
    <section id="como-comprar" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="002"
            label="Como comprar"
            title="Quatro jeitos de levar o carro — financiamento, cartão, troca ou consignação. A gente fecha olhando o seu caso."
          />
        </Reveal>

        <div className="mt-16 space-y-12">
          {site.services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <article className="group grid gap-8 border-t border-line/40 pt-12 md:grid-cols-[80px_1fr_200px] md:items-start">
                <span className="font-mono text-4xl font-light text-line md:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="text-xl font-medium uppercase tracking-wide text-ink md:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                    {service.tagline}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-mute">
                    {service.desc}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
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
                  onClick={() => scrollToHash("#orcamento")}
                  className="portfolio-frame group relative hidden aspect-square md:block"
                  aria-label={`${service.title} — quero comprar`}
                >
                  <Image
                    src={asset(service.image)}
                    alt=""
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
