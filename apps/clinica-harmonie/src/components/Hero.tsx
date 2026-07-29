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
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2])
  const brandY = useTransform(scrollYProgress, [0, 1], [0, -28])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.09,
          ease: 'power3.out',
          delay: 0.12,
        },
      )
      if (brandRef.current) {
        const narrow = window.matchMedia('(max-width: 640px)').matches
        gsap.fromTo(
          brandRef.current,
          { letterSpacing: narrow ? '0.28em' : '0.4em', opacity: 0 },
          {
            letterSpacing: narrow ? '0.08em' : '0.16em',
            opacity: 1,
            duration: 1.35,
            ease: 'power3.out',
            delay: 0.2,
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
      className="relative min-h-[100svh] overflow-hidden bg-ink text-porcelain"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={asset('hero-founders.jpg')}
          alt={`${site.fullName} — fundadores na clínica em Itapeva`}
          className="h-full w-full object-cover object-[58%_18%] sm:object-[center_22%] lg:object-[62%_20%]"
          fetchPriority="high"
        />
        {/* Mobile: keep the living wall + neon readable; desktop: cinematic side fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/35 sm:via-ink/40 sm:to-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/45 to-transparent max-sm:via-ink/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_0%,rgba(18,17,15,0.45)_80%)]" />
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-[-18%] top-[12%] hidden h-[min(68vw,500px)] w-[min(68vw,500px)] lg:block"
      >
        <div className="absolute inset-0 animate-pulse-ring rounded-full border border-gold/25" />
        <div className="absolute inset-[14%] rounded-full border border-gold/15" />
        <div className="absolute inset-[30%] rounded-full border border-porcelain/10" />
      </div>

      <motion.div
        style={{ y: brandY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 sm:pb-16 lg:justify-center lg:pb-24"
      >
        <div data-hero className="mb-4 flex items-center gap-2.5 sm:mb-6 sm:gap-3">
          <BrandMark tone="gold" className="h-7 w-7 sm:h-8 sm:w-8" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-soft sm:text-[11px] sm:tracking-[0.34em]">
            {site.tagline}
          </p>
        </div>

        <h1
          ref={brandRef}
          data-hero
          className="font-display text-[clamp(3.25rem,15vw,8.5rem)] font-semibold leading-[0.9] tracking-[0.08em] text-porcelain sm:tracking-[0.16em]"
        >
          HARMONIE
        </h1>

        <p
          data-hero
          className="mt-5 max-w-md font-display text-[clamp(1.25rem,4.2vw,2.05rem)] italic leading-snug text-porcelain/90 sm:mt-7 sm:max-w-xl"
        >
          {site.headline}
        </p>

        <p data-hero className="mt-3 hidden max-w-md text-sm leading-relaxed text-porcelain/60 sm:mt-4 sm:block">
          {site.promise} Clínica médica em {site.city}.
        </p>

        <div data-hero className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
          <a href={whatsappUrl()} className="cta-gold justify-center sm:justify-start" data-cursor>
            Agendar pelo WhatsApp
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-porcelain/25 px-5 py-3.5 text-sm font-medium text-porcelain/85 transition hover:border-gold hover:text-gold-soft sm:justify-start"
            data-cursor
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram
          </a>
        </div>

        <p data-hero className="mt-8 text-[10px] uppercase tracking-[0.22em] text-porcelain/45 sm:mt-10 sm:text-[11px] sm:tracking-[0.28em]">
          Itapeva · Rua Flauzino Antunes, 146
        </p>
      </motion.div>
    </section>
  )
}
