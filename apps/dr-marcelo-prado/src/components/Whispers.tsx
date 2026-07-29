import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Whispers() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = root.querySelectorAll('[data-whisper]')
    const ctx = gsap.context(() => {
      items.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            delay: i * 0.05,
            scrollTrigger: { trigger: el, start: 'top 84%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative overflow-hidden bg-deep py-32 sm:py-40">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 md:pl-28">
        <div className="mb-16 flex items-end justify-between gap-6 border-b border-paper/10 pb-6">
          <p className="section-kicker">Vozes na calibração</p>
          <p className="hidden text-[11px] uppercase tracking-[0.28em] text-paper/30 sm:block">
            Relatos reais
          </p>
        </div>
        <div className="space-y-20 sm:space-y-28">
          {site.whispers.map((w, i) => (
            <blockquote
              key={w.who}
              data-whisper
              className={`relative max-w-2xl ${i % 2 === 1 ? 'ml-auto text-right' : ''}`}
            >
              <span
                aria-hidden
                className={`absolute -top-8 font-display text-7xl leading-none text-signal/15 ${
                  i % 2 === 1 ? 'right-0' : 'left-0'
                }`}
              >
                “
              </span>
              <p className="font-display text-[clamp(1.55rem,3.8vw,2.55rem)] font-medium italic leading-snug text-paper">
                {w.text}
              </p>
              <footer className="mt-6 text-[11px] uppercase tracking-[0.28em] text-champagne/70">
                {w.who}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
