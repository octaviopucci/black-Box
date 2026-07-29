import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'

const links = [
  { href: '#imoveis', label: 'Imóveis' },
  { href: '#destaques', label: 'Sítios' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#financie', label: 'Financie' },
  { href: '#contato', label: 'Contato' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'border-b border-line/80 bg-paper/90 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#topo" className="relative z-10 flex items-center gap-3">
          <img
            src={site.logo}
            alt={site.name}
            className="h-11 w-auto object-contain sm:h-12"
          />
          <div className={`${scrolled || open ? 'text-ink' : 'text-white'} hidden sm:block`}>
            <p className="font-display text-xl font-semibold leading-none tracking-tight">
              Porthal
            </p>
            <p
              className={`mt-1 text-[10px] uppercase tracking-[0.28em] ${
                scrolled || open ? 'text-mute' : 'text-white/70'
              }`}
            >
              Imóveis
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition ${
                scrolled ? 'text-ink/75 hover:text-brand' : 'text-white/85 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
          >
            Falar no WhatsApp
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className={`relative z-10 rounded-full p-2 lg:hidden ${
            scrolled || open ? 'text-ink' : 'text-white'
          }`}
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
            className="border-t border-line bg-paper px-5 py-8 lg:hidden"
          >
            <div className="flex flex-col gap-5">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl text-ink"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
              >
                Falar no WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
