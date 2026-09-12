import { useRef } from 'react'
import { results } from '@/data/site'
import { useResultsCorridor } from '@/hooks/useMotion'

export function ResultsCorridor() {
  const containerRef = useRef<HTMLElement>(null)
  useResultsCorridor(containerRef)

  return (
    <section id="resultados" ref={containerRef} className="relative h-[100svh] bg-ink-soft">
      <div className="absolute left-6 top-8 z-10 md:left-10 md:top-12 lg:left-16">
        <h2 className="font-display text-2xl font-medium text-paper md:text-3xl">
          Resultados: Casos Reais
        </h2>
      </div>

      <div className="flex h-full items-center overflow-hidden pt-28">
        <div
          data-corridor-track
          className="flex h-[70vh] min-h-[420px] items-stretch gap-6 px-6 will-change-transform md:gap-8 md:px-10 lg:px-16"
          style={{ width: 'max-content' }}
        >
          {results.map((item, index) => (
            <article
              key={item.id}
              className="group relative flex w-[78vw] max-w-[520px] shrink-0 flex-col md:w-[42vw]"
            >
              <div className="relative flex-1 overflow-hidden bg-ink-lift">
                <img
                  src={item.image}
                  alt={item.title}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover transition-transform duration-700 ease-silk group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-80" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-soft">
                  {String(index + 1).padStart(2, '0')} / {String(results.length).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-xl font-medium text-paper md:text-2xl">{item.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-paper/65">{item.note}</p>
                <a
                  href={item.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-medium uppercase tracking-[0.14em] text-teal-soft transition-colors hover:text-paper"
                >
                  Ver no Instagram →
                </a>
              </div>
            </article>
          ))}
          <div className="flex w-[40vw] shrink-0 items-center justify-center md:w-[24vw]">
            <div className="text-center">
              <p className="font-display text-2xl text-paper/80 md:text-3xl">Fim da galeria</p>
              <a
                href="#contato"
                className="mt-4 inline-block border border-paper/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                Agendar consulta
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
