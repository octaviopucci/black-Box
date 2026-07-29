import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'

const links = [
  { href: '/#imoveis', label: 'Imóveis' },
  { href: '/#servicos', label: 'Serviços' },
  { href: '/#legado', label: 'Legado' },
  { href: '/#contato', label: 'Contato' },
]

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname, location.hash])

  const filled = solid || scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
        filled ? 'bg-navy/95 text-white shadow-soft backdrop-blur-md' : 'bg-transparent text-white'
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src={site.logo}
            alt={site.name}
            className="h-9 w-auto brightness-0 invert transition duration-500 group-hover:opacity-90 sm:h-10"
          />
          <span className="hidden font-display text-lg font-semibold tracking-tight sm:block">
            Márcio Mariano
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/75 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold-soft"
          >
            Falar agora
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 md:hidden"
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
            className="overflow-hidden border-t border-white/10 bg-navy md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-full bg-gold px-5 py-3 text-center text-sm font-semibold text-navy"
              >
                Falar agora
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
