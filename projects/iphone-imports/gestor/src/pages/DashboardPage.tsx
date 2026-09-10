import { useMemo } from 'react'
import {
  TrendingUp,
  Package,
  Users,
  Boxes,
  DollarSign,
  Percent,
  Store,
  ShoppingBag,
  BarChart3,
} from 'lucide-react'
import { loadDatabase } from '@/services/database'
import { computeDashboardAnalytics, formatPeriodComparison, getPreviousPeriodMetrics } from '@/lib/sales-analytics'
import { formatCurrency } from '@/utils'

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string
  value: string
  sub?: string
  icon: typeof DollarSign
}) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value mt-1 text-2xl sm:text-3xl">{value}</p>
          {sub && <p className="mt-1 text-xs text-brand-muted">{sub}</p>}
        </div>
        <div className="rounded-lg border border-brand-border bg-brand-elevated p-2">
          <Icon className="h-5 w-5 text-brand-silver" />
        </div>
      </div>
    </div>
  )
}

function PeriodRow({
  label,
  units,
  revenue,
  margin,
  avgTicket,
  marginPercent,
  comparison,
}: {
  label: string
  units: number
  revenue: number
  margin: number
  avgTicket: number
  marginPercent: number
  comparison?: string
}) {
  const compPositive = comparison?.startsWith('+')
  const compNegative = comparison?.startsWith('-')

  return (
    <tr className="border-t border-brand-border hover:bg-white/[0.02]">
      <td className="p-3 font-medium">{label}</td>
      <td className="p-3 text-right tabular-nums">{units}</td>
      <td className="p-3 text-right tabular-nums font-semibold text-brand-silver">{formatCurrency(revenue)}</td>
      <td className="p-3 text-right tabular-nums">{formatCurrency(margin)}</td>
      <td className="p-3 text-right tabular-nums text-brand-gray">{formatCurrency(avgTicket)}</td>
      <td className="p-3 text-right tabular-nums text-brand-gray">{marginPercent.toFixed(1)}%</td>
      <td className="p-3 text-right tabular-nums text-xs">
        {comparison && comparison !== '—' ? (
          <span
            className={
              compPositive ? 'text-emerald-400' : compNegative ? 'text-red-400' : 'text-brand-muted'
            }
          >
            {comparison}
          </span>
        ) : (
          <span className="text-brand-muted">—</span>
        )}
      </td>
    </tr>
  )
}

