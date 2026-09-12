"use client"

import { site, whatsappUrl } from "@/data/site"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import Image from "next/image"

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const rise: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b66?auto=format&fit=crop&w=2400&q=80"
          alt="Consultório odontológico moderno e acolhedor"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--ink)/0.88)] via-[hsl(var(--ink)/0.72)] to-[hsl(var(--ink)/0.35)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-20 pt-32 md:px-8 md:pb-28">
        <motion.div
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : "hidden"}
          animate="show"
          className="max-w-2xl"
        >
          <motion.p
            variants={reduce ? undefined : rise}
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-[hsl(var(--accent-light))]"
          >
            {site.tagline}
          </motion.p>

          <motion.p
            variants={reduce ? undefined : rise}
            className="font-display text-[clamp(3.5rem,12vw,7rem)] font-medium leading-[0.92] tracking-tight text-[hsl(var(--paper))]"
          >
            {site.name}
          </motion.p>

          <motion.h1
            variants={reduce ? undefined : rise}
            className="mt-6 max-w-xl font-display text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.08] text-[hsl(var(--paper)/0.92)]"
          >
            {site.headline}
          </motion.h1>

          <motion.div
            variants={reduce ? undefined : rise}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <motion.a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduce ? undefined : { scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-full bg-[hsl(var(--accent))] px-8 py-4 text-sm font-semibold text-[hsl(var(--paper))] transition hover:bg-[hsl(var(--accent-deep))]"
            >
              {site.whatsapp.label}
            </motion.a>
            <a
              href="#tratamentos"
              className="text-sm text-[hsl(var(--paper)/0.75)] underline-offset-4 transition hover:text-[hsl(var(--paper))] hover:underline"
            >
              Ver tratamentos
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
