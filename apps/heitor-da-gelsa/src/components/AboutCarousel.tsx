import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { aboutCarousel } from '@/data/site'
import { Reveal } from './Reveal'

export function AboutCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const { slides, url, caption } = aboutCarousel

  function scrollTo(index: number) {
    const el = ref.current
    if (!el) return
    const next = Math.min(Math.max(index, 0), slides.length - 1)
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
    setActive(next)
  }

  function scrollBy(dir: 1 | -1) {
    scrollTo(active + dir)
  }

  return (
    <Reveal delay={0.08}>
      <div className="mt-10 w-full max-w-full overflow-hidden">
        <div className="relative w-full">
          <div
            ref={ref}
            className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [touch-action:pan-x] [&::-webkit-scrollbar]:hidden"
            onScroll={() => {
              const el = ref.current
              if (!el || el.clientWidth === 0) return
              setActive(Math.round(el.scrollLeft / el.clientWidth))
            }}
          >
            {slides.map((slide, i) => (
              <figure key={slide.id} data-slide={i} className="w-full min-w-full shrink-0 snap-start">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="aspect-[4/5] w-full object-contain bg-green-deep/5"
                  loading="lazy"
                  draggable={false}
                />
              </figure>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <button
                type="button"
                aria-label="Slide anterior"
                onClick={() => scrollBy(-1)}
                disabled={active === 0}
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-green/20 text-green transition hover:border-green hover:bg-green/5 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                aria-label="Próximo slide"
                onClick={() => scrollBy(1)}
                disabled={active === slides.length - 1}
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-green/20 text-green transition hover:border-green hover:bg-green/5 disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
              <span className="ml-2 text-xs font-bold uppercase tracking-[0.16em] text-graphite/50">
                {active + 1} / {slides.length}
              </span>
            </div>

            <div className="flex justify-center gap-1.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Ir para slide ${i + 1}`}
                  onClick={() => scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? 'w-6 bg-green' : 'w-1.5 bg-green/25 hover:bg-green/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-graphite/70">{caption}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex text-xs font-bold uppercase tracking-wide text-green hover:text-green-dark"
        >
          Ver carrossel completo no Instagram →
        </a>
      </div>
    </Reveal>
  )
}