export function DashboardPage() {
  const db = loadDatabase()

  const analytics = useMemo(() => {
    if (!db) return null
    return computeDashboardAnalytics(db)
  }, [db])

  if (!db || !analytics) return <p>Carregue os dados fazendo login.</p>

  const { totals, periods, sales } = analytics
  const maxMonthly = Math.max(...totals.monthlyRevenue.map((m) => m.revenue), 1)

  const highlightPeriods = ['today', 'week', 'month', 'quarter', 'semester', 'year', 'all']
  const heroPeriods = periods.filter((p) => highlightPeriods.includes(p.id))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-brand-accent">{db.settings.storeName}</h1>
        <p className="text-brand-gray">Dashboard completo · vendas, estoque e CRM</p>
      </div>

      {/* KPIs principais */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-muted">
          <TrendingUp className="h-4 w-4" />
          Visão geral
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            icon={DollarSign}
            label="Faturamento total"
            value={formatCurrency(totals.allTime.revenue)}
            sub={`${totals.allTime.units} unidades vendidas`}
          />
          <KpiCard
            icon={ShoppingBag}
            label="Ticket médio"
            value={formatCurrency(totals.allTime.avgTicket)}
            sub="Média por venda"
          />
          <KpiCard
            icon={Percent}
            label="Margem total"
            value={formatCurrency(totals.allTime.margin)}
            sub={`${totals.allTime.marginPercent.toFixed(1)}% sobre faturamento`}
          />
          <KpiCard
            icon={Boxes}
            label="Valor em estoque"
            value={formatCurrency(totals.inventory.stockValue)}
            sub={`${totals.inventory.available} unidades disponíveis`}
          />
        </div>
      </section>

      {/* Destaques por período */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-muted">
          <BarChart3 className="h-4 w-4" />
          Vendas por período
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {heroPeriods.map((p) => {
            const prev = getPreviousPeriodMetrics(p.id, sales)
            const comp = prev ? formatPeriodComparison(p, prev) : undefined
            return (
              <div key={p.id} className="card">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">{p.label}</p>
                <p className="mt-2 text-xl font-black text-brand-silver">{formatCurrency(p.revenue)}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-gray">
                  <span>{p.units} vendas</span>
                  <span>Ticket {formatCurrency(p.avgTicket)}</span>
                  <span>Margem {formatCurrency(p.margin)}</span>
                  {comp && comp !== '—' && (
                    <span className={comp.startsWith('+') ? 'text-emerald-400' : comp.startsWith('-') ? 'text-red-400' : ''}>
                      vs anterior {comp}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Tabela completa de períodos */}
      <section className="card overflow-hidden p-0">
        <div className="border-b border-brand-border p-4">
          <h2 className="font-bold">Relatório detalhado por período</h2>
          <p className="text-sm text-brand-gray">
            Hoje, ontem, semana, mês, trimestre, semestre, ano e histórico completo
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-brand-elevated text-brand-gray">
              <tr>
                <th className="p-3">Período</th>
                <th className="p-3 text-right">Unidades</th>
                <th className="p-3 text-right">Faturamento</th>
                <th className="p-3 text-right">Margem</th>
                <th className="p-3 text-right">Ticket médio</th>
                <th className="p-3 text-right">Margem %</th>
                <th className="p-3 text-right">vs período ant.</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => {
                const prev = getPreviousPeriodMetrics(p.id, sales)
                const comp = prev ? formatPeriodComparison(p, prev) : undefined
                return (
                  <PeriodRow
                    key={p.id}
                    label={p.label}
                    units={p.units}
                    revenue={p.revenue}
                    margin={p.margin}
                    avgTicket={p.avgTicket}
                    marginPercent={p.marginPercent}
                    comparison={comp}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gráfico mensal + operacional */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 font-bold">Faturamento mensal (12 meses)</h2>
          <div className="flex h-48 items-end gap-1">
            {totals.monthlyRevenue.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-brand-muted to-brand-silver transition-all"
                  style={{ height: `${Math.max((m.revenue / maxMonthly) * 100, m.revenue > 0 ? 4 : 0)}%` }}
                  title={`${m.month}: ${formatCurrency(m.revenue)} (${m.units} vendas)`}
                />
                <span className="text-[9px] text-brand-muted [writing-mode:vertical-lr] sm:[writing-mode:horizontal-tb]">
                  {m.month}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="mb-4 font-bold">Operacional</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Em estoque', value: totals.inventory.available, icon: Boxes },
              { label: 'Reservadas', value: totals.inventory.reserved, icon: Package },
              { label: 'Vendidas', value: totals.inventory.sold, icon: ShoppingBag },
              { label: 'Manutenção', value: totals.inventory.maintenance, icon: Package },
              { label: 'Produtos catálogo', value: totals.catalog.products, icon: Package },
              { label: 'Publicados', value: totals.catalog.published, icon: Package },
              { label: 'Em promoção', value: totals.catalog.onSale, icon: Percent },
              { label: 'Clientes CRM', value: totals.crm.customers, icon: Users },
              { label: 'Interações CRM', value: totals.crm.interactions, icon: Users },
              { label: 'Vendas CRM', value: totals.crm.saleInteractions, icon: ShoppingBag },
              { label: 'Lojas ativas', value: totals.stores.active, icon: Store },
              { label: 'Custo em estoque', value: formatCurrency(totals.inventory.stockCost), icon: DollarSign },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-brand-border bg-brand-elevated p-3">
                <div className="flex items-center gap-2 text-brand-muted">
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="text-xs">{item.label}</span>
                </div>
                <p className="mt-1 text-lg font-bold text-brand-silver">
                  {typeof item.value === 'number' ? item.value : item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Top produtos / lojas + vendas recentes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="mb-4 font-bold">Top produtos (faturamento)</h2>
          {totals.topProducts.length === 0 ? (
            <p className="text-sm text-brand-gray">Nenhuma venda registrada ainda.</p>
          ) : (
            <ul className="space-y-2">
              {totals.topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between rounded-lg border border-brand-border bg-brand-elevated px-3 py-2">
                  <span className="text-sm">
                    <span className="mr-2 text-brand-muted">{i + 1}.</span>
                    {p.name}
                  </span>
                  <span className="text-sm font-semibold text-brand-silver">
                    {formatCurrency(p.revenue)} <span className="text-brand-muted">({p.units})</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2 className="mb-4 font-bold">Top lojas (faturamento)</h2>
          {totals.topStores.length === 0 ? (
            <p className="text-sm text-brand-gray">Nenhuma venda registrada ainda.</p>
          ) : (
            <ul className="space-y-2">
              {totals.topStores.map((s, i) => (
                <li key={s.name} className="flex items-center justify-between rounded-lg border border-brand-border bg-brand-elevated px-3 py-2">
                  <span className="text-sm">
                    <span className="mr-2 text-brand-muted">{i + 1}.</span>
                    {s.name}
                  </span>
                  <span className="text-sm font-semibold text-brand-silver">
                    {formatCurrency(s.revenue)} <span className="text-brand-muted">({s.units})</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card overflow-hidden p-0">
        <div className="border-b border-brand-border p-4">
          <h2 className="font-bold">Últimas vendas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-elevated text-brand-gray">
              <tr>
                <th className="p-3">Data</th>
                <th className="p-3">Produto</th>
                <th className="p-3">Loja</th>
                <th className="p-3">Condição</th>
                <th className="p-3 text-right">Valor</th>
                <th className="p-3 text-right">Margem</th>
              </tr>
            </thead>
            <tbody>
              {totals.recentSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-brand-gray">
                    Marque unidades como vendidas no estoque para ver o histórico aqui.
                  </td>
                </tr>
              ) : (
                totals.recentSales.map((sale) => (
                  <tr key={sale.unitId} className="border-t border-brand-border">
                    <td className="p-3 text-brand-gray">
                      {sale.soldAt.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-3 font-medium">{sale.productName}</td>
                    <td className="p-3">{sale.storeName}</td>
                    <td className="p-3 capitalize text-brand-gray">{sale.condition}</td>
                    <td className="p-3 text-right font-semibold text-brand-silver">
                      {formatCurrency(sale.salePrice)}
                    </td>
                    <td className="p-3 text-right text-brand-gray">{formatCurrency(sale.margin)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
