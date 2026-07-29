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

  const linkClass = scrolled || !onHome || open
    ? 'text-ink/80 hover:text-ink'
    : 'text-snow/80 hover:text-snow'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'glass border-b border-line/60 shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label={`${site.name} — início`}
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-semibold tracking-tight transition-colors ${
              scrolled || !onHome || open
                ? 'bg-void text-signal'
                : 'bg-snow/10 text-signal signal-ring'
            }`}
          >
            {site.shortName}
          </span>
          <span className="leading-tight">
            <span
              className={`block font-display text-lg font-semibold tracking-tight ${
                scrolled || !onHome || open ? 'text-ink' : 'text-snow'
              }`}
            >
              {site.name}
            </span>
            <span
              className={`block text-[11px] font-medium uppercase tracking-[0.22em] ${
                scrolled || !onHome || open ? 'text-mute' : 'text-snow/55'
              }`}
            >
              {site.specialty}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={
                onHome
                  ? item.href
                  : `${import.meta.env.BASE_URL}${item.href.replace(/^#/, '#')}`
              }
              className={`text-sm font-medium transition-colors ${linkClass}`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={bookingUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-void transition hover:bg-signal-soft"
          >
            Agendar consulta
          </a>
        </nav>

        <button
          type="button"
          className={`rounded-full p-2.5 lg:hidden ${
            scrolled || !onHome || open ? 'text-ink' : 'text-snow'
          }`}
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
                  href={
                    onHome
                      ? item.href
                      : `${import.meta.env.BASE_URL}${item.href.replace(/^#/, '#')}`
                  }
                  className="rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-celadon-mist/50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={bookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 rounded-full bg-void px-5 py-3 text-center text-sm font-semibold text-signal"
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
