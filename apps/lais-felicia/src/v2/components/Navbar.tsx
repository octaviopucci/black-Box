import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../../data/site'
import { V2_BASE, v2Path } from '../base'
import { BrandMark } from './BrandMark'

function navTo(href: string) {
  return v2Path(href)
}

/** Navbar escura enquanto o hero (vídeo) ainda ocupa a tela — evita faixa clara ao rolar o scrub */
function useHeroNav() {
  const { pathname } = useLocation()
  const [onHero, setOnHero] = useState(pathname === V2_BASE)

  useEffect(() => {
    if (pathname !== V2_BASE) {
      setOnHero(false)
      return
    }

    const hero = document.querySelector<HTMLElement>('#topo[data-video-slot]')
    if (!hero) {
      setOnHero(false)
      return
    }

    const update = () => {
      const rect = hero.getBoundingClientRect()
      setOnHero(rect.bottom > 80)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    const observer = new ResizeObserver(update)
    observer.observe(hero)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
  }, [pathname])

  return onHero
}

export function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const onHero = useHeroNav()
  const onLight = !onHero

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
        onLight
          ? 'border-b border-ink/8 bg-surface/92 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link to={V2_BASE} className="relative z-10" aria-label={site.studio}>
          <BrandMark className="h-9 w-9 sm:h-10 sm:w-10" invert={onHero && !open} showWordmark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              to={navTo(item.href)}
              className={`text-[12px] font-display font-bold uppercase tracking-[0.16em] transition ${
                onLight ? 'text-ink-soft hover:text-gold-deep' : 'text-white/80 hover:text-gold'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappUrl()}
            className={`text-[12px] font-display font-bold uppercase tracking-[0.16em] ${
              onLight ? 'text-gold-deep' : 'text-gold-soft'
            }`}
          >
            Contato
          </a>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span
            className={`grid h-10 w-10 place-items-center rounded-full border ${
              onLight ? 'border-gold/40 text-gold-deep' : 'border-gold/40 text-gold-soft'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M6.5 4.5h2.2l1.1 3.2-1.5 1.5a12.5 12.5 0 0 0 6.5 6.5l1.5-1.5 3.2 1.1v2.2c0 .9-.7 1.6-1.6 1.6C10.6 19.1 4.9 13.4 4.9 6.1c0-.9.7-1.6 1.6-1.6Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="leading-tight">
            <p
              className={`text-[10px] uppercase tracking-[0.18em] ${
                onLight ? 'text-ink-mute' : 'text-white/45'
              }`}
            >
              Fale com a Laís
            </p>
            <a
              href={whatsappUrl()}
              className={`font-display text-sm font-bold ${onLight ? 'text-ink' : 'text-white'}`}
            >
              {site.phone.label}
            </a>
          </div>
        </div>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center border lg:hidden ${
            onLight ? 'border-ink/15 text-ink' : 'border-white/20 text-white'
          }`}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink/10 bg-surface px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                to={navTo(item.href)}
                className="font-display text-sm font-bold uppercase tracking-[0.16em] text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a href={whatsappUrl()} className="font-display text-sm font-bold uppercase tracking-[0.16em] text-gold-deep">
              Contato · {site.phone.label}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
