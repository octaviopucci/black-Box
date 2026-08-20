import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { media, site } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMotion'

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const reduced = useReducedMotion()
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !mediaRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(mediaRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: mediaRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [reduced])

  const words = site.tagline.split(' ')

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <img
          src={media.hero}
          alt="Equipe da Advocacia Del Cistia em ambiente judiciário"
          className="h-[120%] w-full object-cover object-[center_18%] md:object-[center_20%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-heroVeil" aria-hidden />
        <div
          className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink from-25% via-ink/92 to-transparent md:h-[48%] md:from-15%"
          aria-hidden
        />
        <div className="absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col px-5 md:px-8">
        {/* Reserva a metade superior no mobile para os rostos ficarem visíveis */}
        <div className="min-h-[46svh] shrink-0 md:hidden" aria-hidden />

        <div className="mt-auto pb-12 pt-6 md:min-h-[100svh] md:justify-end md:pb-24 md:pt-28">
          <p className="mb-4 font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-bronze-soft">
            Direito Criminal · Sorocaba/SP
          </p>

          <div className="max-w-4xl">
            <h1 className="font-brand text-[clamp(2rem,6.5vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.02em] text-paper md:leading-[0.92]">
              <span className="block font-script text-[clamp(2.4rem,7.5vw,6.2rem)] font-normal leading-[0.85] text-bronze-soft">
                Del Cistia
              </span>
              <span className="md:block">
                Advocacia criminal com preparo, ética e presença em plenário.
              </span>
            </h1>

            <p className="mt-5 max-w-xl font-sans text-[0.95rem] font-light leading-relaxed text-paper/80 md:mt-6 md:text-lg">
              {reduced ? (
                site.tagline
              ) : (
                <span aria-label={site.tagline}>
                  {words.map((word, i) => (
                    <motion.span
                      key={`${word}-${i}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + i * 0.04, duration: 0.5 }}
                      className="mr-[0.28em] inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              )}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-10">
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-sm bg-bronze px-7 py-3.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-bronze-soft"
            >
              Falar com o escritório
            </a>
            <a
              href="#atuacao"
              className="inline-flex items-center justify-center rounded-sm border border-paper/25 px-7 py-3.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-paper transition hover:border-paper/50 hover:bg-paper/5"
            >
              Áreas de atuação
            </a>
          </div>

          <p className="mt-6 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-paper-mute md:mt-8 md:text-xs">
            {site.plantao} · Desde {site.founded}
          </p>
        </div>
      </div>
    </section>
  )
}
