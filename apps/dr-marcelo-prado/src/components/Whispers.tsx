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
          { opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="relative overflow-hidden bg-deep py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 md:pl-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-signal/70">
          Vozes na calibração
        </p>
        <div className="mt-14 space-y-16 sm:space-y-24">
          {site.whispers.map((w, i) => (
            <blockquote
              key={w.who}
              data-whisper
              className={`max-w-2xl ${i % 2 === 1 ? 'ml-auto text-right' : ''}`}
            >
              <p className="font-display text-[clamp(1.6rem,4vw,2.6rem)] font-medium italic leading-snug text-paper">
                “{w.text}”
              </p>
              <footer className="mt-5 text-xs uppercase tracking-[0.28em] text-signal/70">
                {w.who}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
