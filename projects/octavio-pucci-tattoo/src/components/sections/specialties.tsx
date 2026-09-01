"use client";

import { motion, useReducedMotion } from "framer-motion";
import { specialties } from "@/data/site";

export function Specialties() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="especialidades" className="border-t border-[var(--ink-border)] bg-[var(--paper)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.35em] text-[var(--accent)] uppercase">
            Especialidades
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] text-[var(--ink)] uppercase">
            Realismo, cobertura e projetos autorais
          </h2>
        </motion.div>

        <ul className="mt-16 grid gap-px bg-[var(--ink-border)] md:grid-cols-2">
          {specialties.map((item, index) => (
            <motion.li
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="bg-[var(--paper)] p-8 md:p-12"
            >
              <span className="font-display text-5xl leading-none text-[var(--accent)]/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-4 text-2xl tracking-wide text-[var(--ink)] uppercase">
                {item.title}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--mute)]">
                {item.description}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
