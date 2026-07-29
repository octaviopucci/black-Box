import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'

const links = [
  { href: '/imoveis?tx=sale', label: 'Comprar', hash: '#comprar' },
  { href: '/imoveis?tx=rent', label: 'Alugar', hash: '#alugar' },
  { href: '/#destaques', label: 'Sítios', hash: '#destaques' },
  { href: '/imoveis', label: 'Catálogo', hash: null },
  { href: '/#sobre', label: 'Sobre', hash: '#sobre' },
  { href: '/#contato', label: 'Contato', hash: '#contato' },
]

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const onHome = location.pathname === '/'

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

  const light = solid || scrolled || open || !onHome

  function resolveHref(link: (typeof links)[number]) {
    if (link.hash && onHome) return link.hash
    return link.href
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        light
          ? 'border-b border-line/80 bg-paper/92 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-[4.75rem] items-center justify-between">
        <Link to="/" className="relative z-10 flex items-center gap-3" aria-label={site.name}>
          <img src={site.logo} alt="" className="h-10 w-auto object-contain sm:h-11" />
          <div className={light ? 'text-ink' : 'text-white'}>
            <p className="font-display text-[1.65rem] leading-none tracking-tight">Porthal</p>
            <p
              className={`mt-1 text-[10px] uppercase tracking-[0.32em] ${
                light ? 'text-mute' : 'text-white/60'
              }`}
            >
              Imóveis
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 xl:flex" aria-label="Principal">
          {links.map((link) => (
            <a
              key={link.label}
              href={resolveHref(link)}
              className={`text-[13px] font-medium tracking-wide transition ${
                light ? 'text-ink/70 hover:text-brand' : 'text-white/78 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
            className="bg-brand px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-brand-deep"
          >
            Falar agora
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          className={`relative z-10 p-2 xl:hidden ${light ? 'text-ink' : 'text-white'}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-line bg-paper px-5 py-10 xl:hidden"
          >
            <div className="flex flex-col gap-6">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={resolveHref(link)}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="font-display text-4xl text-ink"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 w-fit"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
