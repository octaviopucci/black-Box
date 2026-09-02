"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";
import { media, site } from "@/data/site";
import { easePremium } from "@/lib/motion";
import { scrollToHash, contactUrl } from "@/lib/contact";
import { MagneticButton } from "@/components/ui/magnetic-button";

gsap.registerPlugin(ScrollTrigger);

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
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
  const pinRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const mediaEl = mediaRef.current;
    const content = contentRef.current;
    const brand = brandRef.current;
    if (!section || !pin || !mediaEl || !content || !brand) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=130%",
          pin: pin,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        mediaEl,
        { scale: 1, yPercent: 0 },
        { scale: 1.22, yPercent: -10, ease: "none" },
        0,
      );
      tl.fromTo(
        content,
        { y: 0, opacity: 1 },
        { y: -72, opacity: 0, ease: "none" },
        0,
      );
      tl.fromTo(
        brand,
        { y: 0, opacity: 1 },
        { y: -48, opacity: 0.15, ease: "none" },
        0,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative h-[220vh] bg-deep"
    >
      <div ref={pinRef} className="relative h-[100dvh] w-full overflow-hidden">
        <div
          ref={mediaRef}
          className="hero-scrub-media absolute inset-0"
        >
          <Image
            src={media.hero}
            alt="Luiza Rimoli — nutricionista"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/55 to-deep/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/20 to-deep/50" />
        </div>

        <div className="grain pointer-events-none absolute inset-0 z-[2] opacity-[0.04]" />

        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 pt-32 md:px-10 md:pb-20 lg:px-14">
          <div ref={brandRef} className="mb-auto pt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
              {site.hero.eyebrow}
            </p>
            <div className="font-display leading-[0.88] tracking-tight text-white">
              <span className="block text-[clamp(1rem,2.2vw,1.25rem)] font-medium uppercase tracking-[0.24em] text-white/45">
                {site.hero.brandLine}
              </span>
              <span className="mt-1 block text-[clamp(3.8rem,14vw,8.5rem)] font-semibold">
                {site.hero.brandName}
              </span>
            </div>
          </div>

          <div ref={contentRef}>
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, ease: easePremium, delay: 0.25 }}
              className="max-w-3xl font-display text-[clamp(1.75rem,4.5vw,3rem)] font-medium leading-[1.08] tracking-tight text-white"
            >
              {site.hero.headline}
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: easePremium, delay: 0.45 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
            >
              {site.hero.subheadline}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: easePremium, delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <MagneticButton variant="accent" href={contactUrl()}>
                Agendar pelo Instagram
              </MagneticButton>
              <MagneticButton
                variant="ghost"
                className="bg-white/10 text-white ring-white/20 hover:bg-white/15"
                onClick={() => scrollToHash("#servicos")}
              >
                Ver atendimentos
                <ArrowIcon />
              </MagneticButton>
            </motion.div>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
              className="mt-8 text-xs uppercase tracking-[0.18em] text-white/40"
            >
              {site.hero.credential}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
