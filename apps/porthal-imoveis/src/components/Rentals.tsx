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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(196,52,42,0.35),transparent_40%),radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.06),transparent_35%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-soft">Alugar</p>
            <h2 className="mt-3 font-display text-5xl leading-[0.95] sm:text-7xl">
              Locação
              <span className="block italic text-white/80">com presença</span>
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="text-white/65">{list.length} oportunidades</p>
            <a
              href={whatsappUrl('Olá! Quero imóveis para alugar.')}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full border border-white/25 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition hover:border-white/60"
            >
              Falar sobre aluguel
            </a>
          </div>
        </div>

        {list.length === 0 ? (
          <p className="border border-dashed border-white/20 px-6 py-12 text-white/55">
            Nenhum aluguel com esses filtros.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} layout="compact" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
