import { Link } from 'react-router-dom'
import {
  Banknote,
  Car,
  CircleDollarSign,
  Clock3,
  HandCoins,
  Package,
  Percent,
  ShoppingBag,
  Wrench,
  Bookmark,
} from 'lucide-react'
import { DashboardCard } from '@/components/dashboard/DashboardCards'
import { SalesChart, StatusChart } from '@/components/dashboard/Charts'
import { Timeline } from '@/components/common/Timeline'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCurrency, formatDate, formatPercent } from '@/utils'

export function DashboardPage() {
  const { stats, salesChart, statusChart, recentHistory, recentVehicles, insights, goToStock } =
    useDashboard()

  const cards: Array<{
    title: string
    value: number
    icon: typeof Package
    hint?: string
    accent?: boolean
    currency?: boolean
    onClick?: () => void
  }> = [
    {
      title: 'Veículos em estoque',
      value: stats.totalEstoque,
      icon: Package,
      hint: 'Ativos no pátio (exclui vendidos)',
      onClick: () => goToStock('', undefined, true),
    },
    {
      title: 'Disponíveis',
      value: stats.disponiveis,
      icon: Car,
      accent: true,
      hint: 'Prontos para venda',
      onClick: () => goToStock('disponivel'),
    },
    {
      title: 'Reservados',
      value: stats.reservados,
      icon: Bookmark,
      onClick: () => goToStock('reservado'),
    },
    {
      title: 'Consignados',
      value: stats.consignados,
      icon: HandCoins,
      hint: 'Capital: só despesas',
      onClick: () => goToStock('', true),
    },
    {
      title: 'Vendidos',
      value: stats.vendidos,
      icon: ShoppingBag,
      hint: `${insights.totalVendas} venda(s) registradas`,
      onClick: () => goToStock('vendido'),
    },
    {
      title: 'Em oficina',
      value: stats.emOficina,
      icon: Wrench,
      onClick: () => goToStock('oficina'),
    },
    {
      title: 'Investimento total',
      value: stats.investimentoTotal,
      icon: CircleDollarSign,
      currency: true,
      hint: 'Compra + despesas do estoque atual',
    },
    {
      title: 'Valor total em estoque',
      value: stats.valorTotalEstoque,
      icon: Banknote,
      currency: true,
      hint: 'Soma dos preços anunciados',
    },
    {
      title: 'Valor vendido',
      value: stats.valorVendido,
      icon: Banknote,
      currency: true,
      hint: 'Receita bruta de vendas',
    },
    {
      title: 'Lucro bruto',
      value: stats.lucroBruto,
      icon: Percent,
      currency: true,
      hint: 'Venda − valor de compra',
    },
    {
      title: 'Lucro líquido',
      value: stats.lucroLiquido,
      icon: Percent,
      currency: true,
      accent: true,
      hint: `Margem média ${formatPercent(insights.margemMedia)}`,
    },
    {
      title: 'Ticket médio',
      value: stats.ticketMedio,
      icon: CircleDollarSign,
      currency: true,
      hint: 'Valor médio por venda',
    },
    {
      title: 'Dias médios em estoque',
      value: Math.round(stats.diasMediosEstoque),
      icon: Clock3,
      hint: 'Média dos veículos no pátio',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-wide">Dashboard</h1>
          <p className="mt-1 text-sm text-white/50">{insights.resumo}</p>
        </div>
        <div className="rounded-xl border border-brand-gray/50 bg-brand-graphite/80 px-4 py-2 text-sm">
          <span className="text-white/45">Lucro potencial do estoque: </span>
          <span
            className={
              insights.potencialLucro >= 0 ? 'font-semibold text-emerald-400' : 'font-semibold text-red-400'
            }
          >
            {formatCurrency(insights.potencialLucro)}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <DashboardCard key={card.title} {...card} index={i} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <SalesChart data={salesChart} />
        <StatusChart data={statusChart} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel p-5">
          <h2 className="mb-4 font-display text-lg font-semibold tracking-wide">
            Últimas movimentações
          </h2>
          <Timeline events={recentHistory} />
        </section>

        <section className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-wide">
              Últimos veículos cadastrados
            </h2>
            <Link to="/estoque" className="text-sm text-brand-red hover:underline">
              Ver estoque
            </Link>
          </div>
          <div className="space-y-3">
            {recentVehicles.map((v) => (
              <Link
                key={v.id}
                to={`/veiculos/${v.id}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-brand-gray/40 bg-brand-black/40 px-3 py-3 transition hover:border-brand-red/40"
              >
                <div>
                  <p className="font-medium">
                    {v.marca} {v.modelo}
                  </p>
                  <p className="text-xs text-white/45">
                    {v.placa || 'S/ placa'} · {formatDate(v.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={v.status} />
                  <p className="mt-1 text-xs text-white/50">
                    {v.precoAnunciado ? formatCurrency(v.precoAnunciado) : '—'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
