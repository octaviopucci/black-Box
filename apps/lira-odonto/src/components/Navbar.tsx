import { useEffect, useState } from 'react'
import { site, whatsappUrl } from '../data/site'

const links = [
  { href: '#procedimentos', label: 'Procedimentos' },
  { href: '#resultados', label: 'Resultados' },
  { href: '#equipe', label: 'Equipe' },
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth ${
        scrolled
          ? 'border-b border-line/10 bg-ink/90 py-3 backdrop-blur-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8">
        <a
          href="#topo"
          className="font-display text-lg tracking-tight text-paper transition-opacity hover:opacity-80"
        >
          {site.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-paper/70 transition-colors hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={whatsappUrl()}
          className="rounded-full border border-crystal/30 px-4 py-2 text-[13px] font-semibold text-paper transition-colors hover:border-crystal hover:bg-crystal/10"
        >
          WhatsApp
        </a>
      </div>
    </header>
  )
}
