import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'
import { PageProgress } from '../components/PageProgress'
import {
  formatPrice,
  getVehicle,
  availableVehicles,
  type Vehicle,
} from '../data/vehicles'
import { site, vehicleWhatsApp } from '../data/site'
import { Reveal } from '../components/Reveal'
import { assetUrl } from '../lib/asset'

function Specs({ vehicle }: { vehicle: Vehicle }) {
  const items = [
    vehicle.year ? { label: 'Ano', value: String(vehicle.year) } : null,
    vehicle.transmission
      ? { label: 'Câmbio', value: vehicle.transmission }
      : null,
    vehicle.fuel ? { label: 'Combustível', value: vehicle.fuel } : null,
    { label: 'Status', value: vehicle.status === 'sold' ? 'Vendido' : 'Disponível' },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="border border-line bg-asphalt-lift p-4">
          <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-chrome-mute">
            {item.label}
          </dt>
          <dd className="mt-2 text-sm font-semibold text-chrome-soft">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function VehiclePage() {
  const { id } = useParams()
  const vehicle = id ? getVehicle(id) : undefined

  if (!vehicle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
        <h1 className="display-title text-4xl text-chrome-soft">Veículo não encontrado</h1>
        <Link to="/" className="cta-signal">
          Voltar ao catálogo
        </Link>
      </div>
    )
  }

  const sold = vehicle.status === 'sold'
  const related = availableVehicles
    .filter((v) => v.id !== vehicle.id)
    .slice(0, 3)
  const priceLabel = formatPrice(vehicle.price)

  return (
    <>
      <PageProgress />
      <Navbar />
      <main className="pb-20 pt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Link
            to={sold ? '/#entregas' : '/#pista'}
            className="inline-flex items-center gap-2 text-sm text-chrome-mute transition hover:text-chrome-soft"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar ao catálogo
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <Reveal>
              <div className="overflow-hidden border border-line">
                <img
                  src={assetUrl(vehicle.image)}
                  alt={vehicle.title}
                  className="aspect-[16/11] w-full object-cover"
                  fetchPriority="high"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="eyebrow mb-4">
                <span className="h-px w-8 bg-signal" aria-hidden />
                {sold ? 'Arquivo de entregas' : 'Disponível na pista'}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-chrome-mute">
                {vehicle.brand}
                {vehicle.year ? ` · ${vehicle.year}` : ''}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] uppercase tracking-[0.04em] text-chrome-soft">
                {vehicle.model}
              </h1>

              {!sold && (
                <p className="mt-5 font-brand text-4xl italic text-signal sm:text-5xl">
                  {priceLabel}
                </p>
              )}

              {sold && vehicle.praise && (
                <p className="mt-5 border-l-2 border-signal pl-4 text-lg text-chrome/80">
                  {vehicle.praise}
                </p>
              )}

              <p className="mt-6 leading-relaxed text-chrome/75">
                {vehicle.description}
              </p>

              <div className="mt-8">
                <Specs vehicle={vehicle} />
              </div>

              {vehicle.features.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-chrome-mute">
                    Opcionais & detalhes
                  </h2>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {vehicle.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 border border-line/80 px-3 py-2.5 text-sm text-chrome/80"
                      >
                        <span className="h-1 w-1 rounded-full bg-signal" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                {!sold && (
                  <a
                    href={vehicleWhatsApp(vehicle.title, priceLabel)}
                    target="_blank"
                    rel="noreferrer"
                    className="cta-signal"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Quero este veículo
                  </a>
                )}
                <a
                  href={vehicle.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-ghost"
                >
                  Ver no Instagram
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              </div>

              <p className="mt-8 text-xs leading-relaxed text-chrome-mute">
                {site.address.street}, {site.city}. Financiamento em até 60x ·
                cartão em até 36x · trocas e consignação.
              </p>
            </Reveal>
          </div>

          {related.length > 0 && !sold && (
            <section className="mt-20 border-t border-line pt-14">
              <h2 className="display-title text-3xl text-chrome-soft sm:text-4xl">
                Continuar na pista
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {related.map((v) => (
                  <Link
                    key={v.id}
                    to={`/veiculo/${v.id}`}
                    className="group border border-line transition hover:border-signal/50"
                  >
                    <img
                      src={assetUrl(v.image)}
                      alt={v.title}
                      className="aspect-[16/10] w-full object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <p className="font-display text-xl uppercase text-chrome-soft">
                        {v.model}
                      </p>
                      <p className="mt-1 font-brand italic text-signal">
                        {formatPrice(v.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
      <PulseWhatsApp />
    </>
  )
}
