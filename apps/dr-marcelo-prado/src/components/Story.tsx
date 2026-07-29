import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset, site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Story() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-story]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.05,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 72%' },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="presenca"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden bg-paper py-32 text-ink sm:py-40"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 md:grid-cols-12 md:gap-12 md:pl-28">
        <div className="md:col-span-5">
          <div className="relative overflow-hidden">
            <motion.div style={{ y }}>
              <img
                src={asset('hero-event.jpg')}
                alt={site.name}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/10" />
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.28em] text-mute">
            Capão Bonito · Itapeva · On-line
          </p>
        </div>

        <div className="md:col-span-7">
          <p data-story className="text-[11px] font-semibold uppercase tracking-section text-mute">
            Presença
          </p>
          <h2
            data-story
            className="mt-4 font-display text-[clamp(2.3rem,5.2vw,3.7rem)] font-semibold leading-[1.04] tracking-tight"
          >
            Ciência com elegância humana
          </h2>
          <p
            data-story
            className="mt-6 font-display text-xl italic leading-snug text-mute sm:text-2xl"
          >
            “Cada protocolo nasce do seu histórico — não de um protocolo genérico.”
          </p>
          <div className="mt-8 space-y-5">
            {site.story.map((p) => (
              <p key={p} data-story className="text-base leading-relaxed text-mute sm:text-lg">
                {p}
              </p>
            ))}
          </div>

          <div data-story className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
            {[
              { k: site.crm, v: 'Registro profissional' },
              { k: 'Presencial', v: 'Duas cidades' },
              { k: 'On-line', v: 'Brasil inteiro' },
            ].map((item) => (
              <div key={item.k}>
                <p className="font-display text-xl font-semibold tracking-tight">{item.k}</p>
                <p className="mt-1.5 text-sm text-mute">{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
