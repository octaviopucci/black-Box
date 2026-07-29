import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '../data/site'
import { Reveal } from './Reveal'

gsap.registerPlugin(ScrollTrigger)

export function Credo() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-credo-line]',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 0.8,
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="credo"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-line px-5 py-24 sm:px-8 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-gold" />
            Credo
          </p>
        </Reveal>

        <div className="mt-10 space-y-4 sm:mt-14 sm:space-y-6">
          {site.manifesto.map((line) => (
            <p
              key={line}
              data-credo-line
              className="font-display text-[clamp(1.85rem,5.5vw,3.75rem)] leading-[1.08] text-bone"
            >
              {line}
            </p>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-12 max-w-2xl sm:mt-16">
          <p className="text-base leading-relaxed text-ash sm:text-lg">
            {site.story[0]} {site.story[1]}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-3 gap-4 border-y border-line py-8 sm:mt-20 sm:gap-8">
          {[
            { value: `${site.years}+`, label: 'Anos de ofício' },
            { value: '321', label: 'Marcas no arquivo' },
            { value: site.followers, label: 'No Instagram' },
          ].map((stat) => (
            <Reveal key={stat.label}>
              <p className="font-brand text-3xl tracking-[0.06em] text-gold sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-ash">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
