import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { media, siteConfig } from '@/data/site'
import { Button } from './Button'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])

  return (
    <section ref={sectionRef} id="inicio" className="relative min-h-[100svh] overflow-hidden bg-green-deep text-white">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={media.hero}
          alt="Heitor da Gelsa em visita com moradores em Capão Bonito"
          className="h-full w-full object-cover object-[center_20%] sm:object-[center_22%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep via-green-deep/90 to-green-deep/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-deep via-transparent to-green-deep/40" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,77,42,0.55)_0%,transparent_45%)]" />
        <div className="absolute inset-0 bg-grain opacity-[0.07]" aria-hidden />
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-paper to-transparent" aria-hidden />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow text-yellow"
        >
          {siteConfig.locationLabel}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-5 font-display leading-[0.86]"
        >
          <span className="block text-[clamp(0.875rem,2vw,1.125rem)] font-bold uppercase tracking-[0.32em] text-white/45">
            {siteConfig.nameLines[0]}
          </span>
          <span className="mt-1 block text-[clamp(3.75rem,15vw,8.5rem)] font-black uppercase tracking-[-0.02em] text-white">
            {siteConfig.nameLines[1]}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18 }}
          className="mt-6 max-w-2xl font-sans text-[clamp(1.375rem,3.2vw,2.125rem)] font-semibold leading-[1.15] text-white/95"
        >
          {siteConfig.heroHeadline}{' '}
          <span className="font-display font-black text-yellow">{siteConfig.heroHighlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.28 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
        >
          {siteConfig.heroSubheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.38 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Button href={`https://wa.me/${siteConfig.whatsapp}`} variant="primary" external className="w-full sm:w-auto">
            Fale com Heitor
          </Button>
          <Button href="/#trajetoria" variant="outline-white" className="w-full sm:w-auto">
            Conheça a trajetória
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
            {siteConfig.role} · {siteConfig.history}
          </p>
          <a
            href="/#sobre"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-yellow"
          >
            Explorar
            <ChevronDown size={16} className="animate-bounce" aria-hidden />
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
