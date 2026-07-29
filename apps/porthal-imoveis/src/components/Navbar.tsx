import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'

const links = [
  { href: '/#colecao', label: 'Coleção' },
  { href: '/#comprar', label: 'Comprar' },
  { href: '/#alugar', label: 'Alugar' },
  { href: '/#sobre', label: 'Porthal' },
  { href: '/#contato', label: 'Contato' },
]

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const light = solid || scrolled || open || !onHome

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
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
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto flex h-16 w-full max-w-7xl items-center justify-between rounded-full border px-4 transition-all duration-500 sm:px-6 ${
          light
            ? 'border-line/80 bg-paper/90 shadow-soft backdrop-blur-2xl'
            : 'border-white/15 bg-black/25 backdrop-blur-xl'
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <img src={site.logo} alt={site.name} className="h-9 w-auto object-contain" />
          <span className={`font-sans text-sm font-bold tracking-[0.18em] uppercase ${light ? 'text-ink' : 'text-white'}`}>
            Porthal
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={onHome ? l.href.replace('/#', '#') : l.href}
              className={`text-[12px] font-semibold uppercase tracking-[0.16em] transition ${
                light ? 'text-ink/65 hover:text-brand' : 'text-white/75 hover:text-white'
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-brand px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-brand-deep sm:inline-flex"
          >
            Atendimento
          </a>
          <button
            type="button"
            aria-label="Menu"
            className={`rounded-full p-2 lg:hidden ${light ? 'text-ink' : 'text-white'}`}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 w-full max-w-7xl rounded-3xl border border-line bg-paper p-6 shadow-lift lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={onHome ? l.href.replace('/#', '#') : l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl text-ink"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
