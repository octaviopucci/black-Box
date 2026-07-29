import { useMemo, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { filterProperties, type Transaction } from '../data/properties'
import { site } from '../data/site'
import { Reveal } from './Reveal'

export type SearchFilters = {
  ids: string[] | null
  transaction: 'all' | Transaction
}

export function PropertySearch({ onFilter }: { onFilter: (f: SearchFilters) => void }) {
  const [transaction, setTransaction] = useState<'all' | Transaction>('all')
  const [city, setCity] = useState('all')
  const [beds, setBeds] = useState(0)
  const [query, setQuery] = useState('')

  const resultCount = useMemo(
    () =>
      filterProperties({
        transaction,
        city,
        minBeds: beds || undefined,
        query: query || undefined,
      }).length,
    [transaction, city, beds, query],
  )

  const apply = () => {
    const list = filterProperties({
      transaction,
      city,
      minBeds: beds || undefined,
      query: query || undefined,
    })
    onFilter({ ids: list.map((p) => p.id), transaction })
    document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="buscar" className="relative z-20 -mt-10 px-5 sm:-mt-14 sm:px-8">
      <Reveal className="mx-auto w-full max-w-7xl">
        <div className="border border-line/80 bg-white/90 p-5 shadow-lift backdrop-blur-md sm:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
                Busca inteligente
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-navy sm:text-3xl">
                O imóvel certo, sem ruído
              </h2>
            </div>
            <p className="text-sm text-mute">{resultCount} imóveis encontrados</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <label className="block lg:col-span-2">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
                Palavra-chave
              </span>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Bairro, código, título…"
                  className="w-full border border-line bg-chalk/60 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-brand"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
                Operação
              </span>
              <select
                value={transaction}
                onChange={(e) => setTransaction(e.target.value as 'all' | Transaction)}
                className="w-full border border-line bg-chalk/60 px-3 py-3 text-sm outline-none focus:border-brand"
              >
                <option value="all">Comprar ou alugar</option>
                <option value="sale">Comprar</option>
                <option value="rent">Alugar</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
                Cidade
              </span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-line bg-chalk/60 px-3 py-3 text-sm outline-none focus:border-brand"
              >
                <option value="all">Todas</option>
                {site.cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
                Quartos
              </span>
              <select
                value={beds}
                onChange={(e) => setBeds(Number(e.target.value))}
                className="w-full border border-line bg-chalk/60 px-3 py-3 text-sm outline-none focus:border-brand"
              >
                <option value={0}>Qualquer</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={apply}
              className="rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand"
            >
              Buscar imóveis
            </button>
            <button
              type="button"
              onClick={() => {
                setTransaction('all')
                setCity('all')
                setBeds(0)
                setQuery('')
                onFilter({ ids: null, transaction: 'all' })
              }}
              className="text-sm font-medium text-mute underline-offset-4 hover:text-navy hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
