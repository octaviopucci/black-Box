import { useMemo, useState } from 'react'
import { Download, FileJson, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatDate, daysBetween } from '@/utils'
import { EXPENSE_LABELS } from '@/utils/constants'
import { CategoryBars, SalesChart } from '@/components/dashboard/Charts'

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
  { key: 'disponiveis', label: 'Veículos disponíveis' },
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
  const { reports, salesChart, stats } = useApp()
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
        return reports.availableVehicles().map((v) => ({
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
          vendidos: b.qtd,
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
  }, [active, reports])

  const columns = payload.length ? Object.keys(payload[0]) : []
  const label = REPORTS.find((r) => r.key === active)?.label || 'Relatório'

  const exportPdf = () => {
    const rows = [
      columns.map((c) => c.toUpperCase()),
      ...payload.map((row) => columns.map((c) => String((row as Record<string, unknown>)[c] ?? ''))),
    ]
    reports.exportPDF(label, rows)
  }

  const exportJson = () => {
    reports.exportJSON(`relatorio-${active}.json`, payload)
  }

  const expenseChart = Object.entries(reports.expensesByCategory()).map(([name, value]) => ({
    name: EXPENSE_LABELS[name as keyof typeof EXPENSE_LABELS] || name,
    value,
  }))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-wide">Relatórios</h1>
        <p className="mt-1 text-sm text-white/50">
          Análise operacional e financeira · Investimento atual {formatCurrency(stats.investimentoTotal)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {REPORTS.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setActive(r.key)}
            className={`rounded-xl px-3 py-2 text-sm transition ${
              active === r.key
                ? 'bg-brand-red/20 text-white ring-1 ring-brand-red/40'
                : 'bg-brand-graphite text-white/60 hover:text-white'
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
          <h2 className="font-display text-lg font-semibold tracking-wide">{label}</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportPdf}>
              <FileText className="h-4 w-4" /> Exportar PDF
            </Button>
            <Button variant="secondary" onClick={exportJson}>
              <FileJson className="h-4 w-4" /> Exportar JSON
            </Button>
            <Button variant="ghost" onClick={exportJson}>
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </div>

        {!payload.length ? (
          <p className="text-sm text-white/45">Sem dados para este relatório.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-brand-gray/50 text-left text-xs uppercase tracking-wide text-white/45">
                  {columns.map((c) => (
                    <th key={c} className="px-3 py-3">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payload.map((row, i) => (
                  <tr key={i} className="border-b border-brand-gray/30">
                    {columns.map((c) => (
                      <td key={c} className="px-3 py-3">
                        {String((row as Record<string, unknown>)[c] ?? '')}
                      </td>
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
