"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { site } from "@/data/site";
import { scrollToHash } from "@/lib/whatsapp";
import { easeOut } from "@/lib/motion";
import { InkFrame } from "@/components/artifacts/ink-frame";
import { SplitHeadline } from "@/components/artifacts/split-headline";
import { MagneticButton } from "@/components/artifacts/magnetic-button";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden"
    >
      <motion.div
        style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}
        className="absolute inset-0 origin-center"
      >
        <Image
          src={site.assets.hero}
          alt="Artista do StudioClownTattoo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_15%] brightness-[0.55] contrast-[1.08] saturate-[0.92]"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/75 to-paper/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-paper/30" />
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="grain pointer-events-none absolute inset-0 opacity-35" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.035]" />

      <motion.p
        aria-hidden
        style={reduceMotion ? undefined : { x: watermarkX }}
        className="pointer-events-none absolute -right-[8vw] top-[8vh] select-none font-display text-[clamp(6rem,22vw,18rem)] font-light leading-none tracking-tighter text-ink/[0.04]"
      >
        CLOW
      </motion.p>

      <InkFrame />

      <motion.div
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-32 md:pb-24 md:pt-40"
      >
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 0.15 }}
          className="mb-8 max-w-md text-xs uppercase tracking-[0.45em] text-mute"
        >
          {site.name} · São Paulo
        </motion.p>

        <div className="max-w-4xl">
          <SplitHeadline
            lines={["Arte que fica", "marcada para sempre."]}
            italicFrom={1}
          />
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 1 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <MagneticButton
            variant="solid"
            onClick={() => scrollToHash("#orcamento")}
          >
            Solicitar orçamento
          </MagneticButton>
          <MagneticButton
            variant="ghost"
            onClick={() => scrollToHash("#trabalhos")}
          >
            Ver trabalhos
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: easeOut, delay: 1.2 }}
          className="mt-16 h-px max-w-xs origin-left bg-gradient-to-r from-ink/50 to-transparent"
        />
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToHash("#sobre")}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 right-6 z-10 hidden flex-col items-center gap-3 text-mute md:flex"
        aria-label="Rolar para sobre"
      >
        <span className="text-[10px] uppercase tracking-[0.35em] [writing-mode:vertical-rl]">
          Scroll
        </span>
        <motion.span
          animate={reduceMotion ? undefined : { scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="block h-16 w-px origin-top bg-gradient-to-b from-transparent via-ink/70 to-transparent"
        />
      </motion.button>
    </section>
  );
}
