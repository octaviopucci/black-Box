import { useEffect, useState } from 'react'
import { brand, sales } from '@/data/site'

export function StickyCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-signal/40 bg-ink/95 px-4 py-3 backdrop-blur-md transition duration-300 sm:px-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0 hidden sm:block">
          <p className="truncate font-display text-sm font-semibold tracking-tight">
            {brand.tagline}
          </p>
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
            Garantia 30 dias · sem perguntas
          </p>
        </div>
        <a
          href={brand.cadastroExternal}
          className="w-full rounded-lg bg-signal px-4 py-3.5 text-center font-display text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-signalHot sm:w-auto sm:shrink-0"
        >
          {sales.hero.primaryCta}
        </a>
      </div>
    </div>
  )
}
