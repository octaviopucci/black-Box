import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ArrowDownRight } from 'lucide-react'
import { asset, site, whatsappUrl } from '../data/site'
import { InstagramIcon } from './InstagramIcon'

const slides = [
  {
    src: asset('hero-1.jpg'),
    caption: 'Cuidado clínico com presença humana',
  },
  {
    src: asset('hero-2.jpg'),
    caption: 'Pediatria com acolhimento em cada fase',
  },
  {
    src: asset('hero-3.jpg'),
    caption: 'Ambiente sereno para você se sentir em casa',
  },
]

export function Hero() {
  const [index, setIndex] = useState(0)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.35])

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5600)
    return () => window.clearInterval(id)
  }, [])

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
        duration: 1.1,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.25,
      },
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-abyss text-snow"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <AnimatePresence mode="sync">
          {slides.map((slide, i) =>
            i === index ? (
              <motion.img
                key={slide.src}
                src={slide.src}
                alt=""
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null,
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/78 to-abyss/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-abyss/40" />
      </motion.div>

      {/* Subtle DNA orbit motif */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/4 hidden h-[420px] w-[420px] animate-orbit rounded-full border border-aqua/20 lg:block"
      >
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-aqua/70 shadow-glow" />
        <div className="absolute bottom-10 left-8 h-2 w-2 rounded-full bg-life/80" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24 lg:pt-28">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-5 text-[11px] font-semibold uppercase tracking-[0.38em] text-aqua-soft"
          >
            {site.tagline} · Capão Bonito
          </motion.p>

          <p className="mb-3 font-display text-[clamp(3.4rem,12vw,7.5rem)] font-semibold leading-[0.88] tracking-tight text-snow">
            Clínica
          </p>

          <h1
            ref={titleRef}
            className="font-display text-[clamp(4.2rem,16vw,9.5rem)] font-semibold leading-[0.82] tracking-tight text-snow"
          >
            {'DNA'.split('').map((letter) => (
              <span key={letter} className="inline-block overflow-hidden align-bottom">
                <span data-word className="inline-block">
                  {letter}
                </span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-snow/75 sm:text-lg"
          >
            {site.headline}. Atendimento multidisciplinar com escuta, precisão e presença —
            para você e sua família.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-aqua px-6 py-3.5 text-sm font-semibold text-abyss transition hover:bg-aqua-soft"
            >
              Agendar consulta
              <ArrowDownRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            <a
              href="#especialidades"
              className="inline-flex items-center gap-2 rounded-full border border-snow/25 bg-snow/5 px-6 py-3.5 text-sm font-medium text-snow backdrop-blur-md transition hover:border-snow/50"
            >
              Ver especialidades
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Clínica DNA"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-snow/20 text-snow/80 transition hover:border-snow/50 hover:text-snow"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </motion.div>
        </div>

        <div className="mt-14 flex items-end justify-between gap-6 border-t border-snow/10 pt-6">
          <p className="max-w-xs text-xs leading-relaxed text-snow/55 sm:text-sm">
            {slides[index].caption}
          </p>
          <div className="flex items-center gap-2" aria-hidden>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? 'w-8 bg-aqua' : 'w-3 bg-snow/30 hover:bg-snow/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
