import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { asset, site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'
import { useMotion } from '../hooks/useMotion'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { reduced } = useMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  const enter = (delay: number) =>
    reduced
      ? undefined
      : {
          initial: { opacity: 0.001, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-wine-deep text-cream"
    >
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <img
          src={asset('portrait.jpg')}
          alt="Dra. Danielle Matsubara — endodontia e fundadora da Clínica Matsubara"
          className="h-full w-full object-cover object-[center_16%] sm:object-[center_12%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep from-[18%] via-wine-deep/70 to-wine-deep/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-wine-deep/85 via-wine-deep/35 to-transparent max-sm:via-wine-deep/45" />
      </motion.div>

      <svg
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-12 w-full text-cream sm:h-20"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,72 C320,120 520,10 760,55 C1000,100 1200,30 1440,68 L1440,120 L0,120 Z"
        />
      </svg>

      <div className="relative z-10 flex flex-1 flex-col justify-end px-5 pb-14 pt-24 sm:px-8 sm:pb-20 sm:pt-28 lg:justify-center lg:pb-24">
        <div className="mx-auto w-full max-w-7xl lg:mt-[8vh]">
          <motion.p
            {...enter(0.05)}
            className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.26em] text-rose-soft sm:mb-3 sm:text-[11px] sm:tracking-[0.32em]"
          >
            {site.role} · {site.city}
          </motion.p>

          <motion.h1
            {...enter(0.1)}
            className="font-display text-[clamp(2.2rem,9vw,6.2rem)] font-semibold leading-[0.9] tracking-tight text-cream"
          >
            Danielle
            <span className="block text-rose-soft">Matsubara</span>
          </motion.h1>

          <motion.p
            {...enter(0.18)}
            className="mt-2 max-w-lg font-script text-[clamp(1.3rem,3.6vw,2.35rem)] leading-none text-signal-soft sm:mt-4"
          >
            {site.headline}
          </motion.p>

          <motion.p
            {...enter(0.24)}
            className="mt-2 max-w-md text-[12px] leading-relaxed text-cream/75 sm:mt-3.5 sm:text-[15px]"
          >
            Canal com precisão e presença — sorriso firme, sem o medo de antes.
          </motion.p>

          <motion.div
            {...enter(0.3)}
            className="mt-4 flex flex-col gap-2 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
          >
            <a
              href={whatsappUrl()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-cream transition duration-500 ease-silk hover:bg-signal-soft sm:justify-start sm:px-6 sm:py-3.5"
              data-cursor
            >
              Agendar comigo
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 px-5 py-3 text-sm font-medium text-cream/85 transition hover:border-rose hover:text-rose-soft sm:justify-start sm:py-3.5"
              data-cursor
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </motion.div>

          <motion.p
            {...enter(0.36)}
            className="mt-3.5 hidden text-[10px] uppercase tracking-[0.18em] text-cream/45 sm:mt-6 sm:block sm:tracking-[0.22em]"
          >
            {site.clinic} · Av. Adhemar de Barros, 737
          </motion.p>
        </div>
      </div>
    </section>
  )
}
