import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { site, whatsappUrl } from '@/data/site'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#cuidados', label: 'Tratamentos' },
  { href: '#dicas', label: 'Dicas' },
  { href: '#transformacao', label: 'Resultados' },
  { href: '#contato', label: 'Contato' },
]

export function Header() {
  const reduced = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const light = !scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        light
          ? 'bg-transparent'
          : 'border-b border-mar-line/80 bg-mar-paper/95 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
        <a
          href="#"
          className="group flex items-baseline gap-2"
          aria-label={site.name}
        >
          <span
            className={`font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-none tracking-tight transition-colors ${
              light ? 'text-white' : 'text-mar-ink'
            }`}
          >
            {site.shortName}
          </span>
          <span
            className={`hidden text-[0.65rem] uppercase tracking-[0.28em] sm:inline ${
              light ? 'text-white/70' : 'text-mar-ink-soft'
            }`}
          >
            Odontologia
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[0.72rem] uppercase tracking-[0.2em] transition-colors ${
                light
                  ? 'text-white/80 hover:text-white'
                  : 'text-mar-ink-soft hover:text-mar-ink'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <motion.a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-full px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] transition-colors ${
            light
              ? 'border border-white/35 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
              : 'bg-mar-peach text-[#1a1512] hover:bg-mar-peach-deep hover:text-white'
          }`}
          whileHover={reduced ? undefined : { scale: 1.02 }}
          whileTap={reduced ? undefined : { scale: 0.98 }}
        >
          Agendar
        </motion.a>
      </div>
    </header>
  )
}
