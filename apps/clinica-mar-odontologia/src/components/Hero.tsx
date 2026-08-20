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
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !sectionRef.current || !mediaRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(mediaRef.current, {
        yPercent: 12,
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
      className="relative min-h-[100svh] overflow-hidden bg-mar-ink"
    >
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <img
          src={media.hero}
          alt="Reabilitação ortodôntica e estética — Clínica Mar Odontologia"
          className="h-[120%] w-full object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mar-ink via-mar-ink/55 to-mar-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-mar-ink/70 via-transparent to-mar-ink/30" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-5 pb-16 pt-32 md:px-10 md:pb-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.32em] text-mar-peach">
            {site.tagline}
          </p>

          <h1 className="font-display font-semibold leading-[0.88] tracking-tight text-mar-paper">
            <span className="sr-only">{site.name}</span>
            <span
              aria-hidden
              className="flex overflow-hidden text-[clamp(4.5rem,18vw,11rem)]"
            >
              {words.map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  className="inline-block"
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
            className="mt-6 max-w-xl text-balance text-[clamp(1rem,2.2vw,1.25rem)] leading-relaxed text-mar-paper/82"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {site.promise}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-mar-peach px-7 py-3.5 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-mar-ink transition-colors hover:bg-mar-peach-deep hover:text-mar-paper"
            >
              Agendar avaliação
            </a>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-mar-paper/30 px-7 py-3.5 text-[0.78rem] uppercase tracking-[0.16em] text-mar-paper/90 transition-colors hover:border-mar-paper/60 hover:text-mar-paper"
            >
              @{site.instagram.handle}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
