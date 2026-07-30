import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from './Reveal'
import { VehicleTile } from './VehicleTile'
import { availableVehicles } from '../data/vehicles'

export function Pista() {
  const scroller = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 520), behavior: 'smooth' })
  }

  return (
    <section
      id="pista"
      className="relative border-b border-line py-24 sm:py-28"
      aria-labelledby="pista-title"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="eyebrow mb-4">
              <span className="h-px w-8 bg-signal" aria-hidden />
              Estoque real
            </p>
            <h2
              id="pista-title"
              className="display-title text-[clamp(2.4rem,6vw,4.2rem)] text-chrome-soft"
            >
              Disponíveis na pista
            </h2>
            <p className="mt-4 max-w-xl text-chrome/70">
              Valores e opcionais como publicados pela loja. Toque no veículo
              para descrição completa e WhatsApp direto.
            </p>
          </Reveal>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              className="grid h-11 w-11 place-items-center border border-line text-chrome transition hover:border-signal"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              className="grid h-11 w-11 place-items-center border border-line text-chrome transition hover:border-signal"
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 scrollbar-none sm:gap-6 sm:px-8 lg:px-10"
        style={{ scrollbarWidth: 'none' }}
      >
        {availableVehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className="w-[min(86vw,420px)] shrink-0 snap-start"
          >
            <VehicleTile vehicle={vehicle} index={index} />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="lane-rule" />
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.24em] text-chrome-mute">
          {availableVehicles.length} unidades · atualizado a partir do Instagram
          oficial
        </p>
      </div>
    </section>
  )
}
