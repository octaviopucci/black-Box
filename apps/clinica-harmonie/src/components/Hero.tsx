import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ArrowDownRight } from 'lucide-react'
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
  const brandY = useTransform(scrollYProgress, [0, 1], [0, -40])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.15,
        },
      )
      if (brandRef.current) {
        gsap.fromTo(
          brandRef.current,
          { letterSpacing: '0.42em', opacity: 0 },
          { letterSpacing: '0.18em', opacity: 1, duration: 1.4, ease: 'power3.out', delay: 0.25 },
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-ink text-porcelain"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={asset('hero-founders.jpg')}
          alt={`${site.fullName} — fundadores na clínica em Itapeva`}
          className="h-full w-full object-cover object-[center_28%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_0%,rgba(18,17,15,0.55)_75%)]" />
      </motion.div>

      {/* Harmonic rings — brand orbit */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-12%] top-[18%] hidden h-[min(70vw,520px)] w-[min(70vw,520px)] lg:block"
      >
        <div className="absolute inset-0 animate-pulse-ring rounded-full border border-gold/25" />
        <div className="absolute inset-[14%] rounded-full border border-gold/15" />
        <div className="absolute inset-[30%] rounded-full border border-porcelain/10" />
      </div>

      <motion.div
        style={{ y: brandY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-16 lg:justify-center lg:pb-24"
      >
        <div data-hero className="mb-6 flex items-center gap-3">
          <BrandMark tone="gold" className="h-8 w-8" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-gold-soft">
            {site.tagline}
          </p>
        </div>

        <h1
          ref={brandRef}
          data-hero
          className="font-display text-[clamp(3.6rem,14vw,8.5rem)] font-semibold leading-[0.88] tracking-[0.18em] text-porcelain"
        >
          HARMONIE
        </h1>

        <p
          data-hero
          className="mt-7 max-w-xl font-display text-[clamp(1.45rem,3.2vw,2.1rem)] italic leading-snug text-porcelain/88"
        >
          {site.headline}
        </p>

        <p data-hero className="mt-4 max-w-md text-sm leading-relaxed text-porcelain/60">
          {site.promise} Clínica médica em {site.city}.
        </p>

        <div data-hero className="mt-10 flex flex-wrap items-center gap-3">
          <a href={whatsappUrl()} className="cta-gold" data-cursor>
            Agendar pelo WhatsApp
            <ArrowDownRight className="h-4 w-4" />
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-porcelain/25 px-5 py-3.5 text-sm font-medium text-porcelain/85 transition hover:border-gold hover:text-gold-soft"
            data-cursor
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </div>

        <p data-hero className="mt-10 text-[11px] uppercase tracking-[0.28em] text-porcelain/40">
          Itapeva · Rua Flauzino Antunes, 146
        </p>
      </motion.div>
    </section>
  )
}
