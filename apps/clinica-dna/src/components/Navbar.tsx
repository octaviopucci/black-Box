import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'

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
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-silk ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <div
            className={`flex w-full items-center justify-between gap-4 rounded-full px-3 py-2 transition-all duration-500 ease-silk sm:px-4 ${
              scrolled ? 'glass shadow-soft' : 'bg-transparent'
            }`}
          >
            <Link to="/" className="group flex items-center gap-3" aria-label={site.name}>
              <img
                src={site.logo}
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-1 ring-aqua/30 sm:h-11 sm:w-11"
              />
              <div className="leading-none">
                <p className="font-display text-2xl font-semibold tracking-tight text-navy transition group-hover:text-aqua-deep sm:text-[1.65rem]">
                  {site.shortName}
                </p>
                <p className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.28em] text-mute sm:block">
                  Clínica
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
              {site.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-[13px] font-medium text-ink/75 transition hover:text-navy"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="hidden rounded-full bg-navy px-5 py-2.5 text-[13px] font-semibold text-snow transition hover:bg-abyss sm:inline-flex"
              >
                Agendar
              </a>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-navy lg:hidden"
                aria-label={open ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-abyss/95 px-6 pb-10 pt-28 lg:hidden"
          >
            <nav className="flex flex-col gap-6" aria-label="Mobile">
              {site.nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="font-display text-4xl font-semibold text-snow"
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href={whatsappUrl()}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-4 inline-flex w-fit rounded-full bg-aqua px-6 py-3 text-sm font-semibold text-abyss"
              >
                Agendar no WhatsApp
              </motion.a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
