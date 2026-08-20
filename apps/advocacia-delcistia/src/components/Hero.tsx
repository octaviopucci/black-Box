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
          className="h-[115%] w-full object-cover object-[center_20%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-heroVeil" aria-hidden />
        <div className="absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
        <p className="mb-4 font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-bronze-soft">
          Direito Criminal · Sorocaba/SP
        </p>

        <div className="max-w-4xl">
          <h1 className="font-brand text-[clamp(2.6rem,7vw,5.4rem)] font-medium leading-[0.92] tracking-[-0.02em] text-paper">
            <span className="block font-script text-[clamp(3rem,8vw,6.2rem)] font-normal leading-[0.85] text-bronze-soft">
              Del Cistia
            </span>
            Advocacia criminal com preparo, ética e presença em plenário.
          </h1>

          <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-paper/80 md:text-lg">
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

        <div className="mt-10 flex flex-wrap items-center gap-4">
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

        <p className="mt-8 font-sans text-xs uppercase tracking-[0.22em] text-paper-mute">
          {site.plantao} · Desde {site.founded}
        </p>
      </div>
    </section>
  )
}
