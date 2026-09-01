"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { easeOut } from "@/lib/motion";
import { ParallaxImage } from "@/components/motion/parallax-image";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="inicio"
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden"
    >
      <ParallaxImage
        src={site.assets.hero}
        alt="Artista do StudioClownTattoo"
        priority
        className="absolute inset-0"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-paper/10 via-paper/70 to-paper" />
      <div className="grain pointer-events-none absolute inset-0 opacity-40" />

      <motion.div
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:pb-24"
      >
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.15 }}
          className="mb-6 text-[11px] uppercase tracking-[0.42em] text-mute"
        >
          {site.name}
        </motion.p>

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: easeOut, delay: 0.25 }}
          className="max-w-4xl font-display text-[clamp(3.2rem,11vw,7.5rem)] leading-[0.92] tracking-tight text-ink"
        >
          Arte que fica
          <span className="block italic font-light text-ink/90">
            marcada para sempre.
          </span>
        </motion.h1>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.45 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <button
            type="button"
            onClick={() => scrollToHash("#orcamento")}
            className="bg-ink px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-paper transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Solicitar orçamento
          </button>
          <button
            type="button"
            onClick={() => scrollToHash("#trabalhos")}
            className="border border-ink/25 px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ink transition-colors hover:border-ink hover:bg-ink/5"
          >
            Ver trabalhos
          </button>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToHash("#sobre")}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-mute transition-colors hover:text-ink"
        aria-label="Rolar para sobre"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.button>
    </section>
  );
}
