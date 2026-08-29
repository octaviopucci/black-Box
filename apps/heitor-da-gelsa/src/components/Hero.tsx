import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { media, siteConfig } from '@/data/site'
import { Button } from './Button'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])

  return (
    <section ref={sectionRef} id="inicio" className="relative min-h-[100svh] overflow-hidden bg-green-deep text-white">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={media.hero}
          alt="Heitor da Gelsa em visita com moradores em Capão Bonito"
          className="h-full w-full object-cover object-[center_22%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep via-green-deep/85 to-green-deep/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-deep via-green-deep/25 to-green-deep/50" />
        <div className="absolute inset-0 bg-grain opacity-[0.06]" aria-hidden />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:px-8 sm:pb-16 lg:justify-center lg:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-bold uppercase tracking-[0.28em] text-yellow"
        >
          {siteConfig.locationLabel}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-4 font-display leading-[0.88]"
        >
          <span className="block text-[clamp(1rem,2.2vw,1.25rem)] font-bold uppercase tracking-[0.24em] text-white/50">
            {siteConfig.nameLines[0]}
          </span>
          <span className="mt-1 block text-[clamp(3.5rem,14vw,8rem)] font-black tracking-tight">
            {siteConfig.nameLines[1]}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18 }}
          className="mt-6 max-w-2xl font-display text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-[1.12]"
        >
          {siteConfig.heroHeadline}{' '}
          <span className="text-yellow">{siteConfig.heroHighlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.28 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          {siteConfig.heroSubheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.38 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Button href={`https://wa.me/${siteConfig.whatsapp}`} variant="primary" external className="w-full sm:w-auto">
            Fale com Heitor
          </Button>
          <Button href="/#trajetoria" variant="outline-white" className="w-full sm:w-auto">
            Conheça a trajetória
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-14 border-t border-white/10 pt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40"
        >
          {siteConfig.role} · {siteConfig.history}
        </motion.p>
      </div>
    </section>
  )
}
