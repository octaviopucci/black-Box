import { useEffect, useState } from 'react'

const sections = [
  { id: 'imersao', label: '01' },
  { id: 'essencia', label: '02' },
  { id: 'corredor', label: '03' },
  { id: 'presenca', label: '04' },
  { id: 'harmonie', label: '05' },
  { id: 'limiar', label: '06' },
]

export function SectionRail() {
  const [active, setActive] = useState('imersao')

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActive(visible.target.id)
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.15, 0.4, 0.7] },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Progresso da experiência"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 xl:flex"
    >
      {sections.map((s) => {
        const on = active === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="pointer-events-auto group flex items-center gap-3"
            aria-current={on ? 'true' : undefined}
          >
            <span
              className={`text-[10px] uppercase tracking-[0.28em] transition duration-500 ${
                on ? 'text-signal' : 'text-paper/25 group-hover:text-paper/55'
              }`}
            >
              {s.label}
            </span>
            <span
              className={`block h-px transition-all duration-500 ease-silk ${
                on ? 'w-8 bg-signal' : 'w-3 bg-paper/25 group-hover:w-5 group-hover:bg-paper/50'
              }`}
            />
          </a>
        )
      })}
    </nav>
  )
}
