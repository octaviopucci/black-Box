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
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 1.12])
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.45])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-immerse]',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.2,
        },
      )
      gsap.fromTo(
        ringRef.current,
        { scale: 0.72, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.6, ease: 'power3.out' },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-void">
      <motion.div style={{ scale, opacity }} className="absolute inset-0">
        <img
          src={asset('moment-listen.jpg')}
          alt=""
          className="h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/55 to-void" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,9,16,0.75)_70%)]" />
      </motion.div>

      {/* Brand orbit — enters the logo language */}
      <motion.div
        ref={ringRef}
        style={{ scale: ringScale }}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(78vw,540px)] w-[min(78vw,540px)] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="absolute inset-0 rounded-full border border-signal/25" />
        <div className="absolute inset-[12%] rounded-full border border-signal/15" />
        <div className="absolute inset-[28%] rounded-full border border-sand/20" />
        <span className="absolute -right-1 top-1/4 h-2.5 w-2.5 rounded-full bg-signal shadow-glow" />
        <span className="absolute bottom-[18%] left-2 h-1.5 w-1.5 rounded-full bg-sand" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 pb-20 pt-28 text-center sm:px-8">
        <p
          data-immerse
          className="mb-6 text-[11px] font-medium uppercase tracking-[0.42em] text-signal/80"
        >
          {site.tagline}
        </p>

        <h1 data-immerse className="font-display leading-[0.85] tracking-tight text-paper">
          <span className="block text-[clamp(1.4rem,4vw,2rem)] font-medium uppercase tracking-[0.35em] text-paper/60">
            Clínica
          </span>
          <span className="mt-2 block text-[clamp(5.5rem,22vw,12rem)] font-semibold">
            DNA
          </span>
        </h1>

        <p
          data-immerse
          className="mt-8 max-w-md text-base font-light leading-relaxed text-paper/70 sm:text-lg"
        >
          {site.headline}. Um fio contínuo entre quem precisa de cuidado e quem sabe oferecer.
        </p>

        <div data-immerse className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-void transition hover:bg-mist"
          >
            Entrar em contato
          </a>
          <a
            href="#corredor"
            className="rounded-full border border-paper/20 px-7 py-3.5 text-sm font-medium text-paper/80 transition hover:border-signal/50 hover:text-signal"
          >
            Explorar o cuidado
          </a>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-paper/35"
        >
          Role para seguir o fio
        </motion.p>
      </div>
    </section>
  )
}
