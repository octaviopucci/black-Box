import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { asset, site, whatsappUrl } from '../data/site'
import { useMotion } from '../hooks/useMotion'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { reduced } = useMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  return (
    <section id="topo" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink">
      <motion.div style={reduced ? undefined : { y, scale }} className="absolute inset-0">
        <img
          src={asset('apply.jpg')}
          alt="Laís Felicia aplicando henna em atendimento no studio"
          className="h-full w-full object-cover object-[center_18%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-heroFade" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/35 to-transparent" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[11px] font-medium uppercase tracking-[0.32em] text-rose-soft"
        >
          {site.role} · {site.city}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4"
        >
          <p className="font-script text-[clamp(2.8rem,12vw,6.4rem)] leading-[0.86] text-paper">
            Laís Felicia
          </p>
        </motion.div>

        <h1 className="sr-only">{site.headline}</h1>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18 }}
          className="mt-6 max-w-xl font-display text-[clamp(1.55rem,4.2vw,2.35rem)] font-medium leading-[1.15] text-paper/92"
        >
          {site.headline}
        </motion.p>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 max-w-md text-sm leading-relaxed text-paper/72 sm:text-base"
        >
          {site.lead}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a href={whatsappUrl()} className="cta-rose">
            Quero agendar meu horário
          </a>
          <a href="#resultados" className="cta-ghost border-paper/25 text-paper/90 hover:border-rose-soft hover:text-paper">
            Ver resultados
          </a>
        </motion.div>

        <p className="mt-5 text-[12px] tracking-wide text-paper/55">
          {site.promise} · {site.followers} acompanham no Instagram
        </p>
      </div>
    </section>
  )
}
