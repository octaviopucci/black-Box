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
    const slide = el.querySelector<HTMLElement>(`[data-slide="${index}"]`)
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    setActive(index)
  }

  function scrollBy(dir: 1 | -1) {
    const next = Math.min(Math.max(active + dir, 0), slides.length - 1)
    scrollTo(next)
  }

  return (
    <Reveal delay={0.08}>
      <div className="mt-10">
        <div className="relative">
          <div
            ref={ref}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={() => {
              const el = ref.current
              if (!el) return
              const center = el.scrollLeft + el.clientWidth / 2
              let closest = 0
              let minDist = Infinity
              slides.forEach((_, i) => {
                const slide = el.querySelector<HTMLElement>(`[data-slide="${i}"]`)
                if (!slide) return
                const slideCenter = slide.offsetLeft + slide.offsetWidth / 2
                const dist = Math.abs(center - slideCenter)
                if (dist < minDist) {
                  minDist = dist
                  closest = i
                }
              })
              setActive(closest)
            }}
          >
            {slides.map((slide) => (
              <figure
                key={slide.id}
                data-slide={slide.id - 1}
                className="w-[min(85vw,420px)] shrink-0 snap-center"
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="aspect-[4/5] w-full object-contain bg-green-deep/5"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
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

            <div className="hidden gap-1.5 sm:flex">
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
