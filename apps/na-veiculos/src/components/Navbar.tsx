import { useEffect, useState } from 'react'
import { Menu, X, MessageCircle } from 'lucide-react'
import { BrandMark } from './BrandMark'
import { site, whatsappHref } from '../data/site'

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
          ? 'border-b border-line bg-asphalt/85 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
        <BrandMark compact={scrolled} />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[12px] font-semibold uppercase tracking-[0.22em] text-chrome-mute transition hover:text-chrome-soft"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="cta-signal hidden sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center border border-line text-chrome lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-line bg-asphalt px-5 py-6 lg:hidden"
        >
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-display text-3xl uppercase tracking-[0.06em] text-chrome-soft"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="cta-signal mt-2 w-full"
              onClick={() => setOpen(false)}
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
