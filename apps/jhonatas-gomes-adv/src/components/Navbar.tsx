import { useEffect, useState } from 'react'
import { site, whatsappUrl } from '@/data/site'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/10 bg-ink/85 backdrop-blur-xl'
          : 'bg-gradient-to-b from-ink/70 to-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#inicio" className="group">
          <span className="block font-display text-xl font-semibold tracking-tight text-snow md:text-2xl">
            {site.name}
          </span>
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-soft/90">
            {site.role}
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium tracking-wide text-paper/75 transition-colors hover:text-gold-soft"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm bg-gold px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ink transition hover:bg-gold-soft"
        >
          Falar agora
        </a>
      </div>
    </header>
  )
}
