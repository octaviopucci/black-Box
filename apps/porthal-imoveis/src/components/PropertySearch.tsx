import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { properties, type Transaction } from '../data/properties'

const types = ['Todos', 'Casa', 'Sobrado', 'Sítio', 'Área', 'Apartamento', 'Comercial', 'Terreno'] as const

function inferType(title: string) {
  const t = title.toLowerCase()
  if (t.includes('sítio') || t.includes('sitio') || t.includes('chácara') || t.includes('chacara'))
    return 'Sítio'
  if (t.includes('sobrado')) return 'Sobrado'
  if (t.includes('área') || t.includes('area') || t.includes('hotel')) return 'Área'
  if (t.includes('apto') || t.includes('apartamento')) return 'Apartamento'
  if (
    t.includes('loja') ||
    t.includes('ponto') ||
    t.includes('sala comercial') ||
    t.includes('galpão') ||
    t.includes('galpao') ||
    t.includes('prédio') ||
    t.includes('predio') ||
    t.includes('salão') ||
    t.includes('salao')
  )
    return 'Comercial'
  if (t.includes('terreno')) return 'Terreno'
  if (t.includes('casa')) return 'Casa'
  return 'Outros'
}

export type SearchFilters = {
  ids: string[] | null
  transaction: Transaction | 'all'
}

export function PropertySearch({
  onFilter,
}: {
  onFilter: (filters: SearchFilters) => void
}) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<(typeof types)[number]>('Todos')
  const [city, setCity] = useState('Todas')
  const [transaction, setTransaction] = useState<Transaction | 'all'>('all')

  const cities = useMemo(() => {
    const set = new Set<string>()
    for (const p of properties) {
      const part = p.address.split('-').pop()?.trim() || p.address
      if (part) set.add(part.replace(/,.*/, '').trim())
    }
    return ['Todas', ...Array.from(set).toSorted()]
  }, [])

  function apply(
    nextQuery = query,
    nextType = type,
    nextCity = city,
    nextTx: Transaction | 'all' = transaction,
  ) {
    const q = nextQuery.trim().toLowerCase()
    const filtered = properties.filter((p) => {
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      const matchType = nextType === 'Todos' || inferType(p.title) === nextType
      const matchCity = nextCity === 'Todas' || p.address.includes(nextCity)
      const matchTx = nextTx === 'all' || p.transaction === nextTx
      return matchQ && matchType && matchCity && matchTx
    })
    onFilter({ ids: filtered.map((p) => p.id), transaction: nextTx })
  }

  return (
    <section className="relative z-20 -mt-12 px-5 sm:px-8">
      <motion.form
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onSubmit={(e) => {
          e.preventDefault()
          apply()
          const target = transaction === 'rent' ? 'alugar' : 'comprar'
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="mx-auto w-full max-w-7xl overflow-hidden rounded-[1.6rem] border border-white/60 bg-white/90 shadow-lift backdrop-blur-xl"
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
              onClick={() => {
                setTransaction(tab.id)
                apply(query, type, city, tab.id)
              }}
              className={`relative flex-1 px-4 py-3.5 text-sm font-semibold transition sm:flex-none sm:px-8 ${
                transaction === tab.id ? 'text-brand' : 'text-mute hover:text-ink'
              }`}
            >
              {tab.label}
              {transaction === tab.id && (
                <motion.span
                  layoutId="search-tab"
                  className="absolute inset-x-3 bottom-0 h-0.5 bg-brand"
                />
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-[1.35fr_1fr_1fr_auto] sm:p-5">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
              Buscar
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bairro, cidade ou tipo"
              className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-brand/25 transition focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
              Tipo
            </span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as (typeof types)[number])}
              className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-brand/25 transition focus:ring-2"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
              Cidade
            </span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-brand/25 transition focus:ring-2"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep sm:min-w-[148px]"
            >
              <Search className="h-4 w-4" />
              Pesquisar
            </button>
          </div>
        </div>
      </motion.form>
    </section>
  )
}
