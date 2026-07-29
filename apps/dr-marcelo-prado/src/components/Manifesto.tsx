import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lines = root.querySelectorAll('[data-line]')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: 80, opacity: 0, rotateX: -18 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 70%' },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="essencia"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden bg-deep py-28 sm:py-36"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-8 md:pl-28">
        <p className="mb-10 text-[11px] font-semibold uppercase tracking-[0.38em] text-signal/70">
          Essência
        </p>
        <div className="space-y-6 perspective-[1000px]">
          {site.manifesto.map((line) => (
            <p
              key={line}
              data-line
              className="font-display text-[clamp(1.85rem,5.5vw,3.6rem)] font-medium leading-[1.12] tracking-tight text-paper"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
