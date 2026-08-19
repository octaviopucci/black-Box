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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 box-border py-6 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] transition-colors duration-500 sm:pl-8 sm:pr-8 md:pl-10 md:pr-10 ${
        onHero ? 'text-white' : 'text-ink/80'
      }`}
    >
      <div className="flex w-full min-w-0 items-end justify-between gap-4">
        <a
          href="#inicio"
          className={`shrink-0 font-sans text-[0.68rem] font-medium uppercase tracking-mark transition-colors ${
            onHero ? 'text-white' : 'text-mute'
          }`}
        >
          Sorocaba
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.slice(1).map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`text-[0.72rem] font-medium uppercase tracking-mark transition-colors ${
                onHero ? 'text-white hover:text-white/80' : 'hover:text-accent'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={brand.instagramDm}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 border-b pb-0.5 text-[0.72rem] font-medium uppercase tracking-mark transition-colors ${
            onHero ? 'border-white/50 text-white hover:border-white' : 'border-ink/25 text-ink'
          }`}
        >
          Instagram
        </a>
      </div>
    </header>
  )
}
