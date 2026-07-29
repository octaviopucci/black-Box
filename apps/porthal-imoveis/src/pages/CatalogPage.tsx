import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { properties, profiles, type Transaction } from '../data/properties'
import {
  filterProperties,
  listCities,
  propertyKinds,
  type FilterState,
  type PropertyKind,
} from '../lib/filters'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { PropertyCard } from '../components/PropertyCard'
import { Reveal } from '../components/Reveal'

const PAGE = 12

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const [visible, setVisible] = useState(PAGE)
  const cities = useMemo(() => listCities(), [])

  const filters: FilterState = useMemo(
    () => ({
      query: params.get('q') ?? '',
      kind: (params.get('kind') as PropertyKind) || 'Todos',
      city: params.get('city') || 'Todas',
      transaction: (params.get('tx') as Transaction | 'all') || 'all',
      profile: params.get('profile') || 'Todos',
    }),
    [params],
  )

  const list = useMemo(() => filterProperties(filters), [filters])

  useEffect(() => {
    setVisible(PAGE)
  }, [filters])

  function update(partial: Partial<FilterState>) {
    const next = { ...filters, ...partial }
    const sp = new URLSearchParams()
    if (next.query.trim()) sp.set('q', next.query.trim())
    if (next.kind !== 'Todos') sp.set('kind', next.kind)
    if (next.city !== 'Todas') sp.set('city', next.city)
    if (next.transaction !== 'all') sp.set('tx', next.transaction)
    if (next.profile !== 'Todos') sp.set('profile', next.profile)
    setParams(sp, { replace: true })
  }

  const shown = list.slice(0, visible)

  return (
    <div className="min-h-screen bg-paper">
      <Navbar solid />
      <main className="pt-24">
        <section className="container-page pb-8 pt-6">
          <Reveal>
            <p className="eyebrow">Catálogo</p>
            <h1 className="display-title mt-3 text-ink">
              Todos os imóveis
              <span className="mt-1 block italic text-brand">Porthal</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-mute">
              {properties.length} oportunidades com filtros inteligentes. Valores à vista em
              destaque nas vendas.
            </p>
          </Reveal>

          <form
            className="mt-10 grid gap-3 border border-line bg-white/80 p-4 sm:grid-cols-2 lg:grid-cols-5 sm:p-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="block lg:col-span-2">
              <span className="eyebrow mb-1.5 block">Buscar</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                <input
                  value={filters.query}
                  onChange={(e) => update({ query: e.target.value })}
                  className="field pl-10"
                  placeholder="Referência, bairro, palavra-chave"
                />
              </div>
            </label>
            <label className="block">
              <span className="eyebrow mb-1.5 block">Transação</span>
              <select
                value={filters.transaction}
                onChange={(e) =>
                  update({ transaction: e.target.value as FilterState['transaction'] })
                }
                className="field"
              >
                <option value="all">Todas</option>
                <option value="sale">Comprar</option>
                <option value="rent">Alugar</option>
              </select>
            </label>
            <label className="block">
              <span className="eyebrow mb-1.5 block">Tipo</span>
              <select
                value={filters.kind}
                onChange={(e) => update({ kind: e.target.value as PropertyKind })}
                className="field"
              >
                {propertyKinds.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow mb-1.5 block">Perfil</span>
              <select
                value={filters.profile}
                onChange={(e) => update({ profile: e.target.value })}
                className="field"
              >
                {profiles.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2 lg:col-span-2">
              <span className="eyebrow mb-1.5 block">Cidade</span>
              <select
                value={filters.city}
                onChange={(e) => update({ city: e.target.value })}
                className="field"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end sm:col-span-2 lg:col-span-3">
              <button
                type="button"
                onClick={() => {
                  const sp = new URLSearchParams()
                  setParams(sp, { replace: true })
                }}
                className="text-sm font-semibold text-mute underline-offset-4 hover:text-brand hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-between gap-4 border-b border-line pb-4">
            <p className="text-sm text-mute">
              {list.length} {list.length === 1 ? 'resultado' : 'resultados'}
            </p>
            <Link to="/" className="text-sm font-semibold text-brand hover:text-brand-deep">
              Voltar ao início
            </Link>
          </div>

          {shown.length ? (
            <>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index % 6} />
                ))}
              </div>
              {visible < list.length ? (
                <div className="mt-12 flex justify-center pb-8">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE)}
                    className="border border-ink/15 bg-white px-8 py-3.5 text-sm font-semibold transition hover:border-brand hover:text-brand"
                  >
                    Carregar mais ({list.length - visible})
                  </button>
                </div>
              ) : (
                <div className="pb-10" />
              )}
            </>
          ) : (
            <p className="py-20 text-center text-mute">
              Nenhum imóvel encontrado. Ajuste os filtros ou{' '}
              <button
                type="button"
                className="font-semibold text-brand"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
              >
                limpe a busca
              </button>
              .
            </p>
          )}
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
