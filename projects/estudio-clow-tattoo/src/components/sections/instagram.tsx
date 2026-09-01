"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";

export function InstagramSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            {site.instagram.handle}
          </p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4vw,3.5rem)] italic leading-[1.05] text-ink">
            Siga nosso trabalho em {site.instagram.handle}
          </h2>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-ink transition-opacity hover:opacity-70"
          >
            Ver Instagram
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-[4/5] overflow-hidden md:aspect-[5/4]"
          >
            <Image
              src={site.assets.instagram}
              alt="Instagram StudioClownTattoo"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-paper/0 transition-colors duration-500 group-hover:bg-paper/10" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
