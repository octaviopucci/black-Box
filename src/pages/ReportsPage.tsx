import { useMemo, useState } from 'react'
import { FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatDate, daysBetween } from '@/utils'
import { EXPENSE_LABELS } from '@/utils/constants'
import { CategoryBars, SalesChart } from '@/components/dashboard/Charts'
import { isActiveStock } from '@/utils/finance'

type ReportKey =
  | 'vendidos'
  | 'disponiveis'
  | 'consignados'
  | 'lucro_mensal'
  | 'lucro_anual'
  | 'investimento'
  | 'despesas'
  | 'marcas'
  | 'parados30'
  | 'parados60'
  | 'parados90'

const REPORTS: { key: ReportKey; label: string }[] = [
  { key: 'vendidos', label: 'Veículos vendidos' },
  { key: 'disponiveis', label: 'Em estoque / prontos' },
  { key: 'consignados', label: 'Consignados' },
  { key: 'lucro_mensal', label: 'Lucro mensal' },
  { key: 'lucro_anual', label: 'Lucro anual' },
  { key: 'investimento', label: 'Investimento total' },
  { key: 'despesas', label: 'Despesas por categoria' },
  { key: 'marcas', label: 'Marcas mais vendidas' },
  { key: 'parados30', label: 'Parados +30 dias' },
  { key: 'parados60', label: 'Parados +60 dias' },
  { key: 'parados90', label: 'Parados +90 dias' },
]

export function ReportsPage() {
  const { reports, salesChart, stats, vehicles } = useApp()
  const [active, setActive] = useState<ReportKey>('vendidos')

  const payload = useMemo(() => {
    switch (active) {
      case 'vendidos':
        return reports.soldVehicles().map((v) => ({
          veiculo: `${v.marca} ${v.modelo}`,
          placa: v.placa,
          compra: formatCurrency(v.valorCompra),
          status: v.status,
        }))
      case 'disponiveis':
        return vehicles
          .filter((v) => isActiveStock(v) && ['pronto', 'anunciado', 'disponivel'].includes(v.status))
          .map((v) => ({
            veiculo: `${v.marca} ${v.modelo}`,
            placa: v.placa,
            anuncio: formatCurrency(v.precoAnunciado),
            dias: daysBetween(v.dataCompra),
          }))
      case 'consignados':
        return reports.consignados().map((v) => ({
          veiculo: `${v.marca} ${v.modelo}`,
          placa: v.placa,
          fornecedor: v.fornecedor,
          anuncio: formatCurrency(v.precoAnunciado),
        }))
      case 'lucro_mensal':
        return reports.monthlyProfit().map((m) => ({
          mes: m.mes,
          vendas: formatCurrency(m.vendas),
          lucro: formatCurrency(m.lucro),
        }))
      case 'lucro_anual':
        return reports.annualProfit().map((a) => ({
          ano: a.ano,
          lucro: formatCurrency(a.lucro),
        }))
      case 'investimento':
        return [{ investimentoTotal: formatCurrency(reports.totalInvestment()) }]
      case 'despesas':
        return Object.entries(reports.expensesByCategory()).map(([cat, valor]) => ({
          categoria: EXPENSE_LABELS[cat as keyof typeof EXPENSE_LABELS] || cat,
          valor: formatCurrency(valor),
        }))
      case 'marcas':
        return reports.topBrands().map((b) => ({
          marca: b.marca,
          quantidade: b.qtd,
        }))
      case 'parados30':
        return reports.stalled(30).map((v) => ({
          veiculo: `${v.marca} ${v.modelo}`,
          placa: v.placa,
          dias: daysBetween(v.dataCompra),
          compra: formatDate(v.dataCompra),
        }))
      case 'parados60':
        return reports.stalled(60).map((v) => ({
          veiculo: `${v.marca} ${v.modelo}`,
          placa: v.placa,
          dias: daysBetween(v.dataCompra),
          compra: formatDate(v.dataCompra),
        }))
      case 'parados90':
        return reports.stalled(90).map((v) => ({
          veiculo: `${v.marca} ${v.modelo}`,
          placa: v.placa,
          dias: daysBetween(v.dataCompra),
          compra: formatDate(v.dataCompra),
        }))
      default:
        return []
    }
  }, [active, reports, vehicles])

  const columns = payload.length ? Object.keys(payload[0]) : []
  const label = REPORTS.find((r) => r.key === active)?.label || 'Relatório'

  const toRows = () => [
    columns.map((c) => c.toUpperCase()),
    ...payload.map((row) => columns.map((c) => String((row as Record<string, unknown>)[c] ?? ''))),
  ]

  const exportPdf = () => reports.exportPDF(label, toRows())
  const exportJson = () => reports.exportJSON(`lp-motors-${active}.json`, payload)
  const exportCsv = () => reports.exportCSV(`lp-motors-${active}.csv`, toRows())

  const expenseChart = Object.entries(reports.expensesByCategory()).map(([name, value]) => ({
    name: EXPENSE_LABELS[name as keyof typeof EXPENSE_LABELS] || name,
    value,
  }))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Relatórios</h1>
        <p className="section-sub">
          Análise operacional e financeira · Investimento atual {formatCurrency(stats.investimentoTotal)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {REPORTS.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setActive(r.key)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              active === r.key
                ? 'bg-lp-accent text-white'
                : 'border border-lp-line bg-white text-lp-steel hover:text-lp-ink'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SalesChart data={salesChart} />
        <CategoryBars title="Despesas por categoria" data={expenseChart} />
      </div>

      <section className="panel p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-bold">{label}</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportPdf}>
              <FileText className="h-4 w-4" /> PDF
            </Button>
            <Button variant="secondary" onClick={exportCsv}>
              <FileSpreadsheet className="h-4 w-4" /> CSV / Excel
            </Button>
            <Button variant="ghost" onClick={exportJson}>
              <FileJson className="h-4 w-4" /> JSON
            </Button>
          </div>
        </div>

        {!payload.length ? (
          <div className="empty-state py-10">
            <p className="font-medium text-lp-ink">Sem dados para este relatório.</p>
            <p className="text-sm text-lp-steel">Cadastre veículos ou vendas para gerar análises.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payload.map((row, i) => (
                  <tr key={i}>
                    {columns.map((c) => (
                      <td key={c}>{String((row as Record<string, unknown>)[c] ?? '')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
