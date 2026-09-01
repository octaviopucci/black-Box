'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { site, whatsappUrl } from '@/data/site'
import { HeroCarousel } from '@/components/sections/hero-carousel'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function Hero() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.75])

  return (
    <section id="topo" className="relative min-h-svh overflow-hidden bg-ink text-paper">
      <HeroCarousel className="absolute inset-0" />

      <motion.div
        style={reduce ? undefined : { opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-6 pb-20 pt-28 md:px-8 md:pb-28 md:pt-36"
      >
        <motion.div
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          animate="show"
          className="max-w-4xl"
        >
          <motion.p variants={reduce ? undefined : rise} className="eyebrow text-paper/70">
            {site.specialty}
          </motion.p>

          <motion.h1
            variants={reduce ? undefined : rise}
            className="display-title mt-3 leading-[0.86] tracking-[-0.03em]"
          >
            <span className="block text-[clamp(5rem,22vw,14rem)] text-paper">Rayssa</span>
            <span className="block text-[clamp(4.25rem,18vw,11.5rem)] text-brand-accent">
              Gomes
            </span>
          </motion.h1>

          <motion.p
            variants={reduce ? undefined : rise}
            className="mt-6 max-w-xl text-lg leading-relaxed text-paper/85 md:text-xl"
          >
            {site.headline}
          </motion.p>

          <motion.div
            variants={reduce ? undefined : rise}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-7 py-3.5 text-sm font-semibold text-paper transition hover:bg-brand-accent/90"
            >
              Agendar consulta
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-6 py-3.5 text-sm font-medium text-paper/90 transition hover:border-paper/50 hover:text-paper"
            >
              {site.instagramHandle}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
