import { saleProperties } from '../data/properties'
import { PropertyCard } from './PropertyCard'

export function FeaturedProperties({ filterIds }: { filterIds: string[] | null }) {
  const list =
    filterIds === null
      ? saleProperties
      : saleProperties.filter((p) => filterIds.includes(p.id))

  return (
    <section id="comprar" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand">Comprar</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
            Imóveis à venda
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mute">
            Seleção para investimento e moradia em Capão Bonito e região — alto padrão, sítios e
            oportunidades com potencial.
          </p>
        </div>
        <p className="text-sm text-mute">{list.length} imóveis</p>
      </div>

      {list.length === 0 ? (
        <p className="border border-dashed border-line bg-white/50 px-6 py-12 text-mute">
          Nenhum imóvel à venda com esses filtros. Ajuste a busca ou fale conosco no WhatsApp.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.slice(0, 9).map((property, i) => (
            <PropertyCard key={property.id} property={property} index={i} variant="sale" />
          ))}
        </div>
      )}
    </section>
  )
}
