import { Link, NavLink } from 'react-router-dom'
import { brand } from '@/data/site'

const links = [
  { to: '/arena', label: 'Arena' },
  { to: '/protocolo', label: 'Protocolo' },
]

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={brand.logo}
            alt="BASE"
            className="h-7 w-auto select-none sm:h-8"
            draggable={false}
          />
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.18em] transition ${
                  isActive ? 'text-signal' : 'text-ash hover:text-paper'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href="#sistema"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-ash transition hover:text-paper"
          >
            Sistema
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/arena/luta"
            className="rounded-lg bg-signal px-3 py-2 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-signalHot sm:px-4"
          >
            A Luta
          </Link>
        </div>
      </div>
    </header>
  )
}
