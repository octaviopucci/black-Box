import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import {
  defaultFilters,
  filterProperties,
  listCities,
  propertyKinds,
  type FilterState,
} from '../lib/filters'
import { ease } from '../lib/motion'
import type { Transaction } from '../data/properties'

export type SearchFilters = {
  ids: string[] | null
  transaction: Transaction | 'all'
}

export function PropertySearch({
  onFilter,
}: {
  onFilter: (filters: SearchFilters) => void
}) {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const cities = useMemo(() => listCities(), [])

  function apply(next: FilterState, scroll = true) {
    setFilters(next)
    const result = filterProperties(next)
    onFilter({ ids: result.map((p) => p.id), transaction: next.transaction })
    if (scroll) {
      const target = next.transaction === 'rent' ? 'alugar' : 'comprar'
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative z-20 -mt-10 px-5 sm:-mt-12 sm:px-8">
      <motion.form
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease }}
        onSubmit={(e) => {
          e.preventDefault()
          apply(filters)
        }}
        className="container-page overflow-hidden border border-white/70 bg-white/92 shadow-lift backdrop-blur-xl"
      >
        <div className="flex border-b border-line/80">
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'sale', label: 'Comprar' },
              { id: 'rent', label: 'Alugar' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => apply({ ...filters, transaction: tab.id }, false)}
              className={`relative flex-1 px-4 py-3.5 text-sm font-semibold transition sm:flex-none sm:px-8 ${
                filters.transaction === tab.id ? 'text-brand' : 'text-mute hover:text-ink'
              }`}
            >
              {tab.label}
              {filters.transaction === tab.id ? (
                <motion.span
                  layoutId="search-tab"
                  className="absolute inset-x-4 bottom-0 h-0.5 bg-brand"
                />
              ) : null}
            </button>
          ))}
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:p-5">
          <label className="block">
            <span className="eyebrow mb-1.5 block">Buscar</span>
            <input
              value={filters.query}
              onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
              placeholder="Bairro, referência ou palavra-chave"
              className="field"
            />
          </label>
          <label className="block">
            <span className="eyebrow mb-1.5 block">Tipo</span>
            <select
              value={filters.kind}
              onChange={(e) =>
                setFilters((f) => ({ ...f, kind: e.target.value as FilterState['kind'] }))
              }
              className="field"
            >
              {propertyKinds.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow mb-1.5 block">Cidade</span>
            <select
              value={filters.city}
              onChange={(e) => setFilters((f) => ({ ...f, city: e.target.value }))}
              className="field"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button type="submit" className="btn-primary w-full sm:min-w-[148px]">
              <Search className="h-4 w-4" />
              Pesquisar
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 px-4 py-3 sm:px-5">
          <p className="text-sm text-mute">
            Catálogo completo com {filterProperties(filters).length} imóveis nesta busca.
          </p>
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams()
              if (filters.transaction !== 'all') params.set('tx', filters.transaction)
              if (filters.kind !== 'Todos') params.set('kind', filters.kind)
              if (filters.city !== 'Todas') params.set('city', filters.city)
              if (filters.query.trim()) params.set('q', filters.query.trim())
              navigate(`/imoveis${params.toString() ? `?${params}` : ''}`)
            }}
            className="text-sm font-semibold text-brand underline-offset-4 hover:underline"
          >
            Abrir catálogo completo
          </button>
        </div>
      </motion.form>
    </section>
  )
}
