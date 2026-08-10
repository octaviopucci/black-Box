import type { Expense, Sale, Vehicle, VehicleScore, OrgSettings } from '@/types'
import { daysBetween } from '@/utils'

/** Soma despesas (exclui categoria compra/aquisicao se presente — valor já está no veículo). */
export function sumExpenses(expenses: Expense[], excludeCompra = true): number {
  return expenses.reduce((acc, e) => {
    if (excludeCompra && (e.categoria === 'compra' || e.categoria === 'aquisicao')) return acc
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

/** CUSTO REAL = aquisição + todos os custos associados */
export function calcRealCost(vehicle: Vehicle, expenses: Expense[]): number {
  const extras = sumExpenses(expensesForVehicle(expenses, vehicle.id), true)
  if (vehicle.consignado) return extras
  return round2((vehicle.valorCompra || 0) + extras)
}

export function calcPotentialProfit(vehicle: Vehicle, expenses: Expense[]): number {
  const real = calcRealCost(vehicle, expenses)
  const price = vehicle.precoAnunciado || vehicle.precoMinimo || 0
  return round2(price - real)
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
  const custoReal = calcRealCost(vehicle, expenses)
  const lucroBruto = calcGrossProfit(valorVendido, vehicle.valorCompra)
  const lucroLiquido = calcNetProfit(
    valorVendido,
    vehicle.valorCompra,
    expensesTotal,
    comissao,
  )
  const investment = vehicle.consignado
    ? expensesTotal
    : vehicle.valorCompra + expensesTotal
  const roi = calcROI(lucroLiquido, investment || vehicle.valorCompra || 1)
  const margem = calcMargin(lucroLiquido, valorVendido)
  const diasEstoque = daysBetween(vehicle.dataCompra, dataVenda)

  return {
    expensesTotal,
    custoReal,
    lucroBruto,
    lucroLiquido,
    roi,
    margem,
    diasEstoque,
    investment,
  }
}

export function vehicleStockValue(vehicle: Vehicle): number {
  return vehicle.precoAnunciado || vehicle.precoMinimo || vehicle.valorCompra || 0
}

export function vehicleInvestment(vehicle: Vehicle, expenses: Expense[]): number {
  return calcRealCost(vehicle, expenses)
}

export function isActiveStock(vehicle: Vehicle): boolean {
  return (
    !vehicle.archived &&
    !vehicle.draft &&
    !['vendido', 'entregue', 'cancelado'].includes(normalizeStatus(vehicle.status))
  )
}

export function isSoldStatus(status: Vehicle['status']): boolean {
  const s = normalizeStatus(status)
  return s === 'vendido' || s === 'entregue'
}

export function normalizeStatus(status: Vehicle['status']): Vehicle['status'] {
  switch (status) {
    case 'disponivel':
      return 'pronto'
    case 'oficina':
      return 'preparacao'
    case 'financiado':
      return 'reservado'
    case 'consignado':
      return 'anunciado'
    default:
      return status
  }
}

export function stockAgeDays(vehicle: Vehicle): number {
  return daysBetween(vehicle.dataCompra || vehicle.createdAt)
}

export function defaultOrgSettings(): OrgSettings {
  return {
    alertDaysWarn: 30,
    alertDaysAlert: 45,
    alertDaysCritical: 60,
    minMarginPercent: 8,
    brandConcentrationLimit: 20,
    lowStockDemandGap: 15,
    docExpiryWarnDays: 30,
  }
}

export function calcVehicleScore(
  vehicle: Vehicle,
  expenses: Expense[],
  checklistDoneRatio: number,
  docsOkRatio: number,
  settings: OrgSettings,
): VehicleScore {
  const days = stockAgeDays(vehicle)
  const real = calcRealCost(vehicle, expenses)
  const price = vehicle.precoAnunciado || 0
  const potential = price - real
  const margin = price ? (potential / price) * 100 : 0

  const documentacao = Math.round(docsOkRatio * 100)
  const margem = Math.max(0, Math.min(100, Math.round((margin / Math.max(settings.minMarginPercent, 1)) * 50)))
  const tempoEstoque =
    days >= settings.alertDaysCritical
      ? 20
      : days >= settings.alertDaysAlert
        ? 45
        : days >= settings.alertDaysWarn
          ? 70
          : 95
  const preparacao = Math.round(checklistDoneRatio * 100)
  const preco = vehicle.precoAnunciado > 0 ? (vehicle.precoMinimo > 0 ? 90 : 70) : 30
  const mercado =
    vehicle.precoFipe > 0
      ? Math.max(0, Math.min(100, 100 - Math.abs(((price || real) - vehicle.precoFipe) / vehicle.precoFipe) * 100))
      : 60
  const capitalParado = Math.max(20, 100 - Math.min(80, days))

  const parts = { documentacao, margem, tempoEstoque, preparacao, preco, mercado, capitalParado }
  const total = Math.round(
    (documentacao * 0.15 +
      margem * 0.2 +
      tempoEstoque * 0.2 +
      preparacao * 0.15 +
      preco * 0.1 +
      mercado * 0.1 +
      capitalParado * 0.1),
  )

  return { total, parts }
}

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
