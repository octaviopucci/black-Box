import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchBar } from '@/components/common/SearchBar'
import { EmptyState } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatDate } from '@/utils'
import { EXPENSE_LABELS } from '@/utils/constants'
import { CategoryBars } from '@/components/dashboard/Charts'
import { Select } from '@/components/ui/Input'
import { sumExpenses } from '@/utils/finance'

export function FinancePage() {
  const { vehicles, expenses, sales } = useApp()
  const [search, setSearch] = useState('')
  const [vehicleId, setVehicleId] = useState('')

  const filteredExpenses = useMemo(() => {
    let items = expenses.slice()
    if (vehicleId) items = items.filter((e) => e.vehicleId === vehicleId)
    if (search) {
      const q = search.toLowerCase()
      items = items.filter((e) =>
        [e.descricao, e.categoria, e.observacao, String(e.valor)].join(' ').toLowerCase().includes(q),
      )
    }
    return items.sort((a, b) => b.data.localeCompare(a.data))
  }, [expenses, search, vehicleId])

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const e of expenses) {
      map.set(EXPENSE_LABELS[e.categoria], (map.get(EXPENSE_LABELS[e.categoria]) || 0) + e.valor)
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [expenses])

  const totalExpenses = sumExpenses(expenses)
  const totalSales = sales.reduce((a, s) => a + s.valorVendido, 0)
  const totalProfit = sales.reduce((a, s) => a + s.lucroLiquido, 0)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wide">Financeiro</h1>
        <p className="mt-1 text-sm text-white/50">
          Despesas por veículo, vendas e consolidado financeiro
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-white/45">Despesas totais</p>
          <p className="mt-1 font-display text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-white/45">Vendas totais</p>
          <p className="mt-1 font-display text-2xl font-bold">{formatCurrency(totalSales)}</p>
        </div>
        <div className="panel p-4">
          <p className="text-xs uppercase tracking-wide text-white/45">Lucro líquido</p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-400">
            {formatCurrency(totalProfit)}
          </p>
        </div>
      </div>

      <CategoryBars title="Despesas por categoria" data={byCategory} />

      <div className="panel space-y-4 p-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <SearchBar
            className="lg:col-span-2"
            value={search}
            onChange={setSearch}
            placeholder="Buscar despesa..."
          />
          <Select
            label="Veículo"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
          >
            <option value="">Todos</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.marca} {v.modelo} · {v.placa || 'S/ placa'}
              </option>
            ))}
          </Select>
        </div>

        {!filteredExpenses.length ? (
          <EmptyState title="Nenhuma despesa encontrada" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-brand-gray/50 text-left text-xs uppercase tracking-wide text-white/45">
                  <th className="px-2 py-3">Data</th>
                  <th className="px-2 py-3">Veículo</th>
                  <th className="px-2 py-3">Descrição</th>
                  <th className="px-2 py-3">Categoria</th>
                  <th className="px-2 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e) => {
                  const v = vehicles.find((x) => x.id === e.vehicleId)
                  return (
                    <tr key={e.id} className="border-b border-brand-gray/30">
                      <td className="px-2 py-3 text-white/70">{formatDate(e.data)}</td>
                      <td className="px-2 py-3">
                        {v ? (
                          <Link className="hover:text-brand-red" to={`/veiculos/${v.id}`}>
                            {v.marca} {v.modelo}
                          </Link>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-2 py-3">{e.descricao}</td>
                      <td className="px-2 py-3 text-white/60">{EXPENSE_LABELS[e.categoria]}</td>
                      <td className="px-2 py-3 text-right font-medium">
                        {formatCurrency(e.valor)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <section className="panel p-4">
        <h2 className="mb-3 font-display text-lg font-semibold tracking-wide">Vendas recentes</h2>
        <div className="space-y-2">
          {sales.slice(0, 10).map((s) => {
            const v = vehicles.find((x) => x.id === s.vehicleId)
            return (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-gray/40 bg-brand-black/30 px-3 py-3"
              >
                <div>
                  <p className="font-medium">
                    {v ? `${v.marca} ${v.modelo}` : s.vehicleId} · {s.clienteNome}
                  </p>
                  <p className="text-xs text-white/45">{formatDate(s.dataVenda)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(s.valorVendido)}</p>
                  <p className="text-xs text-emerald-400">
                    Líquido {formatCurrency(s.lucroLiquido)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
