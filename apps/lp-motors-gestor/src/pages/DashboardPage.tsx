import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Banknote,
  Car,
  Clock3,
  FileWarning,
  Package,
  Percent,
  Plus,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useMemo } from 'react'
import { SeverityBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { intelligenceService } from '@/services/intelligence'
import { formatCurrency, formatNumber, formatPercent } from '@/utils'
import { dashboardService } from '@/services'
import { brandDisplayName } from '@/utils/brand'

export function DashboardPage() {
  const { stats, alerts, vehicles, settings } = useApp()

  const grouped = useMemo(() => {
    const problemas = alerts.filter((a) => a.severity === 'critico')
    const atencao = alerts.filter((a) => a.severity === 'atencao')
    const financeiro = alerts.filter((a) => a.category === 'financeiro')
    const estoque = alerts.filter((a) => a.category === 'estoque')
    const oportunidades = alerts.filter((a) => a.severity === 'oportunidade')
    return { problemas, atencao, financeiro, estoque, oportunidades }
  }, [alerts])

  const capitalParado = useMemo(() => intelligenceService.capitalParado().slice(0, 5), [vehicles])

  const kpis = [
    { label: 'Estoque', value: formatNumber(stats.totalEstoque), icon: Package },
    { label: 'Capital investido', value: formatCurrency(stats.investimentoTotal), icon: Banknote },
    { label: 'Valor anunciado', value: formatCurrency(stats.valorTotalEstoque), icon: TrendingUp },
    { label: 'Lucro potencial', value: formatCurrency(stats.lucroPotencial), icon: Sparkles },
    { label: 'Vendidos', value: formatNumber(stats.vendidos), icon: ShoppingBag },
    { label: 'Margem média', value: formatPercent(stats.margemMedia), icon: Percent },
    { label: 'Dias médios', value: `${Math.round(stats.diasMediosEstoque)}d`, icon: Clock3 },
    { label: 'Capital parado', value: formatCurrency(stats.capitalParado), icon: AlertTriangle },
    { label: 'Docs pendentes', value: formatNumber(stats.docsPendentes), icon: FileWarning },
    { label: 'Alertas críticos', value: formatNumber(stats.alertasCriticos), icon: AlertTriangle, danger: true },
  ]

  const recentVehicles = dashboardService.recentVehicles(5)

  return (
    <div className="space-y-6">
      <div className="panel relative overflow-hidden p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-lp-hero opacity-80" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lp-accent">
              {brandDisplayName(settings)}
            </p>
            <h1 className="mt-1 font-cinema text-4xl text-lp-ink sm:text-5xl">Centro de Comando</h1>
            <p className="section-sub">Visão executiva do estoque e operação</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/veiculos/novo">
              <Button>
                <Plus className="h-4 w-4" />
                Novo veículo
              </Button>
            </Link>
            <Link to="/alertas">
              <Button variant="secondary">
                <AlertTriangle className="h-4 w-4" />
                Alertas ({alerts.length})
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Critical alerts first — especially mobile */}
      {grouped.problemas.length > 0 ? (
        <section className="panel border-lp-danger/30 bg-red-50/50 p-4">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-lp-danger">
            <AlertTriangle className="h-5 w-5" />
            Problemas críticos
          </h2>
          <ul className="space-y-2">
            {grouped.problemas.slice(0, 5).map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 rounded-lg bg-white px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-lp-ink">{a.title}</p>
                  <p className="text-xs text-lp-steel">{a.message}</p>
                </div>
                {a.vehicleId ? (
                  <Link to={`/veiculos/${a.vehicleId}`} className="btn-ghost shrink-0 text-xs text-lp-accent">
                    Ver
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`kpi ${kpi.danger ? 'border-lp-danger/30' : ''}`}>
            <div className="flex items-center justify-between">
              <p className="kpi-label">{kpi.label}</p>
              <kpi.icon className={`h-4 w-4 ${kpi.danger ? 'text-lp-danger' : 'text-lp-accent'}`} />
            </div>
            <p className={`kpi-value ${kpi.danger ? 'text-lp-danger' : ''}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AlertSection title="Atenção" items={grouped.atencao} />
        <AlertSection title="Financeiro" items={grouped.financeiro} />
        <AlertSection title="Estoque" items={grouped.estoque} />
        <AlertSection title="Oportunidades" items={grouped.oportunidades} accent />
      </div>

      <section className="panel p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Performance — capital parado</h2>
          <Link to="/inteligencia" className="text-sm font-semibold text-lp-accent hover:underline">
            Ver inteligência
          </Link>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Dias</th>
                <th>Custo real</th>
                <th>Margem est.</th>
              </tr>
            </thead>
            <tbody>
              {capitalParado.map((row) => (
                <tr key={row.vehicle.id}>
                  <td>
                    <Link to={`/veiculos/${row.vehicle.id}`} className="font-medium hover:text-lp-accent">
                      {row.vehicle.marca} {row.vehicle.modelo}
                    </Link>
                  </td>
                  <td>{row.days}d</td>
                  <td>{formatCurrency(row.custoReal)}</td>
                  <td>{formatPercent(row.margemEstimada)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Entradas recentes</h2>
          <Link to="/estoque" className="text-sm font-semibold text-lp-accent hover:underline">
            Ver estoque
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentVehicles.map((v) => (
            <Link
              key={v.id}
              to={`/veiculos/${v.id}`}
              className="flex items-center gap-3 rounded-lg border border-lp-line p-3 transition hover:border-lp-accent/40 hover:shadow-panel"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lp-mist text-lp-accent">
                <Car className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {v.marca} {v.modelo}
                </p>
                <p className="text-xs text-lp-steel">{v.placa || v.codigoInterno}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

function AlertSection({
  title,
  items,
  accent,
}: {
  title: string
  items: { id: string; title: string; message: string; severity: string; vehicleId?: string }[]
  accent?: boolean
}) {
  if (!items.length) return null
  return (
    <section className={`panel p-4 ${accent ? 'border-lp-accent/30' : ''}`}>
      <h2 className="mb-3 font-display text-lg font-bold">{title}</h2>
      <ul className="space-y-2">
        {items.slice(0, 4).map((a) => (
          <li key={a.id} className="rounded-lg border border-lp-line/80 bg-lp-mist/30 px-3 py-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="text-xs text-lp-steel">{a.message}</p>
              </div>
              <SeverityBadge severity={a.severity as 'critico' | 'atencao' | 'info' | 'oportunidade'} />
            </div>
            {a.vehicleId ? (
              <Link to={`/veiculos/${a.vehicleId}`} className="mt-1 inline-block text-xs font-semibold text-lp-accent">
                Abrir veículo →
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
