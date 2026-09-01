'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { media, site, whatsappUrl } from '@/data/site'

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
  const imageY = useTransform(scrollYProgress, [0, 0.35], ['0%', '10%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.75])

  return (
    <section id="topo" className="relative min-h-svh overflow-hidden bg-ink text-paper">
      <motion.div
        style={reduce ? undefined : { y: imageY }}
        className="absolute inset-0"
      >
        <Image
          src={media.hero}
          alt="Dra. Rayssa Alexandre"
          fill
          priority
          className="object-cover object-[center_20%] opacity-90"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/72 to-ink/35" />
        <div className="absolute inset-0 bg-linear-to-r from-ink/80 via-ink/45 to-transparent" />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:px-8 md:pb-24 md:pt-32"
      >
        <motion.div
          variants={reduce ? undefined : stagger}
          initial={reduce ? false : 'hidden'}
          animate="show"
          className="max-w-3xl"
        >
          <motion.p variants={reduce ? undefined : rise} className="eyebrow text-paper/70">
            {site.specialty}
          </motion.p>

          <motion.h1
            variants={reduce ? undefined : rise}
            className="display-title mt-4 text-[clamp(3.5rem,11vw,7.5rem)] text-paper"
          >
            {site.name}
            <span className="block text-[0.42em] font-normal tracking-[0.06em] text-brand-accent">
              Gomes
            </span>
          </motion.h1>

          <motion.p
            variants={reduce ? undefined : rise}
            className="mt-6 max-w-xl text-lg leading-relaxed text-paper/82 md:text-xl"
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
              className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-brand-accent/90"
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
