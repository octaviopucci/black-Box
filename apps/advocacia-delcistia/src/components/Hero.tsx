import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { media, site } from '@/data/site'
import { useReducedMotion } from '@/hooks/useMotion'

gsap.registerPlugin(ScrollTrigger)

function HeroContent({ reduced }: { reduced: boolean }) {
  const words = site.tagline.split(' ')

  return (
    <>
      <p className="mb-4 font-sans text-[0.65rem] font-medium uppercase tracking-[0.32em] text-bronze-soft">
        Direito Criminal · Sorocaba/SP
      </p>

      <div className="max-w-4xl">
        <h1 className="font-brand text-[clamp(1.85rem,5.8vw,5.4rem)] font-medium leading-[0.96] tracking-[-0.02em] text-paper md:leading-[0.92]">
          <span className="block font-script text-[clamp(2.2rem,7vw,6.2rem)] font-normal leading-[0.85] text-bronze-soft">
            Del Cistia
          </span>
          Advocacia criminal com preparo, ética e presença em plenário.
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
    </>
  )
}

export function Hero() {
  const reduced = useReducedMotion()
  const mediaRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reduced || !mediaRef.current || !sectionRef.current) return

    const mq = window.matchMedia('(min-width: 768px)')
    if (!mq.matches) return

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

  return (
    <section ref={sectionRef} className="relative md:min-h-[100svh] md:overflow-hidden">
      {/* Mobile: recorte da linha do peito pra cima — rostos visíveis, sem barriga das togas */}
      <div className="relative overflow-hidden border-b border-line bg-ink-lift md:hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <img
            src={media.hero}
            alt="Equipe da Advocacia Del Cistia em ambiente judiciário"
            className="absolute inset-x-0 top-0 h-[178%] w-full object-cover object-top"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Desktop: full-bleed com parallax */}
      <div ref={mediaRef} className="absolute inset-0 hidden will-change-transform md:block">
        <img
          src={media.hero}
          alt=""
          aria-hidden
          className="h-[115%] w-full object-cover object-[center_22%]"
        />
        <div className="absolute inset-0 bg-heroVeil" aria-hidden />
        <div
          className="absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t from-ink from-20% via-ink/90 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" aria-hidden />
      </div>

      {/* Mobile: copy abaixo da foto · Desktop: overlay na base */}
      <div className="relative z-10 mx-auto max-w-7xl bg-ink px-5 py-10 md:absolute md:inset-0 md:flex md:flex-col md:justify-end md:bg-transparent md:px-8 md:pb-24 md:pt-28">
        <HeroContent reduced={reduced} />
      </div>
    </section>
  )
}
