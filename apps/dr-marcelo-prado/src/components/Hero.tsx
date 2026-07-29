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
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2])
  const brandY = useTransform(scrollYProgress, [0, 1], [0, -36])

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const words = el.querySelectorAll('[data-word]')
    gsap.fromTo(
      words,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1.15,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.35,
      },
    )
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] overflow-hidden bg-ink text-snow">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={asset('hero-doctor.jpg')}
          alt={`${site.name}, endocrinologista`}
          className="h-full w-full object-cover object-[center_16%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_35%,transparent_0%,rgba(10,12,12,0.55)_75%)]" />
      </motion.div>

      <motion.div
        style={{ y: brandY }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-16 lg:justify-center lg:pb-24"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-5 text-[11px] font-bold uppercase tracking-[0.34em] text-aqua-light/90"
        >
          {site.specialty}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display leading-[0.88] tracking-tight"
        >
          <span className="block text-[clamp(1.05rem,2.4vw,1.35rem)] font-medium uppercase tracking-[0.28em] text-snow/45">
            Dr. Marcelo
          </span>
          <span className="mt-1 block text-[clamp(4.4rem,16vw,9.5rem)] font-semibold">Prado</span>
        </motion.div>

        <h1
          ref={titleRef}
          className="mt-8 max-w-2xl font-display text-[clamp(1.55rem,3.6vw,2.35rem)] font-semibold leading-[1.15] tracking-tight text-snow/90"
        >
          {['Saúde, corpo e autoestima —', 'calibrados para você.'].map((line) => (
            <span key={line} className="block overflow-hidden">
              <span data-word className="inline-block">
                {line}
              </span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-6 max-w-md text-base leading-relaxed text-snow/60 sm:text-lg"
        >
          {site.promise}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a href={bookingUrl()} target="_blank" rel="noopener noreferrer" className="cta-aqua">
            Agendar consulta
            <ArrowDownRight className="h-4 w-4" />
          </a>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-ghost-light"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.instagramHandle}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.9 }}
          className="mt-14 flex flex-wrap items-end justify-between gap-6 border-t border-snow/10 pt-6 lg:mt-20"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-snow/35">
            {site.crm} · Capão Bonito · Itapeva · On-line
          </p>
          <a
            href="#modulacao"
            className="group flex items-center gap-2 text-sm font-semibold text-snow/50 transition hover:text-aqua-light"
          >
            Entender a modulação
            <ArrowDownRight className="h-4 w-4 transition group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
