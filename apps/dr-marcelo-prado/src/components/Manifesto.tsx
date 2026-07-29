import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

const accents = ['calibram', 'método', 'presença', 'ritmo']

function renderLine(line: string) {
  const words = line.split(' ')
  return words.map((word, i) => {
    const clean = word.replace(/[.,—]/g, '').toLowerCase()
    const accent = accents.includes(clean)
    return (
      <span key={`${word}-${i}`}>
        <span className={accent ? 'text-signal' : undefined}>{word}</span>
        {i < words.length - 1 ? ' ' : null}
      </span>
    )
  })
}

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
        { y: 90, opacity: 0, rotateX: -16 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.15,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 68%' },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="essencia"
      ref={ref}
      className="relative scroll-mt-24 overflow-hidden bg-deep py-32 sm:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-signal/[0.06] blur-3xl"
      />
      <div className="mx-auto max-w-5xl px-5 sm:px-8 md:pl-28">
        <div className="mb-14 flex items-end justify-between gap-6 border-b border-paper/10 pb-6">
          <p className="section-kicker">Essência</p>
          <p className="hidden text-[11px] uppercase tracking-[0.28em] text-paper/30 sm:block">
            Calibração · Método · Escuta
          </p>
        </div>
        <div className="space-y-7 perspective-[1200px]">
          {site.manifesto.map((line) => (
            <p
              key={line}
              data-line
              className="section-title text-[clamp(1.9rem,5.8vw,3.85rem)] text-balance"
            >
              {renderLine(line)}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
