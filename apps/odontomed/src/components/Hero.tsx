import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { instagramUrl, media, site } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/useMotion'

gsap.registerPlugin(ScrollTrigger)

const heroWords = ['Odontologia', 'avançada', 'com', 'cuidado', 'de', 'verdade.']

export function Hero() {
  const reduced = usePrefersReducedMotion()
  const reducedMotion = useReducedMotion()
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !imageRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [reduced])

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-mauve-deep">
      <div ref={imageRef} className="absolute inset-0 will-change-transform">
        <img
          src={media.hero}
          alt="Recepção acolhedora na OdontoMed, clínica odontológica em Bom Retiro/SC"
          className="h-[118%] w-full object-cover object-[center_28%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mauve-deep/55 via-mauve-deep/35 to-mauve-deep/88" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(176,125,112,0.22),transparent_55%)]" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col justify-end px-6 pb-10 pt-24 sm:px-10 sm:pb-14 lg:px-16 lg:pb-20">
        <div className="mx-auto w-full max-w-7xl">
          <motion.p
            className="font-display text-[clamp(3.6rem,14vw,9.5rem)] font-medium leading-[0.88] tracking-[-0.03em] text-paper"
            initial={reducedMotion ? false : { opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.38, 1] }}
          >
            OdontoMed
          </motion.p>

          <motion.p
            className="mt-3 max-w-xl font-sans text-sm font-medium uppercase tracking-[0.32em] text-copper-light sm:text-[0.78rem]"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.33, 1, 0.38, 1] }}
          >
            {site.brand.promise}
          </motion.p>

          <h1 className="mt-8 max-w-3xl font-display text-[clamp(2rem,5.5vw,4.25rem)] leading-[1.02] text-paper/95">
            {heroWords.map((word, index) => (
              <motion.span
                key={word + index}
                className="mr-[0.28em] inline-block"
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.35 + index * 0.07,
                  ease: [0.33, 1, 0.38, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-5 max-w-lg font-sans text-base leading-relaxed text-paper/78 sm:text-lg"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.33, 1, 0.38, 1] }}
          >
            {site.location.city}/{site.location.state} · agende sua avaliação pelo Instagram oficial.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.33, 1, 0.38, 1] }}
          >
            <a
              href={instagramUrl('Olá! Gostaria de agendar uma avaliação na OdontoMed.')}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              Agendar avaliação
            </a>
            <a href="#tratamentos" className="cta-ghost">
              Ver tratamentos
            </a>
          </motion.div>
        </div>
      </div>

      <nav
        aria-label="Navegação principal"
        className="absolute right-6 top-6 z-20 hidden gap-8 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-paper/70 sm:flex sm:right-10 lg:right-16"
      >
        <a href="#tratamentos" className="transition-colors hover:text-paper">
          Tratamentos
        </a>
        <a href="#clinica" className="transition-colors hover:text-paper">
          Clínica
        </a>
        <a href="#equipe" className="transition-colors hover:text-paper">
          Equipe
        </a>
        <a href="#agendar" className="transition-colors hover:text-paper">
          Agendar
        </a>
      </nav>
    </section>
  )
}
