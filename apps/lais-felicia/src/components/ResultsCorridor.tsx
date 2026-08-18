import { useRef } from 'react'
import { asset, resultCorridor, whatsappUrl } from '../data/site'
import { useCorridorPin } from '../hooks/useCorridorPin'
import { Reveal } from './Reveal'

export function ResultsCorridor() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useCorridorPin(sectionRef, trackRef)

  return (
    <section id="resultados" ref={sectionRef} className="relative scroll-mt-24 bg-paper">
      <div className="px-5 pb-6 pt-24 sm:px-8 md:px-12 md:pt-28">
        <Reveal>
          <p className="eyebrow">Resultados</p>
          <h2 className="display-title mt-4 max-w-3xl text-4xl sm:text-6xl">
            Cada sobrancelha desenhada para o rosto que existe.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-ink/55">
            Deslize pelo corredor. Clientes reais, acabamentos reais.
          </p>
        </Reveal>
      </div>

      <div className="overflow-x-auto pb-16 md:overflow-hidden md:pb-24">
        <div ref={trackRef} className="corridor-track gap-3 px-5 sm:px-8 md:gap-4 md:px-12">
          {resultCorridor.map((item, i) => (
            <figure
              key={item.file}
              className="relative h-[68vh] min-h-[420px] w-[78vw] max-w-[480px] shrink-0 overflow-hidden md:h-[72vh] md:w-[36vw]"
            >
              <img
                src={asset(item.file)}
                alt={item.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <figcaption className="absolute bottom-5 left-5 text-[11px] uppercase tracking-[0.28em] text-paper">
                {String(i + 1).padStart(2, '0')} · {item.caption}
              </figcaption>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            </figure>
          ))}
          <div className="w-8 shrink-0 md:w-16" aria-hidden />
        </div>
      </div>

      <Reveal className="mx-auto max-w-6xl px-5 pb-20 pt-2 sm:px-8 md:px-12">
        <a href={whatsappUrl()} className="cta-rose">
          Quero meu design
        </a>
      </Reveal>
    </section>
  )
}
