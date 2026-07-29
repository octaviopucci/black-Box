import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { bookingUrl, site } from '../data/site'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const onHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const solid = scrolled || !onHome || open
  const linkClass = solid ? 'text-ink/75 hover:text-ink' : 'text-snow/75 hover:text-snow'

  const navHref = (href: string) =>
    onHome ? href : `${import.meta.env.BASE_URL}${href}`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'glass border-b border-line/70 shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label={`${site.name} — início`}>
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-semibold tracking-tight ${
              solid ? 'bg-ink text-snow' : 'bg-snow/10 text-snow ring-1 ring-snow/20'
            }`}
          >
            {site.shortName}
          </span>
          <span className="leading-tight">
            <span
              className={`block font-display text-lg font-bold tracking-tight ${
                solid ? 'text-ink' : 'text-snow'
              }`}
            >
              {site.name}
            </span>
            <span
              className={`block text-[10px] font-semibold uppercase tracking-[0.22em] ${
                solid ? 'text-mute' : 'text-snow/50'
              }`}
            >
              {site.specialty}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <a key={item.href} href={navHref(item.href)} className={`text-sm font-semibold transition-colors ${linkClass}`}>
              {item.label}
            </a>
          ))}
          <a
            href={bookingUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-aqua px-5 py-2.5 text-sm font-bold text-snow transition hover:bg-aqua-soft"
          >
            Agendar consulta
          </a>
        </nav>

        <button
          type="button"
          className={`rounded-full p-2.5 lg:hidden ${solid ? 'text-ink' : 'text-snow'}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line/50 lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {site.nav.map((item) => (
                <a
                  key={item.href}
                  href={navHref(item.href)}
                  className="rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-fog-soft"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={bookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-sm font-bold text-snow"
                onClick={() => setOpen(false)}
              >
                Agendar consulta
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
