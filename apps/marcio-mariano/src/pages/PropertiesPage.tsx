import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SiteShell } from '../components/SiteShell'
import { PageHero } from '../components/PageHero'
import { PropertyCard } from '../components/PropertyCard'
import { PropertySearch, type SearchFilters } from '../components/PropertySearch'
import { filterProperties, type Transaction } from '../data/properties'

function parseTipo(value: string | null): 'all' | Transaction {
  if (value === 'venda' || value === 'sale') return 'sale'
  if (value === 'aluguel' || value === 'rent' || value === 'locacao') return 'rent'
  return 'all'
}

export function PropertiesPage() {
  const [params] = useSearchParams()
  const initial: SearchFilters = {
    transaction: parseTipo(params.get('tipo')),
    city: params.get('cidade') || 'all',
    query: params.get('q') || '',
    minBeds: Number(params.get('quartos') || 0),
  }
  const [filters, setFilters] = useState<SearchFilters>(initial)

  const results = useMemo(
    () =>
      filterProperties({
        transaction: filters.transaction,
        city: filters.city,
        query: filters.query,
        minBeds: filters.minBeds,
      }),
    [filters],
  )

  const title =
    filters.transaction === 'sale'
      ? 'Imóveis à venda'
      : filters.transaction === 'rent'
        ? 'Imóveis para alugar'
        : 'Todos os imóveis'

  return (
    <SiteShell solidNav>
      <PageHero
        eyebrow="Portfólio"
        title={title}
        description="Filtre por operação, cidade e perfil. Cada imóvel leva você direto ao atendimento pelo WhatsApp."
      />
      <div className="bg-paper pb-6 pt-8">
        <div className="px-5 sm:px-8">
          <PropertySearch mode="page" initial={filters} onFilter={setFilters} />
        </div>
      </div>
      <section className="mx-auto w-full max-w-shell px-5 py-12 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-mute">
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>
        {results.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="border border-line bg-snow px-6 py-16 text-center">
            <p className="font-display text-2xl font-semibold text-ink">Nenhum imóvel com esse filtro</p>
            <p className="mt-3 text-sm text-mute">
              Ajuste a busca ou fale com a equipe para uma indicação personalizada.
            </p>
          </div>
        )}
      </section>
    </SiteShell>
  )
}
