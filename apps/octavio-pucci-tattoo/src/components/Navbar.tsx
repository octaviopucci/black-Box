import { useEffect, useState } from 'react'
import { site } from '../data/site'

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
          ? 'border-b border-parchment/5 bg-obsidian/85 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="#topo"
          className="font-brand text-xl tracking-[0.14em] text-parchment sm:text-2xl"
        >
          {site.brand}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[10px] font-semibold uppercase tracking-[0.32em] text-parchment/50 transition-colors hover:text-parchment"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#orcar" className="cta-primary hidden px-5 py-2.5 md:inline-flex">
          Orçar
        </a>
      </div>
    </header>
  )
}
