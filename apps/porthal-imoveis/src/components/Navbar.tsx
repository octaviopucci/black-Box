import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'

const links = [
  { href: '/#comprar', label: 'Comprar' },
  { href: '/#alugar', label: 'Alugar' },
  { href: '/#destaques', label: 'Sítios' },
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#financie', label: 'Financie' },
  { href: '/#contato', label: 'Contato' },
]

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const onHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
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

  const light = solid || scrolled || open || !onHome

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        light ? 'border-b border-line/70 bg-paper/90 backdrop-blur-2xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="relative z-10 flex items-center gap-3">
          <img src={site.logo} alt={site.name} className="h-10 w-auto object-contain sm:h-11" />
          <div className={light ? 'text-ink' : 'text-white'}>
            <p className="font-display text-xl font-semibold leading-none tracking-tight">Porthal</p>
            <p
              className={`mt-1 text-[10px] uppercase tracking-[0.3em] ${
                light ? 'text-mute' : 'text-white/65'
              }`}
            >
              Imóveis
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={onHome ? link.href.replace('/#', '#') : link.href}
              className={`text-[13px] font-medium tracking-wide transition ${
                light ? 'text-ink/70 hover:text-brand' : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-brand-deep"
          >
            WhatsApp
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className={`relative z-10 rounded-full p-2 xl:hidden ${light ? 'text-ink' : 'text-white'}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-line bg-paper px-5 py-8 xl:hidden"
          >
            <div className="flex flex-col gap-5">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={onHome ? link.href.replace('/#', '#') : link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl text-ink"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
