import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'

const links = [
  { to: '/imoveis', label: 'Imóveis' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/empresa', label: 'Empresa' },
  { to: '/avaliacao', label: 'Avaliação' },
  { to: '/contato', label: 'Contato' },
]

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const filled = solid || scrolled || open || !isHome

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
        filled
          ? 'border-b border-blue-deep/10 bg-snow/95 text-ink shadow-soft backdrop-blur-md'
          : 'bg-transparent text-white'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-shell items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label={site.brand}>
          <img
            src={site.logo}
            alt={site.name}
            className={`h-9 w-auto transition duration-500 sm:h-10 ${
              filled ? '' : 'brightness-0 invert'
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  filled
                    ? isActive
                      ? 'text-blue'
                      : 'text-mute hover:text-blue'
                    : isActive
                      ? 'text-gold'
                      : 'text-white/80 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="bg-gold px-5 py-2.5 text-sm font-semibold text-blue-deep transition hover:bg-gold-soft"
          >
            Falar no WhatsApp
          </a>
        </nav>

        <button
          type="button"
          className={`inline-flex h-10 w-10 items-center justify-center border lg:hidden ${
            filled ? 'border-line text-ink' : 'border-white/25 text-white'
          }`}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-snow lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="px-3 py-3 text-base font-medium text-ink hover:bg-blue-mist"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to="/anunciar" className="px-3 py-3 text-base font-medium text-ink hover:bg-blue-mist">
                Anunciar imóvel
              </Link>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="mt-2 bg-gold px-5 py-3 text-center text-sm font-semibold text-blue-deep"
              >
                Falar no WhatsApp
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
