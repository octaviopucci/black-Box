import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export function Carousel({ children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  function scrollByCard(dir: 1 | -1) {
    const el = ref.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:px-8"
      >
        {children}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => scrollByCard(-1)}
          className="grid h-11 w-11 place-items-center rounded-full border-2 border-gold text-white transition hover:bg-gold"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={() => scrollByCard(1)}
          className="grid h-11 w-11 place-items-center rounded-full border-2 border-gold text-white transition hover:bg-gold"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
