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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-line bg-ink/85 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
        <a
          href="#"
          className="font-display text-xs font-medium uppercase tracking-[0.28em] text-paper/70 transition hover:text-paper"
        >
          {site.handle}
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-normal uppercase tracking-[0.22em] text-paper/55 transition hover:text-enamel-soft"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={site.links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium uppercase tracking-[0.2em] text-enamel-soft transition hover:text-paper"
        >
          Instagram
        </a>
      </div>
    </header>
  )
}
