import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { asset, site, whatsappUrl } from '../data/site'
import { BrandMark } from './BrandMark'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
        solid ? 'glass shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8 sm:py-4">
        <a href="#topo" className="group flex items-center gap-2.5" data-cursor>
          <img
            src={asset('brand/logo-profile.jpg')}
            alt=""
            className="h-9 w-9 rounded-full object-cover ring-1 ring-wine/20"
          />
          <span
            className={`font-display text-lg font-semibold leading-none tracking-tight sm:text-xl ${
              solid ? 'text-ink' : 'text-cream'
            }`}
          >
            Danielle
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-[11px] font-medium uppercase tracking-[0.22em] transition ${
                solid ? 'text-ink/55 hover:text-wine' : 'text-cream/70 hover:text-cream'
              }`}
              data-cursor
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl()}
            className={`hidden rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition sm:inline-flex ${
              solid
                ? 'bg-wine text-cream hover:bg-wine-soft'
                : 'bg-cream/15 text-cream hover:bg-cream/25'
            }`}
            data-cursor
          >
            Agendar
          </a>
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${
              solid ? 'border-ink/10 text-ink' : 'border-cream/25 text-cream'
            }`}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line/60 bg-cream px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-display text-3xl text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappUrl()}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-wine px-5 py-3.5 text-sm font-semibold text-cream"
              onClick={() => setOpen(false)}
            >
              <BrandMark tone="cream" className="h-5 w-5" />
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
