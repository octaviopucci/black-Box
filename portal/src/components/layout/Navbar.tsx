import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Logo } from '../ui/Logo'
import { Button } from '../ui/Button'
import { site, whatsappUrl } from '../../data/site'
import { cn } from '../../lib/cn'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      if (e.key !== 'Tab' || !menuRef.current) return
      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          scrolled || open ? 'border-b border-white/10 bg-ink/90 backdrop-blur-md' : 'bg-transparent',
        )}
      >
        <div className="bb-container flex h-16 items-center justify-between sm:h-[4.5rem]">
          <a href="#topo" className="relative z-50 text-paper" aria-label="Black Box — início">
            <Logo />
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
            {site.nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute transition hover:text-paper"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href={whatsappUrl()} arrow target="_blank" rel="noreferrer">
              Começar um projeto
            </Button>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="relative z-50 flex h-10 w-10 items-center justify-center border border-white/15 text-paper lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? 'Fechar' : 'Menu'}</span>
            <span className="flex w-4 flex-col gap-1.5" aria-hidden="true">
              <span
                className={cn(
                  'h-px w-full bg-paper transition',
                  open && 'translate-y-[3.5px] rotate-45',
                )}
              />
              <span
                className={cn('h-px w-full bg-paper transition', open && '-translate-y-[3.5px] -rotate-45')}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-mobile"
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink lg:hidden"
          >
            <div className="bb-noise" />
            <div className="bb-container flex h-full flex-col justify-between pb-10 pt-24">
              <nav className="flex flex-col gap-2" aria-label="Menu mobile">
                {site.nav.map((item, i) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => setOpen(false)}
                    className="border-b border-white/10 py-4 font-display text-3xl uppercase tracking-tight text-paper"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
              <Button href={whatsappUrl()} arrow target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                Começar um projeto
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
