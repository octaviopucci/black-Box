import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { brand, media } from '@/data/site'
import { asset } from '@/lib/asset'

export function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15])
  const brandY = useTransform(scrollYProgress, [0, 1], [0, -32])

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden bg-ink text-paper">
      <motion.div style={reduce ? undefined : { y, opacity }} className="absolute inset-0">
        <img
          src={asset(media.hero)}
          alt={`${brand.name} no consultório de estética avançada em Sorocaba`}
          className="h-full w-full object-cover object-[82%_22%] sm:object-[78%_22%] md:object-[75%_22%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink from-40% via-ink/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-ink/45" />
        <div className="grain absolute inset-0 opacity-35" aria-hidden />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: brandY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-24 pt-28 sm:px-8 md:justify-center md:pb-20"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] font-semibold uppercase tracking-mark text-gold-light/90"
        >
          ⚜ {brand.tagline}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="display mt-5 leading-[0.88] tracking-[-0.02em]"
        >
          <span className="block text-[clamp(1.6rem,6vw,3.75rem)] font-semibold text-gold-light">
            Dra. Nathalia
          </span>
          <span className="block text-[clamp(3.2rem,12vw,7.5rem)] font-semibold leading-[0.88] text-gold-light">
            Rigo
          </span>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="display mt-8 max-w-xl text-[clamp(1.45rem,3.2vw,2.15rem)] font-medium leading-[1.12] text-paper/88"
        >
          {brand.bioLines[0]}
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-measure text-sm uppercase tracking-[0.18em] text-paper/55"
        >
          {brand.bioLines[1]} · {brand.bioLines[2]}
        </motion.p>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 max-w-measure text-sm leading-relaxed text-paper/50"
        >
          {brand.bioLegacy}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href={brand.instagramDm}
            target="_blank"
            rel="noreferrer"
            className="inline-flex bg-gold px-7 py-4 text-[11px] font-semibold uppercase tracking-mark text-ink transition hover:bg-gold-light"
          >
            {brand.cta}
          </a>
          <a
            href="#procedimentos"
            className="inline-flex border border-paper/25 px-7 py-4 text-[11px] uppercase tracking-mark text-paper/80 transition hover:border-gold-light hover:text-gold-light"
          >
            Ver procedimentos
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
