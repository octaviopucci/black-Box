import { site } from '@/data/site'

const links = [
  { href: '#resultados', label: 'Resultados' },
  { href: '#especialidades', label: 'Especialidades' },
  { href: '#contato', label: 'Contato' },
]

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#" className="font-display text-sm font-medium tracking-wide text-white md:text-base">
          {site.name}
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.18em] text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={site.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-80"
        >
          Instagram
        </a>
      </nav>
    </header>
  )
}
