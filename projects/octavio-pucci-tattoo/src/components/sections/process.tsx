"use client";

import { motion, useReducedMotion } from "framer-motion";
import { processSteps } from "@/data/site";

export function Process() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="processo" className="border-t border-[var(--ink-border)] bg-[var(--paper)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.35em] text-[var(--accent)] uppercase">
            Processo
          </p>
          <h2 className="font-display mt-4 max-w-xl text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] text-[var(--ink)] uppercase">
            Do projeto à pele
          </h2>
        </motion.div>

        <ol className="mt-16 space-y-0">
          {processSteps.map((step, index) => (
            <motion.li
              key={step.step}
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="grid grid-cols-[4rem_1fr] gap-6 border-t border-[var(--ink-border)] py-8 md:grid-cols-[6rem_1fr] md:gap-12 md:py-10"
            >
              <span className="font-display text-3xl text-[var(--accent)] md:text-4xl">
                {step.step}
              </span>
              <div>
                <h3 className="font-display text-xl tracking-wide text-[var(--ink)] uppercase md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--mute)]">
                  {step.text}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
