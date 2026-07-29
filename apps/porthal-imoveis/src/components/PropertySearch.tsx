import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { properties } from '../data/properties'

const types = ['Todos', 'Casa', 'Sobrado', 'Sítio', 'Área', 'Apartamento'] as const

function inferType(title: string) {
  const t = title.toLowerCase()
  if (t.includes('sítio') || t.includes('sitio') || t.includes('chácara') || t.includes('chacara'))
    return 'Sítio'
  if (t.includes('sobrado')) return 'Sobrado'
  if (t.includes('área') || t.includes('area') || t.includes('hotel')) return 'Área'
  if (t.includes('apto') || t.includes('apartamento')) return 'Apartamento'
  if (t.includes('casa')) return 'Casa'
  return 'Outros'
}

export function PropertySearch({
  onFilter,
}: {
  onFilter: (ids: string[] | null) => void
}) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<(typeof types)[number]>('Todos')
  const [city, setCity] = useState('Todas')

  const cities = useMemo(() => {
    const set = new Set<string>()
    for (const p of properties) {
      const part = p.address.split('-').pop()?.trim() || p.address
      if (part) set.add(part.replace(/,.*/, '').trim())
    }
    return ['Todas', ...Array.from(set).sort()]
  }, [])

  function apply(nextQuery = query, nextType = type, nextCity = city) {
    const q = nextQuery.trim().toLowerCase()
    const filtered = properties.filter((p) => {
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      const matchType = nextType === 'Todos' || inferType(p.title) === nextType
      const matchCity = nextCity === 'Todas' || p.address.includes(nextCity)
      return matchQ && matchType && matchCity
    })
    onFilter(filtered.map((p) => p.id))
  }

  return (
    <section className="relative z-20 -mt-10 px-5 sm:px-8">
      <motion.form
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        onSubmit={(e) => {
          e.preventDefault()
          apply()
          document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="mx-auto grid w-full max-w-7xl gap-3 rounded-2xl border border-line bg-white/95 p-4 shadow-soft backdrop-blur-md sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:p-5"
      >
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
            Buscar
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bairro, cidade ou tipo"
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-brand/30 transition focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
            Tipo
          </span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as (typeof types)[number])}
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-brand/30 transition focus:ring-2"
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
            className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-brand/30 transition focus:ring-2"
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep sm:min-w-[140px]"
          >
            <Search className="h-4 w-4" />
            Pesquisar
          </button>
        </div>
      </motion.form>
    </section>
  )
}
