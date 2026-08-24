import { useEffect, useState } from 'react'
import { bookingUrl } from '../data/site'

function Mark({ light = false }: { light?: boolean }) {
  const outer = light ? '#F1F4F2' : '#0A1211'
  const inner = light ? '#2FA6A0' : '#0B4B4A'
  return (
    <svg width="26" height="26" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 42 L32 18 L46 42" stroke={outer} strokeWidth="3" strokeLinejoin="round" fill="none" />
      <path d="M24 42 L32 28 L40 42" stroke={inner} strokeWidth="3" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-silk ${
        scrolled ? 'glass-dark py-3 shadow-lift' : 'py-5'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a href="#topo" className="flex items-center gap-2.5 text-paper">
          <Mark light />
          <span className="font-display text-[15px] leading-none tracking-tight">
            Dr. Marcelo Prado
            <span className="ml-2 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-teal-bright sm:inline">
              Calorimetria
            </span>
          </span>
        </a>
        <a
          href={bookingUrl()}
          target="_blank"
          rel="noreferrer"
          className="cta-ghost-light !py-2.5 !px-4 text-xs sm:text-sm"
        >
          Agendar exame
        </a>
      </div>
    </header>
  )
}
