import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { media, site } from '@/data/site'
import { useHeroParallax } from '@/hooks/useMotion'

export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null)
  useHeroParallax(imageRef)
  const reduced = useReducedMotion()

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <img
          src={media.hero}
          alt="Dr. Gabriel Giovani — cirurgião-dentista"
          className="h-[120%] w-full object-cover object-[center_20%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-14 md:px-10 md:pb-20 lg:px-16">
        <div className="mx-auto w-full max-w-[1400px]">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-teal-soft"
          >
            {site.title} · CRO {site.cro}
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3.2rem,11vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.03em] text-paper"
          >
            Gabriel
            <br />
            <span className="italic text-gold-soft">Giovani</span>
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-md text-balance text-base leading-relaxed text-paper/75 md:text-lg"
          >
            {site.hero.support}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-5"
          >
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-paper/30 bg-paper/10 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-paper backdrop-blur-sm transition-colors hover:bg-paper hover:text-ink"
            >
              {site.hero.cta}
            </a>
            <a
              href="#resultados"
              className="text-sm font-medium text-paper/60 underline-offset-4 transition-colors hover:text-paper hover:underline"
            >
              Ver resultados reais
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
