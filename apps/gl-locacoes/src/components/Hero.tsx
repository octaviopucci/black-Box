import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight, MapPin } from 'lucide-react'
import { asset, site, whatsappUrl } from '../data/site'
import { useMotion } from '../hooks/useMotion'
import { BrandMark } from './BrandMark'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { reduced } = useMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  return (
    <section id="topo" ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <motion.div style={reduced ? undefined : { y, scale }} className="absolute inset-0">
        <img
          src={asset('hero.jpg')}
          alt="Pula-pula e piscina de bolinhas da G&L Locações montados para festa"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-heroFade" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_15%_85%,rgba(245,197,24,0.22),transparent_60%)]" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <BrandMark className="h-16 w-16 sm:h-20 sm:w-20" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sun">
              {site.slogan}
            </p>
          </div>

          <h1 className="font-brand text-[clamp(3.2rem,12vw,7rem)] font-bold leading-[0.92] tracking-tight text-paper">
            G&amp;L
            <span className="mt-1 block font-display text-[clamp(1.35rem,4.5vw,2.4rem)] font-semibold tracking-tight text-sun">
              Locações de Brinquedos
            </span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-xl text-lg text-paper/88 sm:text-xl"
          >
            {site.headline}
          </motion.p>

          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-3 inline-flex items-center gap-2 text-sm text-paper/65"
          >
            <MapPin className="h-4 w-4 text-sun" />
            {site.city}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href={whatsappUrl()} className="cta-sun">
              Reservar no WhatsApp
            </a>
            <a href="#brinquedos" className="cta-ghost">
              Ver brinquedos
              <ArrowDownRight className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-[12%] top-[28%] hidden h-20 w-20 rounded-full bg-sun/30 blur-2xl sm:block"
          animate={reduced ? undefined : { y: [0, -12, 0], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-40 right-[28%] hidden h-14 w-14 rounded-full bg-sky/35 blur-xl sm:block"
          animate={reduced ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>
    </section>
  )
}
