import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset, careAreas } from '../data/site'
import { Reveal } from './Reveal'

gsap.registerPlugin(ScrollTrigger)

export function Score() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(max-width: 900px)').matches) return

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80)
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section id="cuidados" ref={sectionRef} className="relative bg-ink text-porcelain">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-20 sm:px-8 sm:pt-24">
        <Reveal>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.34em] text-gold-soft">
            Partitura de cuidados
          </p>
          <h2 className="display-title max-w-3xl text-[clamp(2.2rem,5vw,3.8rem)] text-porcelain">
            Uma clínica. Vários caminhos. Uma mesma afinação.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-porcelain/55">
            Estética, regeneração, nutrição, mente e hormônios — conectados para quem busca equilíbrio
            real.
          </p>
        </Reveal>
      </div>

      <div className="overflow-x-auto overflow-y-hidden pb-20 pt-6 lg:overflow-hidden">
        <div ref={trackRef} className="score-track gap-5 px-5 sm:gap-6 sm:px-8 lg:gap-8">
          {careAreas.map((area, i) => (
            <article
              key={area.id}
              data-cursor
              className="group relative w-[min(84vw,360px)] shrink-0 overflow-hidden rounded-[2rem] border border-porcelain/10 bg-ink-soft"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={asset(area.image)}
                  alt={area.title}
                  className="h-full w-full object-cover transition duration-700 ease-silk group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-soft via-transparent to-ink/20" />
                <span className="absolute left-5 top-5 rounded-full border border-porcelain/20 bg-ink/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-soft backdrop-blur">
                  {area.accent}
                </span>
              </div>
              <div className="p-6">
                <p className="font-display text-4xl text-gold/35">0{i + 1}</p>
                <h3 className="mt-1 font-display text-3xl font-semibold leading-tight">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm italic text-porcelain/70">{area.line}</p>
                <p className="mt-3 text-sm leading-relaxed text-porcelain/55">{area.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
