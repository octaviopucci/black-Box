import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { VehicleStatus } from '@/types'
import { useApp } from '@/context/AppContext'
import { formatCurrency } from '@/utils'

/** Hook da dashboard: números sempre derivados do banco atual. */
export function useDashboard() {
  const {
    stats,
    salesChart,
    statusChart,
    vehicles,
    sales,
    expenses,
    history,
    setFilters,
  } = useApp()
  const navigate = useNavigate()

  const recentHistory = useMemo(
    () =>
      [...history].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
    [history],
  )

  const recentVehicles = useMemo(
    () =>
      vehicles
        .filter((v) => !v.archived)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [vehicles],
  )

  const insights = useMemo(() => {
    const margemMedia =
      stats.valorVendido > 0 ? (stats.lucroLiquido / stats.valorVendido) * 100 : 0
    const potencialLucro = stats.valorTotalEstoque - stats.investimentoTotal
    return {
      margemMedia,
      potencialLucro,
      totalVendas: sales.length,
      totalDespesas: expenses.reduce((a, e) => a + e.valor, 0),
      resumo: `${stats.totalEstoque} no pátio · ${stats.vendidos} vendidos · lucro líquido ${formatCurrency(stats.lucroLiquido)}`,
    }
  }, [stats, sales.length, expenses])

  const goToStock = (status?: VehicleStatus | '', consignado?: boolean, inStock?: boolean) => {
    setFilters({
      status: status || '',
      consignado: consignado === undefined ? null : consignado,
      inStock: inStock || undefined,
    })
    navigate('/estoque')
  }

  return {
    stats,
    salesChart,
    statusChart,
    recentHistory,
    recentVehicles,
    insights,
    goToStock,
  }
}
