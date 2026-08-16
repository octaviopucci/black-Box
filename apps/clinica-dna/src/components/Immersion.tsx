import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { asset, site, whatsappUrl } from '../data/site'

export function Immersion() {
  const ref = useRef<HTMLElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15])
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.28])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-immerse]',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.11,
          ease: 'power3.out',
          delay: 0.15,
        },
      )
      gsap.fromTo(
        ringRef.current,
        { scale: 0.78, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.55, ease: 'power3.out' },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-void">
      {/* Atmosphere plane — soft care moment, not hospital OR stock */}
      <motion.div style={{ y: mediaY, opacity: mediaOpacity }} className="absolute inset-0">
        <img
          src={asset('hero-3.jpg')}
          alt=""
          className="h-full w-full scale-105 object-cover object-[center_30%] opacity-35"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/55 to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_0%,rgba(4,9,16,0.72)_68%)]" />
      </motion.div>

      {/* Logo orbit — the brand’s dominant visual language */}
      <motion.div
        ref={ringRef}
        style={{ scale: ringScale }}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[46%] h-[min(88vw,620px)] w-[min(88vw,620px)] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute inset-0 rounded-full border border-paper/20" />
        <div className="absolute inset-[10%] rounded-full border border-signal/25" />
        <div className="absolute inset-[24%] rounded-full border border-paper/12" />
        <div className="absolute inset-[40%] rounded-full border border-sand/20" />
        {/* Specialty nodes — echo the logo’s four care marks */}
        <span className="absolute right-[6%] top-[28%] h-2.5 w-2.5 rounded-full bg-signal shadow-glow" />
        <span className="absolute bottom-[22%] right-[18%] h-2 w-2 rounded-full bg-paper/70" />
        <span className="absolute bottom-[30%] left-[10%] h-1.5 w-1.5 rounded-full bg-sand" />
        <span className="absolute left-[20%] top-[18%] h-2 w-2 rounded-full bg-signal/80" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 pb-24 pt-28 text-center sm:px-8">
        <p
          data-immerse
          className="mb-5 text-[11px] font-medium uppercase tracking-[0.42em] text-signal"
        >
          {site.tagline}
        </p>

        <h1 data-immerse className="font-display leading-[0.82] tracking-tight text-paper">
          <span className="block text-[clamp(0.95rem,2.8vw,1.35rem)] font-medium uppercase tracking-[0.42em] text-paper/55">
            Clínica
          </span>
          <span className="mt-1 block text-[clamp(5.2rem,20vw,11.5rem)] font-semibold">DNA</span>
        </h1>

        <p
          data-immerse
          className="mt-7 max-w-md text-base font-light leading-relaxed text-paper/70 sm:text-lg"
        >
          {site.headline}. Escuta, precisão e presença — no centro de Capão Bonito.
        </p>

        <div data-immerse className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-signal px-8 py-3.5 text-sm font-semibold text-void transition hover:bg-mist"
          >
            Agendar no WhatsApp
          </a>
          <a
            href="#corredor"
            className="text-sm font-medium tracking-wide text-paper/55 underline-offset-4 transition hover:text-signal hover:underline"
          >
            Explorar o cuidado
          </a>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-[10px] uppercase tracking-[0.28em] text-paper/35">
        Role para seguir o fio
      </p>
    </section>
  )
}
