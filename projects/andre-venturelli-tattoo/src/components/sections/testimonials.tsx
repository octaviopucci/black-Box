"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useLocale } from "@/i18n/locale-provider";
import { useSite } from "@/i18n/use-site";
import { Reveal } from "@/components/motion/reveal";

function Stars() {
  return (
    <div className="flex justify-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
      ))}
    </div>
  );
}

export function Testimonials() {
  const { t } = useLocale();
  const siteData = useSite();
  const [index, setIndex] = useState(0);
  const current = siteData.testimonials[index];

  const go = (direction: -1 | 1) => {
    setIndex(
      (prev) =>
        (prev + direction + siteData.testimonials.length) % siteData.testimonials.length,
    );
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % siteData.testimonials.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [siteData.testimonials.length]);

  if (!current) return null;

  return (
    <section className="relative bg-surface py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            {t.testimonialsSection.label}
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] italic leading-[1.02] text-ink">
            {t.testimonialsSection.title}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-14">
          <Quote className="mx-auto mb-6 h-8 w-8 text-ink/20" />

          <div key={current.name} className="testimonial-slide">
            <Stars />
            <p className="mt-6 text-xl font-light leading-relaxed text-ink md:text-2xl">
              “{current.text}”
            </p>
            <p className="mt-8 text-sm uppercase tracking-[0.28em] text-ink">
              {current.name}
            </p>
            <p className="mt-2 text-xs uppercase tracking-widest text-mute">
              {current.style}
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-10 w-10 items-center justify-center border border-ink/15 transition-colors hover:bg-ink hover:text-paper"
              aria-label={t.testimonialsSection.prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-10 w-10 items-center justify-center border border-ink/15 transition-colors hover:bg-ink hover:text-paper"
              aria-label={t.testimonialsSection.next}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
