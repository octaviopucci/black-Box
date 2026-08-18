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
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  return (
    <section id="topo" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink">
      <motion.div style={reduced ? undefined : { y, scale }} className="absolute inset-0">
        <img
          src={asset('studio.jpg')}
          alt="Studio Laís Felicia em Capão Bonito, com a logo oficial na parede chevron"
          className="h-full w-full object-cover object-[center_12%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/15" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <motion.img
          src={asset('logo.png')}
          alt=""
          aria-hidden
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-7 h-[4.5rem] w-[4.5rem] rounded-full object-cover sm:h-24 sm:w-24"
        />

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="text-[11px] font-medium uppercase tracking-[0.32em] text-rose-soft"
        >
          {site.role} · {site.city}
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-xl font-display text-[clamp(2.1rem,6.4vw,3.6rem)] font-medium leading-[1.02] tracking-tight text-paper"
        >
          {site.headline}
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.28 }}
          className="mt-4 max-w-md text-sm leading-relaxed text-paper/72 sm:text-base"
        >
          {site.lead}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.38 }}
          className="mt-8"
        >
          <a href={whatsappUrl()} className="cta-rose">
            Quero agendar meu horário
          </a>
        </motion.div>
      </div>
    </section>
  )
}
