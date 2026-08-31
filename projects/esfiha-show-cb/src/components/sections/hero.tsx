"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { site, media } from "@/data/site";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 120]);
  const contentY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 40]);

  const words = ["Esfiha", "Show"];

  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY }}
        aria-hidden
      >
        <Image
          src={media.hero}
          alt=""
          fill
          priority
          className="object-cover object-center scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="grain absolute inset-0" />
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-32 md:px-8 md:pb-24"
      >
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-glow">
          {site.unit} · {site.hours.display}
        </p>

        <h1 className="display text-[clamp(4.5rem,18vw,11rem)] uppercase text-paper">
          {words.map((word, i) => (
            <motion.span
              key={word}
              className="block"
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-md text-lg text-paper/85 md:text-xl"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {site.tagline}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <a
            href={site.links.delivery}
            target="_blank"
            rel="noopener noreferrer"
            className="display bg-brand px-8 py-3.5 text-lg uppercase tracking-wider text-paper transition-transform hover:scale-[1.02]"
          >
            {site.cta.primary}
          </a>
          <a
            href={site.phone.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="display border border-paper/40 px-8 py-3.5 text-lg uppercase tracking-wider text-paper transition-colors hover:border-paper hover:bg-paper/10"
          >
            {site.cta.secondary}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
