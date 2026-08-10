import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatPercent } from '@/utils'
import { SalesChart } from '@/components/dashboard/Charts'

export function ProfitabilityPage() {
  const { sales, stats, salesChart } = useApp()

  const byVehicle = useMemo(() => {
    return [...sales]
      .sort((a, b) => b.margem - a.margem)
      .slice(0, 15)
  }, [sales])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Rentabilidade</h1>
        <p className="section-sub">Margens, ROI e performance de vendas</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="kpi">
          <p className="kpi-label">Margem média</p>
          <p className="kpi-value">{formatPercent(stats.margemMedia)}</p>
        </div>
        <div className="kpi">
          <p className="kpi-label">Lucro líquido</p>
          <p className="kpi-value text-lp-ok">{formatCurrency(stats.lucroLiquido)}</p>
        </div>
        <div className="kpi">
          <p className="kpi-label">Lucro potencial</p>
          <p className="kpi-value">{formatCurrency(stats.lucroPotencial)}</p>
        </div>
        <div className="kpi">
          <p className="kpi-label">Ticket médio</p>
          <p className="kpi-value">{formatCurrency(stats.ticketMedio)}</p>
        </div>
      </div>

      <SalesChart data={salesChart} />

      <section className="panel p-4">
        <h2 className="mb-4 font-display text-lg font-bold">Top vendas por margem</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Lucro</th>
                <th>Margem</th>
                <th>ROI</th>
                <th>Dias</th>
              </tr>
            </thead>
            <tbody>
              {byVehicle.map((s) => (
                <tr key={s.id}>
                  <td>{s.clienteNome}</td>
                  <td>{formatCurrency(s.valorVendido)}</td>
                  <td>{formatCurrency(s.lucroLiquido)}</td>
                  <td>{formatPercent(s.margem)}</td>
                  <td>{formatPercent(s.roi)}</td>
                  <td>{s.diasEstoque}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
