import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { site, media, whatsappUrl } from '@/data/site'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !sectionRef.current || !waveRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(waveRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reduced])

  const words = site.shortName.split('')

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative min-h-[100svh] overflow-hidden bg-[#1a1512]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_15%_20%,rgba(232,165,140,0.22),transparent_55%),radial-gradient(ellipse_60%_50%_at_85%_60%,rgba(184,146,143,0.18),transparent_50%),linear-gradient(165deg,#2a2420_0%,#1a1512_45%,#120e0c_100%)]" />

      <div
        ref={waveRef}
        className="pointer-events-none absolute -right-[10%] bottom-0 h-[70%] w-[80%] will-change-transform md:h-[85%] md:w-[55%]"
        aria-hidden
      >
        <svg
          viewBox="0 0 800 600"
          className="h-full w-full opacity-[0.14]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 420 C120 360, 220 480, 340 400 C460 320, 560 440, 680 360 C740 320, 780 340, 800 320 L800 600 L0 600 Z"
            fill="#E8A58C"
          />
          <path
            d="M0 480 C140 420, 260 520, 400 450 C540 380, 620 500, 800 420 L800 600 L0 600 Z"
            fill="#B8928F"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.08] mix-blend-overlay" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1400px] items-end gap-12 px-5 pb-16 pt-32 md:px-10 md:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-20 lg:pt-28">
        <div className="max-w-3xl">
          <motion.p
            className="mb-4 text-[0.7rem] uppercase tracking-[0.32em] text-white/75"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            {site.tagline}
          </motion.p>

          <h1 className="font-display font-semibold leading-[0.88] tracking-tight text-white">
            <span className="sr-only">{site.name}</span>
            <span
              aria-hidden
              className="flex overflow-hidden text-[clamp(4.5rem,18vw,11rem)]"
            >
              {words.map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  className="inline-block text-white"
                  initial={reduced ? false : { y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-balance text-[clamp(1.05rem,2.2vw,1.3rem)] leading-relaxed text-white/90"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {site.promise}
          </motion.p>

          <motion.p
            className="mt-4 max-w-lg text-base leading-relaxed text-white/70"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            {site.intro}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
          >
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-mar-peach px-7 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-[#1a1512] transition-colors hover:bg-white"
            >
              Agendar avaliação
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/35 px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:bg-white/10"
            >
              @{site.instagram.handle}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="mx-auto w-full max-w-md lg:max-w-none"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative overflow-hidden rounded-sm border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm md:p-10">
            <img
              src={media.profile}
              alt=""
              aria-hidden
              className="mx-auto h-24 w-24 object-contain opacity-90 md:h-28 md:w-28"
            />
            <p className="mt-6 text-center font-display text-2xl text-white md:text-3xl">
              Clínica Mar
            </p>
            <p className="mt-2 text-center text-sm uppercase tracking-[0.24em] text-white/60">
              Odontologia e Estética
            </p>
            <p className="mt-6 text-center text-sm leading-relaxed text-white/55">
              Av. Contagem, 1451 · Belo Horizonte
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
