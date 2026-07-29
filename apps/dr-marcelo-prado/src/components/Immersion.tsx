import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { asset, bookingUrl, site } from '../data/site'

export function Immersion() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.85], [1, 1.1])
  const yText = useTransform(scrollYProgress, [0, 1], [0, -48])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-immerse]',
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.25, stagger: 0.14, ease: 'power3.out', delay: 0.15 },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="imersao" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-void">
      <motion.div style={{ scale, opacity }} className="absolute inset-0">
        <img
          src={asset('hero-doctor.jpg')}
          alt=""
          className="h-full w-full object-cover object-[center_16%] opacity-[0.58]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-void/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-void/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgba(3,7,7,0.72)_72%)]" />
      </motion.div>

      {/* Couture pulse — single refined orb, not a logo clone */}
      <motion.div
        aria-hidden
        style={{ opacity }}
        className="pointer-events-none absolute right-[-8%] top-[18%] hidden h-[min(58vw,520px)] w-[min(58vw,520px)] lg:block"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-signal/20"
        />
        <div className="absolute inset-[18%] rounded-full border border-champagne/15" />
        <div className="absolute inset-[38%] rounded-full bg-signal/[0.04] blur-xl" />
        <span className="absolute right-[12%] top-[28%] h-1.5 w-1.5 rounded-full bg-signal shadow-glow" />
      </motion.div>

      <motion.div
        style={{ y: yText }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 md:pl-28 lg:justify-center lg:pb-24"
      >
        <p data-immerse className="section-kicker mb-7">
          {site.specialty}
        </p>

        <h1 data-immerse className="font-display leading-[0.88] tracking-tight text-paper">
          <span className="block text-[clamp(1.05rem,2.6vw,1.45rem)] font-medium uppercase tracking-[0.34em] text-paper/50">
            Dr. Marcelo
          </span>
          <span className="mt-1 block text-[clamp(4.6rem,18vw,10.5rem)] font-semibold">
            Prado
          </span>
        </h1>

        <p
          data-immerse
          className="mt-7 max-w-md text-base font-light leading-relaxed text-paper/68 sm:text-lg"
        >
          {site.promise}
        </p>

        <div data-immerse className="mt-10 flex flex-wrap items-center gap-3">
          <a href={bookingUrl()} target="_blank" rel="noreferrer" className="cta-primary">
            Agendar consulta
          </a>
          <a href="#corredor" className="cta-ghost">
            Explorar o cuidado
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-14 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-paper/35"
        >
          <span className="relative flex h-8 w-px overflow-hidden bg-paper/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-3 bg-signal"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          Role para calibrar
        </motion.div>
      </motion.div>
    </section>
  )
}
