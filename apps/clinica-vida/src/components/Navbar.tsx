import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { BrandMark } from './BrandMark'
import { InstagramIcon } from './InstagramIcon'

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

  const onDark = !scrolled && !open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
        scrolled || open ? 'glass border-b border-ink/5' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#topo" className="group flex items-center gap-2.5 sm:gap-3" aria-label={site.fullName}>
          <BrandMark
            tone="vida"
            className="h-7 w-7 transition duration-500 group-hover:scale-105 sm:h-8 sm:w-8"
          />
          <span
            className={`font-display text-xl font-semibold tracking-[0.14em] transition-colors duration-500 sm:text-2xl sm:tracking-[0.16em] ${
              onDark ? 'text-paper' : 'text-ink'
            }`}
          >
            VIDA
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-xs font-medium uppercase tracking-[0.22em] transition ${
                onDark ? 'text-paper/65 hover:text-paper' : 'text-ink/55 hover:text-ink'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className={`rounded-full p-2 transition ${
              onDark ? 'text-paper/70 hover:text-vida-soft' : 'text-ink/60 hover:text-vida-deep'
            }`}
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a href={whatsappUrl()} className={onDark ? 'cta-vida' : 'cta-ink'}>
            Agendar
          </a>
        </div>

        <button
          type="button"
          className={`rounded-full border p-2 transition lg:hidden ${
            onDark ? 'border-paper/25 text-paper' : 'border-ink/10 text-ink'
          }`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.nav
          id="mobile-nav"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-ink/5 px-5 pb-8 pt-4 lg:hidden"
        >
          <ul className="flex flex-col gap-4">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-display text-3xl text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={whatsappUrl()} className="cta-vida mt-8" onClick={() => setOpen(false)}>
            Agendar pelo WhatsApp
          </a>
        </motion.nav>
      )}
    </header>
  )
}
