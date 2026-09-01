"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";

export function Process() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.7", "end 0.35"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="processo" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            Como funciona
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] italic leading-[1.02] text-ink">
            Nosso processo
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-16 md:mt-20">
          <div className="absolute bottom-0 left-[11px] top-0 hidden w-px bg-ink/10 md:block">
            <motion.div
              style={reduceMotion ? undefined : { scaleY: lineScale }}
              className="h-full w-full origin-top bg-ink"
            />
          </div>

          <div className="space-y-12 md:space-y-16">
            {site.process.map((step, index) => (
              <Reveal key={step.step} delay={index * 0.08}>
                <div className="grid gap-6 md:grid-cols-[120px_1fr] md:gap-10">
                  <div className="flex items-start gap-4 md:block">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink bg-paper md:mx-auto">
                      <span className="h-2 w-2 rounded-full bg-ink" />
                    </div>
                    <p className="font-display text-3xl italic text-ink/30 md:mt-6 md:text-center">
                      {step.step}
                    </p>
                  </div>
                  <div className="border-t border-ink/10 pt-6 md:pt-2">
                    <h3 className="font-display text-3xl italic text-ink md:text-4xl">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-lg font-light leading-relaxed text-mute">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
