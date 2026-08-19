import { useEffect, useState } from 'react'
import { site } from '@/data/site'

const links = [
  { href: '#ambientes', label: 'Ambientes' },
  { href: '#portfolio', label: 'Projetos' },
  { href: '#processo', label: 'Processo' },
  { href: '#contato', label: 'Contato' },
]

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
        scrolled ? 'bg-ink/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
        <a href="#" className="group flex flex-col leading-none">
          <span className="font-brand text-[11px] font-medium uppercase tracking-[0.38em] text-brass/80 transition group-hover:text-brass">
            Marcenaria
          </span>
          <span className="font-brand text-2xl font-semibold tracking-tight text-paper md:text-[1.65rem]">
            Noé
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-light tracking-wide text-paper/70 transition hover:text-brass"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={site.links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-light tracking-wide text-paper/60 transition hover:text-brass"
          aria-label="Instagram @marcenarianoe"
        >
          @{site.handle}
        </a>
      </nav>
    </header>
  )
}
