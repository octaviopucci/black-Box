import type { Expense, Sale, Vehicle } from '@/types'
import { daysBetween } from '@/utils'

/** Soma despesas (exclui categoria compra se presente — valor já está no veículo). */
export function sumExpenses(expenses: Expense[], excludeCompra = true): number {
  return expenses.reduce((acc, e) => {
    if (excludeCompra && e.categoria === 'compra') return acc
    return acc + (e.valor || 0)
  }, 0)
}

export function calcGrossProfit(saleValue: number, purchaseValue: number): number {
  return round2(saleValue - purchaseValue)
}

export function calcNetProfit(
  saleValue: number,
  purchaseValue: number,
  expensesTotal: number,
  commission = 0,
): number {
  return round2(saleValue - purchaseValue - expensesTotal - commission)
}

export function calcROI(netProfit: number, investment: number): number {
  if (!investment) return 0
  return round2((netProfit / investment) * 100)
}

export function calcMargin(netProfit: number, saleValue: number): number {
  if (!saleValue) return 0
  return round2((netProfit / saleValue) * 100)
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function expensesForVehicle(expenses: Expense[], vehicleId: string): Expense[] {
  return expenses.filter((e) => e.vehicleId === vehicleId)
}

export function calcSaleMetrics(
  vehicle: Vehicle,
  expenses: Expense[],
  valorVendido: number,
  comissao: number,
  dataVenda: string,
) {
  const vehicleExpenses = expensesForVehicle(expenses, vehicle.id)
  const expensesTotal = sumExpenses(vehicleExpenses, true)
  const lucroBruto = calcGrossProfit(valorVendido, vehicle.valorCompra)
  const lucroLiquido = calcNetProfit(
    valorVendido,
    vehicle.valorCompra,
    expensesTotal,
    comissao,
  )
  // Investimento = capital próprio na operação
  // Consignado: só despesas; próprio: compra + despesas
  const investment = vehicle.consignado
    ? expensesTotal
    : vehicle.valorCompra + expensesTotal
  const roi = calcROI(lucroLiquido, investment || vehicle.valorCompra || 1)
  const margem = calcMargin(lucroLiquido, valorVendido)
  const diasEstoque = daysBetween(vehicle.dataCompra, dataVenda)

  return {
    expensesTotal,
    lucroBruto,
    lucroLiquido,
    roi,
    margem,
    diasEstoque,
    investment,
  }
}

/** Valor de mercado anunciado no estoque. */
export function vehicleStockValue(vehicle: Vehicle): number {
  return vehicle.precoAnunciado || vehicle.precoMinimo || vehicle.valorCompra || 0
}

/** Capital investido no veículo (ainda no estoque). */
export function vehicleInvestment(vehicle: Vehicle, expenses: Expense[]): number {
  const exp = sumExpenses(expensesForVehicle(expenses, vehicle.id), true)
  if (vehicle.consignado || vehicle.status === 'consignado') return exp
  return vehicle.valorCompra + exp
}

export function isActiveStock(vehicle: Vehicle): boolean {
  return !vehicle.archived && !['vendido', 'entregue'].includes(vehicle.status)
}

export function isSoldStatus(status: Vehicle['status']): boolean {
  return status === 'vendido' || status === 'entregue'
}

/** Últimos 12 meses com zeros preenchidos — gráfico sempre legível. */
export function aggregateSalesByMonth(
  sales: Sale[],
  months = 12,
): { mes: string; vendas: number; lucro: number; quantidade: number }[] {
  const now = new Date()
  const keys: string[] = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  const map = new Map<string, { vendas: number; lucro: number; quantidade: number }>()
  for (const key of keys) map.set(key, { vendas: 0, lucro: 0, quantidade: 0 })

  for (const sale of sales) {
    const d = new Date(sale.dataVenda.includes('T') ? sale.dataVenda : `${sale.dataVenda}T12:00:00`)
    if (Number.isNaN(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const current = map.get(key)
    if (!current) continue
    current.vendas += sale.valorVendido
    current.lucro += sale.lucroLiquido
    current.quantidade += 1
  }

  return keys.map((mes) => ({
    mes: formatMonthLabel(mes),
    ...(map.get(mes) || { vendas: 0, lucro: 0, quantidade: 0 }),
  }))
}

function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[Number(m) - 1]}/${y.slice(2)}`
}
