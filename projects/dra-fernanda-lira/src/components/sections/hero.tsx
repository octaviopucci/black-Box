"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { site } from "@/data/site";
import { scrollToHash, whatsappUrl } from "@/lib/whatsapp";
import { easePremium } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="text-current"
    >
      <path
        d="M2 12L12 2M12 2H5M12 2V9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden"
    >
      <div className="absolute inset-0 glow-orb opacity-80" />
      <motion.div
        style={reduceMotion ? undefined : { scale: orbScale }}
        className="pointer-events-none absolute -right-[20%] top-[10%] h-[70vmin] w-[70vmin] rounded-full bg-gradient-to-br from-champagne/70 via-accent-soft/30 to-transparent blur-3xl"
      />
      <motion.div
        style={reduceMotion ? undefined : { scale: orbScale }}
        className="pointer-events-none absolute -left-[15%] bottom-[5%] h-[50vmin] w-[50vmin] rounded-full bg-gradient-to-tr from-surface to-transparent blur-3xl"
      />
      <div className="grain pointer-events-none fixed inset-0 z-50 opacity-[0.03]" />

      <motion.div
        style={reduceMotion ? undefined : { y: contentY }}
        className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-end px-6 pb-20 pt-36 md:grid md:grid-cols-12 md:items-end md:gap-8 md:pb-28 md:pt-40"
      >
        <div className="md:col-span-7">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easePremium, delay: 0.1 }}
            className="mb-6 inline-flex rounded-full bg-ink/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-mute"
          >
            {site.hero.eyebrow}
          </motion.p>

          <h1 className="font-display text-[clamp(2.8rem,8vw,6.5rem)] font-light leading-[0.95] tracking-tight text-ink">
            {site.hero.headline.map((line, i) => (
              <motion.span
                key={line}
                initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: easePremium,
                  delay: 0.2 + i * 0.12,
                }}
                className="block"
              >
                <span className={i === 1 ? "italic text-accent" : undefined}>
                  {line}
                </span>
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easePremium, delay: 0.55 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-mute md:text-lg"
          >
            {site.hero.subheadline}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easePremium, delay: 0.7 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagneticButton
              icon={<ArrowIcon />}
              onClick={() => window.open(whatsappUrl(), "_blank")}
            >
              Agendar pelo Instagram
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={() => scrollToHash("#protocolos")}
            >
              Ver protocolos
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: easePremium, delay: 0.45 }}
          className="mt-14 md:col-span-5 md:mt-0"
        >
          <div className="bezel-outer">
            <div className="bezel-inner relative aspect-[4/5] overflow-hidden p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-champagne/40 via-elevated to-surface" />
              <div className="relative flex h-full flex-col justify-between">
                <p className="text-[10px] uppercase tracking-[0.22em] text-mute">
                  {site.tagline}
                </p>
                <div>
                  <p className="font-display text-3xl leading-tight text-ink md:text-4xl">
                    Protocolos que respeitam a sua pele.
                  </p>
                  <p className="mt-4 text-sm text-mute">
                    {site.instagram.handle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
