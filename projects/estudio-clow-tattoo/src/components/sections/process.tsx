"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Lightbulb, PenLine, SlidersHorizontal, Sparkles } from "lucide-react";
import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

const icons = [Lightbulb, PenLine, SlidersHorizontal, Sparkles];

export function Process() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);
  const lineScale = useTransform(scrollYProgress, [0.15, 0.85], [0, 1]);

  return (
    <section id="processo" ref={sectionRef} className="relative bg-surface py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline-x" />

      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeader index="04" label="Como funciona" title="Nosso processo" />
        </Reveal>

        <div className="relative mt-14">
          <div className="absolute bottom-0 left-6 top-0 hidden w-px overflow-hidden sm:left-1/2 sm:block">
            <motion.div
              style={reduceMotion ? undefined : { scaleY: lineScale }}
              className="h-full w-full origin-top bg-gradient-to-b from-line via-mute/40 to-line"
            />
            <motion.div
              style={reduceMotion ? undefined : { top: glowY }}
              className="absolute left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.22)_0%,transparent_70%)] blur-xl"
            />
          </div>

          <div className="space-y-12 sm:space-y-20">
            {site.process.map((step, index) => {
              const Icon = icons[index] ?? Sparkles;
              const isLeft = index % 2 === 0;

              return (
                <Reveal key={step.step} delay={index * 0.1}>
                  <div
                    className={`relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-12 ${
                      isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`flex-1 ${isLeft ? "sm:text-right" : "sm:text-left"}`}
                    >
                      <span className="font-mono text-xs tracking-[0.2em] text-ink/35">
                        {step.step}
                      </span>
                      <h3 className="mt-2 font-display text-2xl italic text-ink sm:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 inline-block max-w-sm font-light leading-relaxed text-mute">
                        {step.desc}
                      </p>
                    </div>

                    <motion.div
                      whileInView={
                        reduceMotion
                          ? undefined
                          : { scale: [0.92, 1], boxShadow: "0 0 0 rgba(255,255,255,0)" }
                      }
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6, delay: index * 0.08 }}
                      className="z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-surface shadow-[0_0_30px_rgba(255,255,255,0.06)] sm:flex"
                    >
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    </motion.div>

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
