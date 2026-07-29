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
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || !onHome || open
  const linkClass = solid ? 'text-ink/70 hover:text-ink' : 'text-snow/70 hover:text-snow'

  const navHref = (href: string) => (onHome ? href : `${import.meta.env.BASE_URL}${href}`)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-silk ${
        solid ? 'glass border-b border-line/60 shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label={`${site.name} — início`}>
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-semibold tracking-tight transition ${
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
                solid ? 'text-mute' : 'text-snow/45'
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
              href={navHref(item.href)}
              className={`text-[13px] font-semibold tracking-wide transition-colors ${linkClass}`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={bookingUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-aqua px-5 py-2.5 text-[13px] font-bold text-snow transition hover:bg-aqua-soft"
          >
            Agendar
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[68px] z-40 flex flex-col bg-fog/98 px-6 pb-10 pt-6 backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            {site.nav.map((item, i) => (
              <motion.a
                key={item.href}
                href={navHref(item.href)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className="border-b border-line py-5 font-display text-3xl font-semibold text-ink"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </motion.a>
            ))}
            <a
              href={bookingUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-aqua mt-8 w-fit"
              onClick={() => setOpen(false)}
            >
              Agendar consulta
            </a>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
