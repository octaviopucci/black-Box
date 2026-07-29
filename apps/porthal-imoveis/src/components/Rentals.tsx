import { rentProperties } from '../data/properties'
import { whatsappUrl } from '../data/site'
import { PropertyCard } from './PropertyCard'

export function Rentals({ filterIds }: { filterIds: string[] | null }) {
  const list =
    filterIds === null
      ? rentProperties
      : rentProperties.filter((p) => filterIds.includes(p.id))

  return (
    <section id="alugar" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,52,42,0.25),transparent_45%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-soft">
              Alugar
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Imóveis para locação
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/65">
              Casas, pontos comerciais, salas e terrenos — veja os detalhes aqui no site.
            </p>
          </div>
          <a
            href={whatsappUrl('Olá! Tenho interesse em imóveis para alugar.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit rounded-full border border-white/25 px-5 py-3 text-sm font-semibold transition hover:border-white/55"
          >
            Quero alugar · WhatsApp
          </a>
        </div>

        {list.length === 0 ? (
          <p className="border border-dashed border-white/20 px-6 py-12 text-white/55">
            Nenhum imóvel para alugar com esses filtros.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} variant="rent" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
