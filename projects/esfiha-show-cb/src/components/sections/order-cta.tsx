"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

export function OrderCta() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-brand py-20 md:py-28">
      <div className="grain absolute inset-0 opacity-30" aria-hidden />
      <motion.div
        className="relative mx-auto max-w-6xl px-6 text-center md:px-8"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="display text-[clamp(2.5rem,8vw,5rem)] uppercase leading-none text-paper">
          Hora de pedir
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-paper/90">
          Delivery oficial com cardápio completo. Retirada no balcão também
          disponível.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={site.links.delivery}
            target="_blank"
            rel="noopener noreferrer"
            className="display bg-ink px-10 py-4 text-xl uppercase tracking-wider text-paper transition-transform hover:scale-[1.02]"
          >
            {site.cta.primary}
          </a>
          <a
            href={site.phone.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="display border-2 border-paper/50 px-10 py-4 text-xl uppercase tracking-wider text-paper transition-colors hover:bg-paper/10"
          >
            {site.cta.secondary}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
