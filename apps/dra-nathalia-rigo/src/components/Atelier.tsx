import { useEffect, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { brand, nav } from '@/data/site'
import { Mark } from '@/components/Mark'

const mercuryByPath: Record<string, number> = {
  '/': 12,
  '/protocolos': 38,
  '/nathalia': 62,
  '/espaco': 82,
  '/avaliacao': 100,
  '/privacidade': 70,
  '/404': 6,
}

export function setMercury(value: number) {
  document.documentElement.style.setProperty('--mercury', String(Math.round(value)))
}

export function Atelier({ children }: { children: ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    const exact = mercuryByPath[location.pathname]
    if (exact !== undefined) setMercury(exact)
    else if (location.pathname.startsWith('/protocolos/')) setMercury(42)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="relative min-h-dvh bg-fog text-ink">
      <div className="grain" aria-hidden />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:bg-ice focus:px-4 focus:py-2"
      >
        Ir ao conteúdo
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-5 pt-5 md:px-8 md:pt-7">
        <div className="pointer-events-auto rounded-full bg-ice/85 px-3 py-2 backdrop-blur-md">
          <Mark />
        </div>
      </header>

      <nav
        aria-label="Escala de temperatura"
        className="fixed right-3 top-1/2 z-50 hidden h-[46vh] w-8 -translate-y-1/2 md:block"
      >
        <div className="relative h-full w-px bg-ink/15 mx-auto">
          <div className="mercury-fill absolute bottom-0 left-0 w-full bg-cryo transition-[height] duration-500 ease-out" />
        </div>
        <ul className="absolute inset-0">
          {nav.map((item) => (
            <li
              key={item.to}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: `${100 - item.mercury}%` }}
            >
              <NavLink
                to={item.to}
                end={item.to === '/'}
                title={item.label}
                className={({ isActive }) =>
                  `block h-2.5 w-2.5 rounded-full border border-ink/40 bg-fog transition ${
                    isActive ? 'scale-125 bg-cryo border-cryo' : 'hover:bg-sage'
                  }`
                }
              >
                <span className="sr-only">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-ice/85 px-4 py-3 backdrop-blur-md md:hidden"
      >
        <ul className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-widest">
          {nav.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'text-cryo' : 'text-mute'
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div id="conteudo" className="pb-20 md:pb-0">
        {children}
      </div>

      <a
        href={brand.instagramDm}
        className="fixed bottom-16 right-4 z-50 hidden rounded-full bg-ink px-5 py-3 text-[11px] uppercase tracking-mark text-ice transition hover:bg-cryo md:bottom-8 md:right-16 md:inline-flex"
      >
        Avaliação
      </a>
    </div>
  )
}
