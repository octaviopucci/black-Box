import { useEffect, useState } from 'react'
import { brand, nav } from '@/data/site'

export default function Nav() {
  const [onHero, setOnHero] = useState(true)

  useEffect(() => {
    const hero = document.getElementById('inicio')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setOnHero(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const tone = onHero
    ? 'text-paper/90 [&_a:hover]:text-paper'
    : 'text-ink/80 [&_a:hover]:text-accent'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-5 py-6 transition-colors duration-500 md:px-10 ${tone}`}
    >
      <div className="mx-auto flex max-w-[90rem] items-end justify-between gap-6">
        <a
          href="#inicio"
          className={`font-sans text-[0.68rem] font-medium uppercase tracking-mark transition-colors ${
            onHero ? 'text-paper/70' : 'text-mute'
          }`}
        >
          Sorocaba
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.slice(1).map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-[0.72rem] font-medium uppercase tracking-mark transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={brand.instagramDm}
          target="_blank"
          rel="noopener noreferrer"
          className={`border-b pb-0.5 text-[0.72rem] font-medium uppercase tracking-mark transition-colors ${
            onHero ? 'border-paper/40 text-paper' : 'border-ink/25 text-ink'
          }`}
        >
          Instagram
        </a>
      </div>
    </header>
  )
}
