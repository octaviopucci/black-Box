import { featuredProperties, saleProperties, rentProperties, type Property } from '../data/properties'
import { PropertyCard } from './PropertyCard'
import { SectionHeading } from './Reveal'

function pickList(filterIds: string[] | null, source: Property[]) {
  if (filterIds === null) return source
  const set = new Set(filterIds)
  return source.filter((p) => set.has(p.id))
}

export function FeaturedProperties({ filterIds }: { filterIds: string[] | null }) {
  const base = featuredProperties.length ? featuredProperties : saleProperties.slice(0, 3)
  const list = pickList(filterIds, base).slice(0, 6)

  if (!list.length) return null

  return (
    <section id="destaques" className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Curadoria"
          title="Imóveis em destaque"
          subtitle="Seleção premium para quem busca decisão com clareza — valores e referências à mostra."
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <PropertyCard key={p.id} property={p} index={i} />
        ))}
      </div>
    </section>
  )
}

export function PropertyListings({ filterIds }: { filterIds: string[] | null }) {
  const sales = pickList(filterIds, saleProperties)
  const rents = pickList(filterIds, rentProperties)

  return (
    <section id="imoveis" className="border-t border-line/70 bg-white/40">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div id="comprar" className="scroll-mt-28">
          <div className="mb-10">
            <SectionHeading
              eyebrow="Comprar"
              title="Oportunidades à venda"
              subtitle="Patrimônio com potencial — residencial, comercial e alto padrão em Capão Bonito e região."
            />
          </div>
          {sales.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sales.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState label="Nenhum imóvel à venda com esses filtros." />
          )}
        </div>

        <div id="alugar" className="mt-24 scroll-mt-28">
          <div className="mb-10">
            <SectionHeading
              eyebrow="Alugar"
              title="Locações disponíveis"
              subtitle="Casas, apartamentos e pontos comerciais com atendimento dedicado para locação."
            />
          </div>
          {rents.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rents.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState label="Nenhuma locação com esses filtros." />
          )}
        </div>
      </div>
    </section>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-line bg-chalk/50 px-6 py-14 text-center text-mute">
      {label}
    </div>
  )
}
