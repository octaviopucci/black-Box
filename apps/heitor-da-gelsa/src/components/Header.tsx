import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { navLinks, siteConfig } from '@/data/site'
import { useScrollHeader } from '@/hooks/useMotion'
import { Button } from './Button'

export function Header() {
  const scrolled = useScrollHeader()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleNav = (href: string) => {
    setOpen(false)
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '')
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-green/10 bg-paper/92 shadow-header backdrop-blur-lg'
            : 'bg-gradient-to-b from-green-deep/80 to-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/#inicio" className="group flex items-center gap-3" aria-label="Heitor da Gelsa — início">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-green-deep shadow-card">
              <span className="absolute inset-x-0 top-0 h-1.5 bg-yellow" />
              <span className="absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full bg-blue-support/90" />
              <span className="font-display text-sm font-black tracking-wide text-white">HG</span>
            </span>
            <span className="leading-none">
              <span
                className={`block font-display text-sm font-black tracking-[0.2em] ${
                  scrolled ? 'text-green-deep' : 'text-white'
                }`}
              >
                {siteConfig.nameLines[0]}
              </span>
              <span
                className={`block font-display text-[11px] font-bold tracking-[0.32em] ${
                  scrolled ? 'text-green' : 'text-yellow'
                }`}
              >
                {siteConfig.nameLines[1]}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => handleNav(link.href)}
                className={`relative text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:bg-yellow after:transition-all hover:after:w-full ${
                  scrolled ? 'text-graphite hover:text-green-deep' : 'text-white/90 hover:text-yellow'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button
              href={`https://wa.me/${siteConfig.whatsapp}`}
              variant={scrolled ? 'primary' : 'outline-white'}
              external
            >
              Fale com Heitor
            </Button>
          </div>

          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-sm border transition-colors lg:hidden ${
              scrolled
                ? 'border-green/15 text-green-deep hover:bg-green/5'
                : 'border-white/20 text-white hover:bg-white/10'
            }`}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-green-deep lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-grain opacity-[0.06]" aria-hidden />
            <nav className="relative flex h-full flex-col justify-center gap-5 px-8" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => handleNav(link.href)}
                    className="font-display text-[clamp(2rem,8vw,3rem)] font-black uppercase tracking-tight text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Button href={`https://wa.me/${siteConfig.whatsapp}`} variant="primary" external className="mt-6 w-full">
                Fale com Heitor
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
