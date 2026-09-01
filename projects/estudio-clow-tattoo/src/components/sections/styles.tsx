"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";

export function Styles() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="estilos" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.4em] text-mute">
            Especialidades
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5vw,4.5rem)] italic leading-[1.02] text-ink">
            Estilos de tatuagem
          </h2>
        </Reveal>
      </div>

      <div className="mt-14 space-y-3">
        {site.styles.map((style, index) => (
          <Reveal key={style.title} delay={index * 0.06}>
            <article className="group relative min-h-[52vh] overflow-hidden md:min-h-[62vh]">
              <Image
                src={style.image}
                alt={style.title}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-paper/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent md:hidden" />

              <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 py-12 md:items-center md:py-0">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="max-w-xl"
                >
                  <p className="text-[11px] uppercase tracking-[0.36em] text-mute">
                    0{index + 1}
                  </p>
                  <h3 className="mt-4 font-display text-4xl italic text-ink md:text-5xl">
                    {style.title}
                  </h3>
                  <p className="mt-5 max-w-md text-base font-light leading-relaxed text-mute">
                    {style.desc}
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollToHash("#trabalhos")}
                    className="mt-8 text-[11px] uppercase tracking-[0.28em] text-ink underline-offset-4 hover:underline"
                  >
                    Ver trabalhos
                  </button>
                </motion.div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
