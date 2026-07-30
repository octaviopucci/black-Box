import { Reveal } from './Reveal'
import { VehicleTile } from './VehicleTile'
import { soldVehicles } from '../data/vehicles'

export function Entregas() {
  return (
    <section
      id="entregas"
      className="relative border-b border-line bg-asphalt-lift/40 px-5 py-24 sm:px-8 sm:py-28 lg:px-10"
      aria-labelledby="entregas-title"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow mb-4">
            <span className="h-px w-8 bg-signal" aria-hidden />
            Arquivo de entregas
          </p>
          <h2
            id="entregas-title"
            className="display-title max-w-3xl text-[clamp(2.4rem,6vw,4.2rem)] text-chrome-soft"
          >
            Sonhos que já saíram com chave
          </h2>
          <p className="mt-4 max-w-2xl text-chrome/70">
            Cada entrega é prova social viva — clientes reais de Capão Bonito e
            região que confiaram na NA Veículos.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {soldVehicles.slice(0, 9).map((vehicle, index) => (
            <Reveal key={vehicle.id} delay={Math.min(index * 0.05, 0.25)}>
              <VehicleTile vehicle={vehicle} index={index} variant="archive" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
