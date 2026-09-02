"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";

export function InstagramSection() {
  return (
    <section className="bg-surface py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
        <Reveal>
          <p className="editorial-label">{site.instagram.handle}</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-ink">
            Acompanhe os bastidores e lançamentos no Instagram
          </h2>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-accent-soft transition-colors hover:text-accent"
          >
            Ver perfil
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>

        <Reveal delay={0.08}>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-frame relative block aspect-[3/4] max-h-[520px] w-full max-w-md lg:ml-auto"
          >
            <Image
              src={site.assets.instagram}
              alt="Instagram StudioClownTattoo"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 420px"
              className="portfolio-img"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
