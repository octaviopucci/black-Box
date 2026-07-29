import { saleProperties } from '../data/properties'
import { PropertyCard } from './PropertyCard'
import { PropertySearch, type SearchFilters } from './PropertySearch'

export function FeaturedProperties({
  filterIds,
  onFilter,
}: {
  filterIds: string[] | null
  onFilter: (filters: SearchFilters) => void
}) {
  const list =
    filterIds === null
      ? saleProperties
      : saleProperties.filter((p) => filterIds.includes(p.id))

  return (
    <section id="comprar" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <div className="mb-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand">Comprar</p>
          <h2 className="mt-3 font-display text-5xl leading-[0.95] sm:text-7xl">
            À venda,
            <span className="italic"> à vista</span>
          </h2>
        </div>
        <p className="max-w-md text-base leading-relaxed text-mute lg:justify-self-end">
          Seleção completa com preço à vista em evidência. Clique e abra a página do imóvel aqui
          mesmo — galeria, descrição e contato.
        </p>
      </div>

      <PropertySearch onFilter={onFilter} />

      <div className="mt-6 flex items-center justify-between text-sm text-mute">
        <p>{list.length} imóveis</p>
      </div>

      {list.length === 0 ? (
        <p className="mt-8 border border-dashed border-line px-6 py-12 text-mute">
          Nenhum resultado. Ajuste os filtros.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.slice(0, 12).map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
