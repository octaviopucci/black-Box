"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { site } from "@/data/site";
import { easePremium } from "@/lib/motion";

export function Experience() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const line1 = useTransform(scrollYProgress, [0.1, 0.35], [48, 0]);
  const line2 = useTransform(scrollYProgress, [0.2, 0.45], [64, 0]);
  const line3 = useTransform(scrollYProgress, [0.3, 0.55], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  const transforms = [line1, line2, line3];

  return (
    <section
      id="experiencia"
      ref={ref}
      className="relative overflow-hidden px-6 py-28 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-champagne/20 to-transparent" />

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="mb-8 text-[10px] uppercase tracking-[0.22em] text-mute">
          {site.experience.title}
        </p>

        <div className="space-y-2 md:space-y-4">
          {site.experience.lines.map((line, i) => (
            <motion.p
              key={line}
              style={
                reduceMotion
                  ? undefined
                  : {
                      y: transforms[i],
                      opacity,
                    }
              }
              className="font-display text-[clamp(2rem,6vw,4.5rem)] font-light leading-[1.05] tracking-tight text-ink"
            >
              {i === 2 ? (
                <span className="italic text-accent">{line}</span>
              ) : (
                line
              )}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
