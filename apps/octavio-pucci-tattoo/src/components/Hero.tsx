import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { asset, formatFollowers, media, site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const brandRef = useRef<HTMLHeadingElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.12])
  const brandY = useTransform(scrollYProgress, [0, 1], [0, -48])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero]',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.09,
          ease: 'power3.out',
          delay: 0.2,
        },
      )
      if (brandRef.current) {
        gsap.fromTo(
          brandRef.current,
          { letterSpacing: '0.22em', opacity: 0 },
          {
            letterSpacing: '0.06em',
            opacity: 1,
            duration: 1.3,
            ease: 'power3.out',
            delay: 0.3,
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
      className="relative min-h-[100svh] overflow-hidden bg-obsidian"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={asset(media.hero)}
          alt="Fechamento de costas Hannya em realismo preto e cinza — Octávio Pucci"
          className="h-full w-full object-cover object-[50%_18%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/40 to-transparent" />
        <div className="absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />
      </motion.div>

      <motion.div
        style={{ y: brandY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-[max(5rem,env(safe-area-inset-bottom))] pt-28 sm:px-8 sm:pb-16 lg:justify-center lg:pb-20"
      >
        <p data-hero className="section-label mb-3 sm:mb-5">
          {site.mantra} · {site.years} anos · {formatFollowers(site.followers)} seguidores
        </p>

        <h1
          ref={brandRef}
          className="font-brand text-[clamp(3.8rem,16vw,10rem)] leading-[0.86] tracking-[0.06em] text-parchment"
        >
          OCTÁVIO
          <br />
          PUCCI
        </h1>

        <p
          data-hero
          className="mt-6 max-w-xl font-serif text-[clamp(1.4rem,3.6vw,2.25rem)] italic leading-snug text-parchment/92 sm:mt-8"
        >
          {site.headline}
        </p>

        <p data-hero className="mt-4 max-w-md text-sm leading-relaxed text-parchment/55">
          {site.subline} {site.studio}.
        </p>

        <div
          data-hero
          className="mt-9 flex flex-col gap-3 sm:mt-11 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <a href={whatsappUrl()} className="cta-primary justify-center sm:justify-start">
            Iniciar projeto
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="cta-ghost justify-center sm:justify-start"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </div>

        <p data-hero className="mt-10 text-[10px] uppercase tracking-[0.32em] text-parchment/35">
          Realismo P&C · Coberturas · Fine Line
        </p>
      </motion.div>
    </section>
  )
}
