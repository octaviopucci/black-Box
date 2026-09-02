"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = site.testimonials[index];

  const go = (direction: -1 | 1) => {
    setIndex(
      (prev) =>
        (prev + direction + site.testimonials.length) % site.testimonials.length,
    );
  };

  return (
    <section className="relative bg-surface py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            Depoimentos
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] italic leading-[1.02] text-ink">
            O que dizem nossos clientes
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-14">
          <Quote className="mx-auto mb-8 h-8 w-8 text-ink/20" />

          <div key={current.name} className="testimonial-slide">
            <p className="text-xl font-light leading-relaxed text-ink md:text-2xl">
              “{current.text}”
            </p>
            <p className="mt-8 text-sm uppercase tracking-[0.28em] text-mute">
              {current.name}
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center border border-ink/15 transition-colors hover:bg-ink hover:text-paper"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center border border-ink/15 transition-colors hover:bg-ink hover:text-paper"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
