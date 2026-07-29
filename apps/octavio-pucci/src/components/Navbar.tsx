import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { site, whatsappUrl } from '../data/site'

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
        scrolled || open
          ? 'border-b border-bone/10 bg-void/85 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#topo" className="flex items-center gap-3" data-cursor>
          <BrandMark className="h-9 w-9" />
          <span className="font-brand text-xl tracking-[0.12em] text-bone sm:text-2xl">
            OCTÁVIO PUCCI
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[12px] font-medium uppercase tracking-[0.22em] text-bone/65 transition hover:text-gold"
              data-cursor
            >
              {item.label}
            </a>
          ))}
          <a href={whatsappUrl()} className="cta-gold !py-2.5 !text-xs" data-cursor>
            Orçar agora
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-bone/15 text-bone lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-bone/10 bg-void px-5 py-6 lg:hidden"
        >
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-brand text-3xl tracking-[0.08em] text-bone"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappUrl()}
              className="cta-gold mt-2 justify-center"
              onClick={() => setOpen(false)}
            >
              Orçar pelo WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
