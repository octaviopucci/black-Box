import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { site } from '../data/site'
import { properties, type Transaction } from '../data/properties'
import { Reveal } from './Reveal'

export type SearchFilters = {
  transaction: 'all' | Transaction
  city: string
  query: string
  minBeds: number
}

const defaultFilters: SearchFilters = {
  transaction: 'all',
  city: 'all',
  query: '',
  minBeds: 0,
}

export function PropertySearch({
  onFilter,
  mode = 'home',
  initial,
}: {
  onFilter?: (filters: SearchFilters) => void
  mode?: 'home' | 'page'
  initial?: Partial<SearchFilters>
}) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<SearchFilters>({ ...defaultFilters, ...initial })

  const cities = useMemo(() => {
    const fromData = Array.from(new Set(properties.map((p) => p.city))).sort()
    return fromData.length ? fromData : [...site.cities]
  }, [])

  const update = (patch: Partial<SearchFilters>) => {
    const next = { ...filters, ...patch }
    setFilters(next)
    onFilter?.(next)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (filters.transaction === 'sale') params.set('tipo', 'venda')
    if (filters.transaction === 'rent') params.set('tipo', 'aluguel')
    if (filters.city !== 'all') params.set('cidade', filters.city)
    if (filters.minBeds) params.set('quartos', String(filters.minBeds))
    if (filters.query) params.set('q', filters.query)
    const qs = params.toString()
    if (mode === 'home') {
      navigate(`/imoveis${qs ? `?${qs}` : ''}`)
      return
    }
    onFilter?.(filters)
    navigate(`/imoveis${qs ? `?${qs}` : ''}`, { replace: true })
  }

  return (
    <section id="buscar" className={mode === 'home' ? '-mt-10 relative z-20 px-5 sm:px-8' : ''}>
      <Reveal className="mx-auto w-full max-w-shell">
        <form
          onSubmit={submit}
          className="border border-line bg-snow p-4 shadow-lift sm:p-6"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="section-label">Busca inteligente</p>
              <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
                Encontre o imóvel certo
              </h2>
            </div>
            <p className="text-sm text-mute">{properties.length} imóveis no portfólio</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Operação</span>
              <select
                className="input-field"
                value={filters.transaction}
                onChange={(e) =>
                  update({ transaction: e.target.value as SearchFilters['transaction'] })
                }
              >
                <option value="all">Comprar ou alugar</option>
                <option value="sale">Para comprar</option>
                <option value="rent">Para alugar</option>
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Cidade</span>
              <select
                className="input-field"
                value={filters.city}
                onChange={(e) => update({ city: e.target.value })}
              >
                <option value="all">Todas as cidades</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Quartos</span>
              <select
                className="input-field"
                value={filters.minBeds}
                onChange={(e) => update({ minBeds: Number(e.target.value) })}
              >
                <option value={0}>Qualquer</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm lg:col-span-2">
              <span className="mb-1.5 block font-medium text-ink">Palavra-chave</span>
              <div className="flex gap-2">
                <input
                  className="input-field"
                  placeholder="Bairro, referência ou tipo"
                  value={filters.query}
                  onChange={(e) => update({ query: e.target.value })}
                />
                <button type="submit" className="btn-blue shrink-0 px-5">
                  <Search className="h-4 w-4" />
                  Buscar
                </button>
              </div>
            </label>
          </div>
        </form>
      </Reveal>
    </section>
  )
}
