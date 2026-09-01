"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lightbulb, PenLine, SlidersHorizontal, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

const icons = [Lightbulb, PenLine, SlidersHorizontal, Sparkles];

export function Process() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="processo" className="relative bg-surface py-20">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeader label="Como funciona" title="Nosso processo" />
        </Reveal>

        <div className="relative mt-10">
          <motion.div
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="absolute bottom-0 left-6 top-0 hidden w-px origin-top bg-gradient-to-b from-line via-mute to-line sm:left-1/2 sm:block"
          />

          <div className="space-y-10 sm:space-y-16">
            {site.process.map((step, index) => {
              const Icon = icons[index] ?? Sparkles;
              const isLeft = index % 2 === 0;

              return (
                <Reveal key={step.step} delay={index * 0.12}>
                  <div
                    className={`relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-12 ${
                      isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`flex-1 ${isLeft ? "sm:text-right" : "sm:text-left"}`}
                    >
                      <span className="font-display text-6xl font-light text-elevated">
                        {step.step}
                      </span>
                      <h3 className="-mt-4 font-display text-2xl italic text-ink">
                        {step.title}
                      </h3>
                      <p className="mt-3 inline-block max-w-sm font-light leading-relaxed text-mute">
                        {step.desc}
                      </p>
                    </div>

                    <div className="z-10 hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface sm:flex">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    </div>

                    <div className="hidden flex-1 sm:block" />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
