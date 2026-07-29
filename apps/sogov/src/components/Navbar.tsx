import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, UserRound, X } from 'lucide-react'
import { GovLogo } from './GovLogo'

const links = [
  { href: '#busca', label: 'Buscar serviços' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#perfis', label: 'Por perfil' },
  { href: '#jornada', label: 'Como funciona' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 ${scrolled || open ? 'shadow-soft' : ''}`}
    >
      <div className="flag-stripe h-1.5 w-full" aria-hidden />
      <div
        className={`border-b border-line/70 bg-white/95 backdrop-blur-md transition ${
          scrolled ? 'bg-white' : ''
        }`}
      >
        <div className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#topo" aria-label="gov.br — início">
            <GovLogo />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-ink/80 transition hover:text-gov"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#busca"
              className="inline-flex items-center gap-2 rounded bg-gov px-4 py-2.5 text-sm font-bold text-white shadow-gov transition hover:bg-gov-light"
            >
              <UserRound className="h-4 w-4" />
              Entrar com gov.br
            </a>
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-line text-gov lg:hidden"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-line px-5 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-semibold text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#busca"
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded bg-gov px-4 py-3 text-sm font-bold text-white"
              >
                <UserRound className="h-4 w-4" />
                Entrar com gov.br
              </a>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  )
}
