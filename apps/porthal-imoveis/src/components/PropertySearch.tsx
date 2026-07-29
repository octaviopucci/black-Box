import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { properties, type Transaction } from '../data/properties'

const types = ['Todos', 'Casa', 'Sobrado', 'Sítio', 'Área', 'Comercial', 'Terreno'] as const

function inferType(title: string) {
  const t = title.toLowerCase()
  if (t.includes('sítio') || t.includes('sitio') || t.includes('chácara') || t.includes('chacara')) return 'Sítio'
  if (t.includes('sobrado')) return 'Sobrado'
  if (t.includes('área') || t.includes('area') || t.includes('hotel')) return 'Área'
  if (t.includes('loja') || t.includes('ponto') || t.includes('sala') || t.includes('galp') || t.includes('préd') || t.includes('pred') || t.includes('salão') || t.includes('salao')) return 'Comercial'
  if (t.includes('terreno')) return 'Terreno'
  if (t.includes('casa')) return 'Casa'
  return 'Outros'
}

export type SearchFilters = {
  ids: string[] | null
  transaction: Transaction | 'all'
}

export function PropertySearch({ onFilter }: { onFilter: (filters: SearchFilters) => void }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<(typeof types)[number]>('Todos')
  const [transaction, setTransaction] = useState<Transaction | 'all'>('all')

  const cities = useMemo(() => {
    const set = new Set<string>()
    for (const p of properties) {
      const part = p.address.split('-').pop()?.trim() || p.address
      if (part) set.add(part.replace(/,.*/, '').trim())
    }
    return ['Todas', ...Array.from(set).slice().sort((a, b) => a.localeCompare(b, 'pt-BR'))]
  }, [])
  const [city, setCity] = useState('Todas')

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-[1.5rem] border border-line bg-white/80 p-3 shadow-soft backdrop-blur"
    >
      <div className="mb-3 flex gap-1 rounded-full bg-mist p-1">
        {(
          [
            { id: 'all', label: 'Tudo' },
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
            className={`flex-1 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] transition ${
              transaction === tab.id ? 'bg-ink text-white' : 'text-mute hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <form
        className="grid gap-2 md:grid-cols-[1.4fr_1fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault()
          apply()
          document
            .getElementById(transaction === 'rent' ? 'alugar' : 'comprar')
            ?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar bairro, tipo..."
          className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-brand/20 focus:ring-2"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as (typeof types)[number])}
          className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none"
        >
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none"
        >
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-brand px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white hover:bg-brand-deep"
        >
          Filtrar
        </button>
      </form>
    </motion.div>
  )
}
