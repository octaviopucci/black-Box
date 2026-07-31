import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { asset, site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0.2])

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
          stagger: 0.11,
          ease: 'power3.out',
          delay: 0.12,
        },
      )
      if (nameRef.current) {
        gsap.fromTo(
          nameRef.current,
          { y: 28, opacity: 0, filter: 'blur(8px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
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
      className="relative min-h-[100svh] overflow-hidden bg-wine-deep text-cream"
    >
      <motion.div style={{ y: imgY, scale: imgScale, opacity: fade }} className="absolute inset-0">
        <img
          src={asset('portrait.jpg')}
          alt="Dra. Danielle Matsubara — endodontia e fundadora da Clínica Matsubara"
          className="h-full w-full object-cover object-[center_18%] sm:object-[center_12%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-wine-deep/50 to-wine-deep/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-wine-deep/88 via-wine-deep/35 to-transparent max-sm:via-wine-deep/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,transparent_0%,rgba(74,21,36,0.5)_90%)]" />
      </motion.div>

      {/* Soft wave transition into cream */}
      <svg
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-20 w-full text-cream sm:h-28"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,72 C320,120 520,10 760,55 C1000,100 1200,30 1440,68 L1440,120 L0,120 Z"
        />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-28 sm:px-8 sm:pb-24 lg:justify-center lg:pb-28">
        <p
          data-hero
          className="mb-3 text-[10px] font-medium uppercase tracking-[0.34em] text-rose-soft sm:mb-4 sm:text-[11px]"
        >
          {site.role} · {site.city}
        </p>

        <h1
          ref={nameRef}
          className="font-display text-[clamp(3.2rem,12vw,7.2rem)] font-semibold leading-[0.9] tracking-tight text-cream"
        >
          Danielle
          <span className="block text-rose-soft">Matsubara</span>
        </h1>

        <p
          data-hero
          className="mt-5 max-w-md font-script text-[clamp(1.75rem,5vw,2.75rem)] leading-none text-signal-soft sm:mt-6"
        >
          {site.headline}
        </p>

        <p data-hero className="mt-4 max-w-md text-sm leading-relaxed text-cream/65 sm:text-base">
          {site.lead}
        </p>

        <div data-hero className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={whatsappUrl()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-cream transition duration-500 ease-silk hover:bg-signal-soft sm:justify-start"
            data-cursor
          >
            Agendar comigo
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
            {site.instagramHandle}
          </a>
        </div>

        <p
          data-hero
          className="mt-8 text-[10px] uppercase tracking-[0.22em] text-cream/40 sm:mt-10 sm:text-[11px]"
        >
          {site.clinic} · Av. Adhemar de Barros, 737
        </p>
      </div>
    </section>
  )
}
