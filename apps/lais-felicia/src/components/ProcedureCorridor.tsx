import { useRef } from 'react'
import { asset, procedurePanels } from '../data/site'
import { useCorridorPin } from '../hooks/useCorridorPin'
import { Reveal } from './Reveal'

export function ProcedureCorridor() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useCorridorPin(sectionRef, trackRef)

  return (
    <section id="procedimentos" ref={sectionRef} className="relative scroll-mt-24 bg-ink text-paper">
      <div className="px-5 pb-6 pt-24 sm:px-8 md:px-12 md:pt-28">
        <Reveal>
          <p className="eyebrow text-rose-soft">Procedimentos</p>
          <h2 className="display-title mt-4 max-w-2xl text-4xl text-paper sm:text-6xl">
            Do primeiro olhar ao fio no lugar.
          </h2>
          <p className="mt-4 max-w-lg text-sm text-paper/55">
            Só atendimentos em pessoas reais. Marcação, henna e acabamento no studio.
          </p>
        </Reveal>
      </div>

      <div className="overflow-x-auto pb-16 md:overflow-hidden md:pb-24">
        <div ref={trackRef} className="corridor-track gap-4 px-5 sm:px-8 md:gap-5 md:px-12">
          {procedurePanels.map((panel) => (
            <article
              key={panel.file}
              className="group relative h-[72vh] min-h-[460px] w-[88vw] max-w-[560px] shrink-0 overflow-hidden md:h-[76vh] md:w-[44vw]"
            >
              <img
                src={asset(panel.file)}
                alt={panel.alt}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-silk group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="font-display text-4xl text-rose-soft">{panel.step}</p>
                <h3 className="mt-2 font-display text-3xl sm:text-4xl">{panel.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/70">{panel.text}</p>
              </div>
            </article>
          ))}
          <div className="w-8 shrink-0 md:w-16" aria-hidden />
        </div>
      </div>
    </section>
  )
}
