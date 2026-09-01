import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { asset, media, site, whatsappUrl } from '../data/site'
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
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15])
  const brandY = useTransform(scrollYProgress, [0, 1], [0, -32])

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
          { letterSpacing: narrow ? '0.22em' : '0.36em', opacity: 0 },
          {
            letterSpacing: narrow ? '0.06em' : '0.12em',
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
      className="relative min-h-[100svh] overflow-hidden bg-ink text-paper"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={asset(media.hero)}
          alt="Clínica Vida — ambiente de atendimento em Capão Bonito"
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
          width={1200}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/50 to-transparent" />
      </motion.div>

      <motion.div
        style={{ y: brandY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 sm:pb-16 lg:justify-center lg:pb-24"
      >
        <div data-hero className="mb-4 flex items-center gap-2.5 sm:mb-6 sm:gap-3">
          <BrandMark tone="vida" className="h-7 w-7 sm:h-8 sm:w-8" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-vida-soft sm:text-[11px] sm:tracking-[0.34em]">
            {site.tagline}
          </p>
        </div>

        <h1
          ref={brandRef}
          data-hero
          className="font-display text-[clamp(3.25rem,14vw,8rem)] font-semibold leading-[0.88] tracking-[0.06em] text-paper sm:tracking-[0.12em]"
        >
          VIDA
        </h1>

        <p
          data-hero
          className="mt-5 max-w-lg font-display text-[clamp(1.25rem,4vw,2rem)] italic leading-snug text-paper/90 sm:mt-7"
        >
          {site.headline}
        </p>

        <p data-hero className="mt-3 max-w-md text-sm leading-relaxed text-paper/55 sm:mt-4">
          {site.slogan}
        </p>

        <div data-hero className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
          <a href={whatsappUrl()} className="cta-vida justify-center sm:justify-start">
            Agendar pelo WhatsApp
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/25 px-5 py-3.5 text-sm font-medium text-paper/85 transition hover:border-vida-soft hover:text-vida-soft sm:justify-start"
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram
          </a>
        </div>
      </motion.div>
    </section>
  )
}
