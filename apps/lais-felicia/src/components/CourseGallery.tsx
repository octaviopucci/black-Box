import { useRef } from 'react'
import { asset, courseGallery } from '../data/site'
import { useCorridorPin } from '../hooks/useCorridorPin'
import { Reveal } from './Reveal'

export function CourseGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useCorridorPin(sectionRef, trackRef, { scrub: 0.8 })

  return (
    <section ref={sectionRef} className="relative bg-ink text-paper">
      <div className="px-5 pb-6 pt-16 sm:px-8 md:px-12">
        <Reveal>
          <p className="eyebrow text-rose-soft">Por dentro dos cursos</p>
          <h3 className="display-title mt-4 max-w-2xl text-3xl sm:text-5xl">
            A experiência em imagens.
          </h3>
          <p className="mt-3 max-w-lg text-sm text-paper/55">
            Sala, kit, treino de linha, cartelas de cor e certificado. Tudo presencial em Capão Bonito.
          </p>
        </Reveal>
      </div>

      <div className="overflow-x-auto pb-20 md:overflow-hidden">
        <div ref={trackRef} className="corridor-track gap-3 px-5 sm:px-8 md:gap-4 md:px-12">
          {courseGallery.map((item, i) => (
            <figure
              key={item.file}
              className="relative h-[58vh] min-h-[360px] w-[72vw] max-w-[420px] shrink-0 overflow-hidden md:h-[62vh] md:w-[32vw]"
            >
              <img
                src={asset(item.file)}
                alt={item.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <figcaption className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.26em] text-paper/80">
                {String(i + 1).padStart(2, '0')}
              </figcaption>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            </figure>
          ))}
          <div className="w-8 shrink-0 md:w-16" aria-hidden />
        </div>
      </div>
    </section>
  )
}
