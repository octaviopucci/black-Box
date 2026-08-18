import { useEffect, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { brand, nav } from '@/data/site'

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-dvh bg-cream text-ink">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-paper focus:px-4 focus:py-2"
      >
        Ir ao conteúdo
      </a>

      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="text-xl text-gold" aria-hidden>
              ⚜
            </span>
            <span className="leading-tight">
              <span className="display block text-lg font-semibold tracking-wide">Nathalia Rigo</span>
              <span className="text-[10px] uppercase tracking-mark text-mute">Estética avançada</span>
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-mark transition ${
                    isActive ? 'text-gold' : 'text-mute hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={brand.instagramDm}
              target="_blank"
              rel="noreferrer"
              className="bg-ink px-5 py-2.5 text-[11px] uppercase tracking-mark text-paper transition hover:bg-gold"
            >
              {brand.cta}
            </a>
          </nav>
        </div>
      </header>

      <div id="conteudo">{children}</div>

      <nav
        aria-label="Mobile"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/10 bg-paper/95 px-2 py-2 backdrop-blur-md md:hidden"
      >
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 py-2 text-center text-[10px] uppercase tracking-widest ${
                isActive ? 'text-gold' : 'text-mute'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <a
        href={brand.instagramDm}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-16 right-4 z-50 rounded-full bg-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-mark text-paper shadow-soft md:bottom-6"
      >
        {brand.cta}
      </a>
    </div>
  )
}
