import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { site, media, whatsappUrl } from '../data/site'
import { useMotion } from '../hooks/useMotion'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { reduced } = useMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  const words = site.name.split(' ')

  return (
    <section id="topo" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink">
      <motion.div
        style={reduced ? undefined : { y, scale }}
        className="absolute inset-0"
        aria-hidden
      >
        <img
          src={media.hero}
          alt="Resultado de odontologia estética — Lira Odonto Caruaru"
          className="h-full w-full object-cover object-[center_30%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-heroVeil" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(156,196,212,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-14 pt-24 sm:px-8 sm:pb-20">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-crystal-soft">
            {site.tagline}
          </p>

          <h1 className="font-display text-[clamp(3.4rem,13vw,7.5rem)] font-normal leading-[0.9] tracking-[-0.02em] text-paper">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={reduced ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.08 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {word}
                {i < words.length - 1 ? '\u00a0' : ''}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg font-display text-[clamp(1.25rem,3.5vw,1.75rem)] italic leading-snug text-paper/90"
          >
            {site.headline}
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.34 }}
            className="mt-4 max-w-md text-base leading-relaxed text-paper/70"
          >
            {site.support}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.42 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a href={whatsappUrl()} className="cta-primary">
              Agendar avaliação
            </a>
            <a href="#resultados" className="cta-ghost">
              Ver resultados
            </a>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.52 }}
            className="mt-6 text-sm text-paper/50"
          >
            {site.neighborhood}, {site.city}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
