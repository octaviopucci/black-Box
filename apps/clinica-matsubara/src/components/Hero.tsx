import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { asset, site, whatsappUrl } from '../data/site'
import { LogoImage } from './LogoImage'
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
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.1,
        },
      )
      if (brandRef.current) {
        gsap.fromTo(
          brandRef.current,
          { y: 24, opacity: 0, filter: 'blur(6px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.25,
            ease: 'power3.out',
            delay: 0.18,
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
      className="relative min-h-[100svh] overflow-hidden bg-wine-deep text-cream"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={asset('hero.jpg')}
          alt={`${site.fullName} — recepção com poltronas burgundy em Capão Bonito`}
          className="h-full w-full object-cover object-[center_55%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-wine-deep/55 to-wine-deep/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-wine-deep/92 via-wine-deep/40 to-transparent max-sm:via-wine-deep/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,transparent_0%,rgba(92,26,44,0.45)_85%)]" />
      </motion.div>

      {/* Signature wave — brand motif */}
      <svg
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-24 w-full text-cream sm:h-32"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,80 C240,120 480,20 720,60 C960,100 1200,40 1440,70 L1440,120 L0,120 Z"
          opacity="0.95"
        />
      </svg>

      <motion.div
        style={{ y: brandY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-[max(6.5rem,env(safe-area-inset-bottom))] pt-24 sm:px-8 sm:pb-28 lg:justify-center lg:pb-32"
      >
        <div data-hero className="mb-4 flex items-center gap-2.5 sm:mb-6 sm:gap-3">
          <LogoImage className="h-8 w-8 ring-rose/30 sm:h-9 sm:w-9" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-soft sm:text-[11px] sm:tracking-[0.34em]">
            {site.tagline}
          </p>
        </div>

        <h1
          ref={brandRef}
          data-hero
          className="font-display text-[clamp(3.4rem,14vw,8rem)] font-semibold leading-[0.92] tracking-tight text-cream"
        >
          Matsubara
        </h1>

        <p
          data-hero
          className="mt-4 font-script text-[clamp(2rem,6vw,3.4rem)] leading-none text-rose-soft sm:mt-5"
        >
          Sua melhor versão
        </p>

        <p data-hero className="mt-3 max-w-md text-sm leading-relaxed text-cream/65 sm:mt-4 sm:text-base">
          começa aqui — odontologia, estética e especialidades com atendimento humanizado em {site.city}.
        </p>

        <div data-hero className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={whatsappUrl()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-rose px-6 py-3.5 text-sm font-semibold text-ink transition duration-500 ease-silk hover:bg-rose-soft sm:justify-start"
            data-cursor
          >
            Agendar avaliação
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/25 px-5 py-3.5 text-sm font-medium text-cream/85 transition hover:border-rose hover:text-rose-soft sm:justify-start"
            data-cursor
          >
            <InstagramIcon className="h-4 w-4" />
            Instagram
          </a>
        </div>

        <p data-hero className="mt-8 text-[10px] uppercase tracking-[0.22em] text-cream/45 sm:mt-10 sm:text-[11px] sm:tracking-[0.28em]">
          Capão Bonito · Av. Adhemar de Barros, 737
        </p>
      </motion.div>
    </section>
  )
}
