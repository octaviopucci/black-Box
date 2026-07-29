import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '../data/site'
import { Reveal, SectionHeading } from './Reveal'

gsap.registerPlugin(ScrollTrigger)

export function Legacy() {
  const yearRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = yearRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = String(site.since)
      return
    }
    const obj = { n: 1900 }
    const tween = gsap.to(obj, {
      n: site.since,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(obj.n))
      },
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <section id="legado" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden bg-navy text-white">
            <img
              src={`${import.meta.env.BASE_URL}hero-2.jpg`}
              alt="Capão Bonito"
              className="aspect-[4/5] w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-soft">
                Família Santos Mariano
              </p>
              <p className="mt-3 font-display text-4xl font-semibold leading-none sm:text-5xl">
                <span ref={yearRef}>1955</span>
                <span className="text-gold"> →</span> hoje
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading
            eyebrow="Legado"
            title="Uma empresa de visão — e bastante solidez"
            subtitle={site.mission}
          />
          <div className="mt-8 space-y-5">
            {site.about.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p className="text-base leading-relaxed text-mute sm:text-[1.05rem]">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.25} className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {[
              { label: 'Anos de tradição', value: `${new Date().getFullYear() - site.since}+` },
              { label: 'Cidades atendidas', value: String(site.cities.length) },
              { label: 'Foco', value: '100%' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-semibold text-navy sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-mute">
                  {stat.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
