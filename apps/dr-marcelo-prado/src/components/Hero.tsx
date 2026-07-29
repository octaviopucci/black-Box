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
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25])

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
        duration: 1.1,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.15,
      },
    )
  }, [])

  const lines = ['Saúde, corpo', 'e autoestima —', 'calibrados para você.']

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden bg-ink text-snow">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={asset('hero-doctor.jpg')}
          alt={`${site.name}, endocrinologista`}
          className="h-full w-full object-cover object-[center_18%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/50" />
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-16 lg:justify-center lg:pb-24 lg:pt-24">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-bold uppercase tracking-[0.28em] text-fog/70"
          >
            <span className="rounded-full bg-wine px-3 py-1.5 text-snow">{site.tagline}</span>
            <span>{site.crm}</span>
          </motion.p>

          <p className="mb-4 font-display text-2xl font-bold tracking-tight text-snow sm:text-3xl">
            {site.name}
          </p>

          <h1
            ref={titleRef}
            className="font-display text-[clamp(2.4rem,7vw,4.8rem)] font-extrabold leading-[0.98] tracking-tight text-balance"
          >
            {lines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span data-word className="inline-block">
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-snow/65 sm:text-lg"
          >
            {site.promise} Endocrinologia aplicada em Capão Bonito, Itapeva e on-line.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href={bookingUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-wine px-6 py-3.5 text-sm font-bold text-snow transition hover:bg-wine-soft"
            >
              Agendar consulta
              <ArrowDownRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-snow/25 px-5 py-3.5 text-sm font-semibold text-snow/90 transition hover:border-volt/60 hover:text-volt"
            >
              <InstagramIcon className="h-4 w-4" />
              {site.instagramHandle}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-14 flex flex-wrap items-end justify-between gap-6 border-t border-snow/10 pt-6 lg:mt-20"
        >
          <p className="max-w-xs text-xs font-semibold uppercase tracking-[0.24em] text-snow/40">
            {site.specialty}
          </p>
          <a
            href="#modulacao"
            className="group flex items-center gap-2 text-sm font-semibold text-snow/55 transition hover:text-volt"
          >
            Entender a modulação
            <ArrowDownRight className="h-4 w-4 transition group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
