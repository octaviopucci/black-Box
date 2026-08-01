import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { BrandMark } from './BrandMark'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
        scrolled ? 'bg-navy/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#topo" className="relative z-10" aria-label="G&L Locações">
          <BrandMark className="h-11 w-11 sm:h-12 sm:w-12" showWordmark />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-paper/75 transition hover:text-sun"
            >
              {item.label}
            </a>
          ))}
          <a href={whatsappUrl()} className="cta-sun !py-2.5 !text-xs">
            Reservar
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-paper/20 text-paper lg:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-navy/95 px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base font-medium text-paper/90"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappUrl()}
              className="cta-sun mt-2 justify-center"
              onClick={() => setOpen(false)}
            >
              Reservar no WhatsApp
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
