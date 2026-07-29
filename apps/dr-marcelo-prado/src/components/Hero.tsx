import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ArrowDownRight } from 'lucide-react'
import { asset, bookingUrl, site } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3])

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const words = el.querySelectorAll('[data-word]')
    gsap.fromTo(
      words,
      { y: '115%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1.15,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.2,
      },
    )
  }, [])

  const lines = site.headline.split('. ').filter(Boolean)

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-void text-snow"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={asset('hero.jpg')}
          alt=""
          className="h-full w-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/82 to-void/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-void/55" />
      </motion.div>

      {/* Signal constellation — endocrine cascade motif */}
      <svg
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 hidden h-[520px] w-[420px] opacity-70 lg:block"
        viewBox="0 0 420 520"
        fill="none"
      >
        <path
          d="M210 40 C210 120 80 140 80 220 C80 300 210 320 210 400 C210 460 140 480 140 480"
          stroke="rgba(197,224,99,0.25)"
          strokeWidth="1.25"
          strokeDasharray="4 8"
        />
        <path
          d="M210 40 C210 120 340 140 340 220 C340 300 210 320 210 400 C210 460 280 480 280 480"
          stroke="rgba(155,184,168,0.3)"
          strokeWidth="1.25"
        />
        <circle cx="210" cy="40" r="7" className="fill-signal animate-pulse-node" />
        <circle cx="80" cy="220" r="5" fill="#9BB8A8" opacity="0.85" />
        <circle cx="340" cy="220" r="5" fill="#9BB8A8" opacity="0.85" />
        <circle cx="210" cy="400" r="6" fill="#C5E063" opacity="0.7" />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24 lg:pt-28">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-snow/15 bg-snow/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-signal-soft backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse-node rounded-full bg-signal" />
            {site.specialty} · {site.crm}
          </motion.p>

          <h1
            ref={titleRef}
            className="font-display text-[clamp(2.6rem,7.5vw,5.2rem)] font-semibold leading-[0.98] tracking-tight text-balance"
          >
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span data-word className="inline-block">
                  {line}
                  {i < lines.length - 1 ? '.' : ''}
                </span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-snow/70 sm:text-lg"
          >
            Endocrinologia que encontra o seu ritmo — metabolismo, tireoide, peso e energia,
            com consultas presenciais em {site.city} e atendimento on-line.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href={bookingUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-void transition hover:bg-signal-soft"
            >
              Agendar consulta
              <ArrowDownRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-snow/25 px-5 py-3.5 text-sm font-medium text-snow/90 transition hover:border-signal/50 hover:text-signal"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-16 flex items-end justify-between gap-6 border-t border-snow/10 pt-6 lg:mt-24"
        >
          <p className="max-w-xs text-xs uppercase tracking-[0.24em] text-snow/45">
            {site.tagline}
          </p>
          <a
            href="#abordagem"
            className="group flex items-center gap-2 text-sm text-snow/60 transition hover:text-signal"
          >
            Explorar a abordagem
            <ArrowDownRight className="h-4 w-4 transition group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
