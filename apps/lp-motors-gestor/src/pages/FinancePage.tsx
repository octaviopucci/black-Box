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
        [e.descricao, e.categoria, e.fornecedorNome, e.observacao, String(e.valor)].join(' ').toLowerCase().includes(q),
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
        <h1 className="section-title">Financeiro</h1>
        <p className="section-sub">Despesas, vendas e consolidado</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="kpi">
          <p className="kpi-label">Despesas totais</p>
          <p className="kpi-value">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="kpi">
          <p className="kpi-label">Vendas totais</p>
          <p className="kpi-value">{formatCurrency(totalSales)}</p>
        </div>
        <div className="kpi">
          <p className="kpi-label">Lucro líquido</p>
          <p className="kpi-value text-lp-ok">{formatCurrency(totalProfit)}</p>
        </div>
      </div>

      <CategoryBars title="Despesas por categoria" data={byCategory} />

      <div className="panel space-y-4 p-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <SearchBar className="lg:col-span-2" value={search} onChange={setSearch} placeholder="Buscar despesa..." />
          <Select label="Veículo" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
            <option value="">Todos</option>
            {vehicles.filter((v) => !v.archived).map((v) => (
              <option key={v.id} value={v.id}>{v.marca} {v.modelo}</option>
            ))}
          </Select>
        </div>

        {!filteredExpenses.length ? (
          <EmptyState title="Nenhuma despesa" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Veículo</th>
                  <th>Fornecedor</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e) => {
                  const v = vehicles.find((x) => x.id === e.vehicleId)
                  return (
                    <tr key={e.id}>
                      <td>{formatDate(e.data)}</td>
                      <td>{e.descricao}</td>
                      <td>
                        {v ? (
                          <Link className="font-medium text-lp-accent hover:underline" to={`/veiculos/${v.id}`}>
                            {v.marca} {v.modelo}
                          </Link>
                        ) : '—'}
                      </td>
                      <td>{e.fornecedorNome || '—'}</td>
                      <td>{formatCurrency(e.valor)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
