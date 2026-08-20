import { useReducedMotion } from '@/hooks/useReducedMotion'
import { site, whatsappUrl } from '@/data/site'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '#cuidados', label: 'Cuidados' },
  { href: '#transformacao', label: 'Resultados' },
  { href: '#instagram', label: 'Instagram' },
  { href: '#contato', label: 'Contato' },
]

export function Header() {
  const reduced = useReducedMotion()

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10">
        <a
          href="#"
          className="group flex items-baseline gap-2 text-mar-paper"
          aria-label={site.name}
        >
          <span className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-none tracking-tight">
            {site.shortName}
          </span>
          <span className="hidden text-[0.65rem] uppercase tracking-[0.28em] text-mar-paper/70 sm:inline">
            Odontologia
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.72rem] uppercase tracking-[0.22em] text-mar-paper/75 transition-colors hover:text-mar-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <motion.a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-mar-paper/35 bg-mar-paper/10 px-4 py-2 text-[0.72rem] uppercase tracking-[0.18em] text-mar-paper backdrop-blur-sm transition-colors hover:bg-mar-paper/20"
          whileHover={reduced ? undefined : { scale: 1.02 }}
          whileTap={reduced ? undefined : { scale: 0.98 }}
        >
          Agendar
        </motion.a>
      </div>
    </header>
  )
}
