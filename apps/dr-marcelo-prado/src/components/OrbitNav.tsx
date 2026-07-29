import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { bookingUrl, site } from '../data/site'

const links = [
  { href: '#essencia', label: 'Essência' },
  { href: '#corredor', label: 'Cuidado' },
  { href: '#presenca', label: 'Presença' },
  { href: '#harmonie', label: 'Harmonie' },
  { href: '#limiar', label: 'Agendar' },
]

export function OrbitNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
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
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className={`mx-auto flex max-w-6xl items-center justify-between px-3 py-2.5 transition-all duration-500 ease-silk md:pl-4 ${
            scrolled
              ? 'rounded-full bg-void/75 shadow-soft backdrop-blur-xl ring-1 ring-signal/15'
              : ''
          }`}
        >
          <Link to="/" className="flex items-center gap-3" aria-label={site.name}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-signal/12 font-display text-sm font-semibold text-signal ring-1 ring-signal/25">
              {site.shortName}
            </span>
            <span className="hidden font-display text-xl tracking-tight text-paper sm:block">
              {site.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[11px] font-medium uppercase tracking-[0.24em] text-paper/50 transition hover:text-signal"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={bookingUrl()}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-signal px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-void transition hover:bg-mist sm:inline-flex"
            >
              Agendar
            </a>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center text-paper lg:hidden"
              aria-label={open ? 'Fechar' : 'Menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 h-px w-full bg-paper transition ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-px w-full bg-paper transition ${open ? 'opacity-0' : ''}`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-paper transition ${open ? 'top-1.5 -rotate-45' : 'top-3'}`}
                />
              </span>
            </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-void/97 px-6 pb-14 pt-28 backdrop-blur-xl lg:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="border-b border-paper/10 py-5 font-display text-4xl text-paper"
              >
                {l.label}
              </motion.a>
            ))}
            <a
              href={bookingUrl()}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="cta-primary mt-8 w-fit"
            >
              Agendar consulta
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
