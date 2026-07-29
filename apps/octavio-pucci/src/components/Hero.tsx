import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { asset, site, whatsappUrl } from '../data/site'
import { BrandMark } from './BrandMark'
import { InstagramIcon } from './InstagramIcon'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const brandRef = useRef<HTMLHeadingElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15])
  const brandY = useTransform(scrollYProgress, [0, 1], [0, -36])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.15,
        },
      )
      if (brandRef.current) {
        gsap.fromTo(
          brandRef.current,
          { letterSpacing: '0.28em', opacity: 0 },
          {
            letterSpacing: '0.08em',
            opacity: 1,
            duration: 1.4,
            ease: 'power3.out',
            delay: 0.25,
          },
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-void text-bone"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={asset('back-hannya.jpg')}
          alt="Fechamento de costas Hannya em realismo preto e cinza — Octávio Pucci"
          className="h-full w-full object-cover object-[50%_20%] sm:object-[55%_25%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/90 via-void/35 to-transparent" />
        <div className="absolute inset-0 bg-vignette" />
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-[-12%] top-[18%] hidden h-[min(62vw,460px)] w-[min(62vw,460px)] lg:block"
      >
        <div className="absolute inset-0 animate-ink-pulse rounded-full border border-gold/25" />
        <div className="absolute inset-[16%] rounded-full border border-gold/15" />
        <div className="absolute inset-[34%] rounded-full border border-bone/10" />
      </div>

      <motion.div
        style={{ y: brandY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-[max(5rem,env(safe-area-inset-bottom))] pt-28 sm:px-8 sm:pb-16 lg:justify-center lg:pb-24"
      >
        <div data-hero className="mb-4 flex items-center gap-3 sm:mb-6">
          <BrandMark className="h-8 w-8 sm:h-9 sm:w-9" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold sm:text-[11px]">
            {site.mantra} · {site.years} anos
          </p>
        </div>

        <h1
          ref={brandRef}
          data-hero
          className="font-brand text-[clamp(3.4rem,14vw,8.75rem)] font-semibold leading-[0.88] tracking-[0.08em] text-bone"
        >
          OCTÁVIO
          <br />
          PUCCI
        </h1>

        <p
          data-hero
          className="mt-5 max-w-lg font-display text-[clamp(1.35rem,3.8vw,2.15rem)] italic leading-snug text-bone/90 sm:mt-7"
        >
          {site.headline}
        </p>

        <p
          data-hero
          className="mt-3 hidden max-w-md text-sm leading-relaxed text-bone/55 sm:mt-4 sm:block"
        >
          {site.promise} {site.studio}.
        </p>

        <div
          data-hero
          className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <a href={whatsappUrl()} className="cta-gold justify-center sm:justify-start" data-cursor>
            Iniciar projeto
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="cta-ghost justify-center sm:justify-start"
            data-cursor
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </div>

        <p
          data-hero
          className="mt-8 text-[11px] uppercase tracking-[0.28em] text-ash sm:mt-10"
        >
          Realismo P&C · Coberturas · Fine Line · {site.city}
        </p>
      </motion.div>
    </section>
  )
}
