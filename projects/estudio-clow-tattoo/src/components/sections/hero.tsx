"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { easeOut } from "@/lib/motion";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen min-h-[620px] items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={site.assets.hero}
          alt="Artista do StudioClownTattoo"
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover object-top brightness-[0.65] contrast-[1.05]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-paper/40 via-transparent to-paper/20" />
      <div className="grain pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeOut, delay: 0.3 }}
        >
          <h1 className="font-display text-5xl font-light leading-none tracking-tight text-ink sm:text-6xl md:text-7xl lg:text-8xl">
            Arte que fica
            <br />
            <span className="italic font-light">marcada para sempre.</span>
          </h1>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 1.1 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            onClick={() => scrollToHash("#orcamento")}
            className="bg-accent px-10 py-4 text-sm font-semibold uppercase tracking-widest text-paper transition-colors hover:bg-accent/90"
          >
            Solicitar orçamento
          </button>
          <button
            type="button"
            onClick={() => scrollToHash("#trabalhos")}
            className="border border-ink/30 px-10 py-4 text-sm font-light uppercase tracking-widest text-ink transition-all hover:border-ink hover:bg-ink/5"
          >
            Ver trabalhos
          </button>
        </motion.div>
      </div>

      <motion.button
        type="button"
        onClick={() => scrollToHash("#sobre")}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-mute transition-colors hover:text-ink"
        aria-label="Rolar para sobre"
      >
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-7 w-7" strokeWidth={1} />
        </motion.div>
      </motion.button>
    </section>
  );
}
