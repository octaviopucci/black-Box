import { useEffect, useState } from 'react'
import { navLinks, site } from '@/data/site'

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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-chamber ${
        scrolled
          ? 'border-b border-line bg-ink/90 backdrop-blur-md'
          : 'bg-gradient-to-b from-ink/80 to-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#" className="group flex flex-col leading-none">
          <span className="font-sans text-[0.62rem] font-medium uppercase tracking-[0.28em] text-paper-mute transition-colors group-hover:text-bronze-soft">
            Advocacia
          </span>
          <span className="font-script text-[1.65rem] text-paper md:text-[1.85rem]">Del Cistia</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.18em] text-paper-mute transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={site.whatsapp.href}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-sm border border-bronze/40 bg-bronze/10 px-4 py-2 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-bronze-soft transition hover:border-bronze hover:bg-bronze/20 md:inline-flex"
        >
          Plantão 24h
        </a>
      </div>
    </header>
  )
}
