import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { BrandMark } from './BrandMark'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
        scrolled || open ? 'bg-paper/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#topo" className="relative z-10" aria-label={site.studio}>
          <BrandMark
            className="h-10 w-10 sm:h-11 sm:w-11"
            invert={!(scrolled || open)}
            showWordmark
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition hover:text-rose-deep ${
                scrolled ? 'text-ink/70' : 'text-paper/80'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a href={whatsappUrl()} className="cta-rose !py-2.5 !text-xs">
            Agendar
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <a href={whatsappUrl()} className="cta-rose !px-3.5 !py-2 !text-xs">
            Agendar
          </a>
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center border ${
              scrolled || open ? 'border-ink/15 text-ink' : 'border-paper/30 text-paper'
            }`}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-ash-line bg-paper/95 px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-base font-medium text-ink/90"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
