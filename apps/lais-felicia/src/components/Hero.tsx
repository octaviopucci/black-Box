import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { asset, site, whatsappUrl } from '../data/site'
import { useMotion } from '../hooks/useMotion'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const { reduced } = useMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0.2])

  useEffect(() => {
    const el = titleRef.current
    if (!el || reduced) return
    gsap.fromTo(
      el,
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 },
    )
  }, [reduced])

  return (
    <section id="topo" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink">
      <motion.div
        style={reduced ? undefined : { y, scale, opacity: fade }}
        className="absolute inset-0"
      >
        <img
          src={asset('portrait.jpg')}
          alt="Laís Felicia no Studio Laís Felicia, em frente à placa oficial"
          className="h-full w-full object-cover object-[center_16%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24 lg:pt-32">
        <motion.img
          src={asset('logo.png')}
          alt=""
          aria-hidden
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="mb-8 h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20 lg:mb-10"
        />

        <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-rose-soft">
          {site.role} · {site.city}
        </p>

        <p
          ref={titleRef}
          className="mt-3 font-display text-[clamp(3.2rem,14vw,7.5rem)] font-medium leading-[0.92] tracking-tight text-paper"
        >
          Laís Felicia
        </p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl font-display text-[clamp(1.6rem,4vw,2.6rem)] font-medium leading-[1.08] text-paper/92"
        >
          {site.headline}
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-5 max-w-md text-sm leading-relaxed text-paper/70 sm:text-base"
        >
          {site.lead}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.62 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <a href={whatsappUrl()} className="cta-rose">
            Quero agendar meu horário
          </a>
          <a href="#resultados" className="cta-ghost border-paper/25 text-paper hover:border-rose-soft">
            Ver resultados
          </a>
        </motion.div>
      </div>
    </section>
  )
}
