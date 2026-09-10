import type { CatalogProduct, InventoryUnit, OrgDatabase } from '@/types'

export interface SaleRecord {
  unitId: string
  productId: string
  productName: string
  storeId: string
  storeName: string
  soldAt: Date
  salePrice: number
  purchasePrice: number
  margin: number
  condition: string
}

export interface PeriodMetrics {
  id: string
  label: string
  units: number
  revenue: number
  cost: number
  margin: number
  avgTicket: number
  marginPercent: number
}

export interface DashboardAnalytics {
  sales: SaleRecord[]
  periods: PeriodMetrics[]
  totals: {
    allTime: PeriodMetrics
    inventory: {
      available: number
      reserved: number
      sold: number
      maintenance: number
      stockValue: number
      stockCost: number
    }
    catalog: { products: number; published: number; onSale: number }
    crm: { customers: number; interactions: number; saleInteractions: number }
    stores: { active: number; total: number }
    topProducts: Array<{ name: string; units: number; revenue: number }>
    topStores: Array<{ name: string; units: number; revenue: number }>
    monthlyRevenue: Array<{ month: string; revenue: number; units: number }>
    recentSales: SaleRecord[]
  }
}

interface DateRange {
  start: Date
  end: Date
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function endOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

function startOfWeek(d: Date): Date {
  const x = startOfDay(d)
  const day = x.getDay()
  const diff = day === 0 ? 6 : day - 1
  x.setDate(x.getDate() - diff)
  return x
}

function endOfWeek(d: Date): Date {
  const x = startOfWeek(d)
  x.setDate(x.getDate() + 6)
  return endOfDay(x)
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function endOfMonth(d: Date): Date {
  return endOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0))
}

function startOfQuarter(d: Date): Date {
  const q = Math.floor(d.getMonth() / 3)
  return new Date(d.getFullYear(), q * 3, 1)
}

function endOfQuarter(d: Date): Date {
  const start = startOfQuarter(d)
  return endOfDay(new Date(start.getFullYear(), start.getMonth() + 3, 0))
}

function startOfSemester(d: Date): Date {
  const month = d.getMonth() < 6 ? 0 : 6
  return new Date(d.getFullYear(), month, 1)
}

function endOfSemester(d: Date): Date {
  const start = startOfSemester(d)
  return endOfDay(new Date(start.getFullYear(), start.getMonth() + 6, 0))
}

function startOfYear(d: Date): Date {
  return new Date(d.getFullYear(), 0, 1)
}

function endOfYear(d: Date): Date {
  return endOfDay(new Date(d.getFullYear(), 11, 31))
}

function shiftRange(range: DateRange, ms: number): DateRange {
  return {
    start: new Date(range.start.getTime() - ms),
    end: new Date(range.end.getTime() - ms),
  }
}

function rangeDuration(range: DateRange): number {
  return range.end.getTime() - range.start.getTime()
}

function buildPeriodDefinitions(now: Date): Array<{ id: string; label: string; range: DateRange }> {
  const today = startOfDay(now)
  const yesterday = startOfDay(new Date(now.getTime() - 86400000))
  const thisWeek = { start: startOfWeek(now), end: endOfWeek(now) }
  const lastWeekEnd = new Date(thisWeek.start.getTime() - 1)
  const lastWeek = { start: startOfWeek(lastWeekEnd), end: endOfWeek(lastWeekEnd) }
  const thisMonth = { start: startOfMonth(now), end: endOfMonth(now) }
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 15)
  const lastMonth = { start: startOfMonth(lastMonthDate), end: endOfMonth(lastMonthDate) }
  const thisQuarter = { start: startOfQuarter(now), end: endOfQuarter(now) }
  const lastQuarterDate = new Date(now.getFullYear(), now.getMonth() - 3, 15)
  const lastQuarter = { start: startOfQuarter(lastQuarterDate), end: endOfQuarter(lastQuarterDate) }
  const thisSemester = { start: startOfSemester(now), end: endOfSemester(now) }
  const lastSemesterDate = new Date(now.getFullYear(), now.getMonth() - 6, 15)
  const lastSemester = { start: startOfSemester(lastSemesterDate), end: endOfSemester(lastSemesterDate) }
  const thisYear = { start: startOfYear(now), end: endOfYear(now) }
  const lastYearDate = new Date(now.getFullYear() - 1, 6, 1)
  const lastYear = { start: startOfYear(lastYearDate), end: endOfYear(lastYearDate) }

  const last7 = {
    start: startOfDay(new Date(now.getTime() - 6 * 86400000)),
    end: endOfDay(now),
  }
  const last30 = {
    start: startOfDay(new Date(now.getTime() - 29 * 86400000)),
    end: endOfDay(now),
  }
  const last90 = {
    start: startOfDay(new Date(now.getTime() - 89 * 86400000)),
    end: endOfDay(now),
  }

  return [
    { id: 'today', label: 'Hoje', range: { start: today, end: endOfDay(now) } },
    { id: 'yesterday', label: 'Ontem', range: { start: yesterday, end: endOfDay(yesterday) } },
    { id: 'week', label: 'Esta semana', range: thisWeek },
    { id: 'last-week', label: 'Semana passada', range: lastWeek },
    { id: 'last-7', label: 'Últimos 7 dias', range: last7 },
    { id: 'month', label: 'Este mês', range: thisMonth },
    { id: 'last-month', label: 'Mês passado', range: lastMonth },
    { id: 'last-30', label: 'Últimos 30 dias', range: last30 },
    { id: 'quarter', label: 'Este trimestre', range: thisQuarter },
    { id: 'last-quarter', label: 'Trimestre passado', range: lastQuarter },
    { id: 'last-90', label: 'Últimos 90 dias', range: last90 },
    { id: 'semester', label: 'Este semestre', range: thisSemester },
    { id: 'last-semester', label: 'Semestre passado', range: lastSemester },
    { id: 'year', label: 'Este ano', range: thisYear },
    { id: 'last-year', label: 'Ano passado', range: lastYear },
    { id: 'all', label: 'Total (histórico)', range: { start: new Date(0), end: endOfDay(now) } },
  ]
}

function inRange(date: Date, range: DateRange): boolean {
  return date >= range.start && date <= range.end
}

function resolveSalePrice(unit: InventoryUnit, product?: CatalogProduct): number {
  if (unit.salePrice && unit.salePrice > 0) return unit.salePrice
  return product?.price ?? 0
}

function resolveSoldAt(unit: InventoryUnit): Date {
  if (unit.soldAt) return new Date(unit.soldAt)
  return new Date(unit.updatedAt)
}

export function extractSales(db: OrgDatabase): SaleRecord[] {
  const productMap = new Map(db.products.map((p) => [p.id, p]))
  const storeMap = new Map(db.stores.map((s) => [s.id, s]))

  return db.inventory
    .filter((u) => u.status === 'sold')
    .map((unit) => {
      const product = productMap.get(unit.productId)
      const store = storeMap.get(unit.storeId)
      const salePrice = resolveSalePrice(unit, product)
      const purchasePrice = unit.purchasePrice ?? 0
      return {
        unitId: unit.id,
        productId: unit.productId,
        productName: product?.name ?? 'Produto removido',
        storeId: unit.storeId,
        storeName: store?.name ?? '—',
        soldAt: resolveSoldAt(unit),
        salePrice,
        purchasePrice,
        margin: salePrice - purchasePrice,
        condition: unit.condition,
      }
    })
    .sort((a, b) => b.soldAt.getTime() - a.soldAt.getTime())
}

function computeMetrics(id: string, label: string, sales: SaleRecord[]): PeriodMetrics {
  const revenue = sales.reduce((s, x) => s + x.salePrice, 0)
  const cost = sales.reduce((s, x) => s + x.purchasePrice, 0)
  const margin = revenue - cost
  const units = sales.length
  return {
    id,
    label,
    units,
    revenue,
    cost,
    margin,
    avgTicket: units > 0 ? revenue / units : 0,
    marginPercent: revenue > 0 ? (margin / revenue) * 100 : 0,
  }
}

function topByKey(
  sales: SaleRecord[],
  key: 'productName' | 'storeName',
): Array<{ name: string; units: number; revenue: number }> {
  const map = new Map<string, { units: number; revenue: number }>()
  for (const sale of sales) {
    const name = sale[key]
    const prev = map.get(name) ?? { units: 0, revenue: 0 }
    map.set(name, { units: prev.units + 1, revenue: prev.revenue + sale.salePrice })
  }
  return [...map.entries()]
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
}

function monthlyRevenueSeries(sales: SaleRecord[], months = 12): Array<{ month: string; revenue: number; units: number }> {
  const now = new Date()
  const buckets: Array<{ month: string; revenue: number; units: number }> = []

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const start = startOfMonth(d)
    const end = endOfMonth(d)
    const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    const monthSales = sales.filter((s) => inRange(s.soldAt, { start, end }))
    buckets.push({
      month: label,
      revenue: monthSales.reduce((sum, s) => sum + s.salePrice, 0),
      units: monthSales.length,
    })
  }

  return buckets
}

export function computeDashboardAnalytics(db: OrgDatabase, now = new Date()): DashboardAnalytics {
  const sales = extractSales(db)
  const periods = buildPeriodDefinitions(now).map((p) => ({
    ...computeMetrics(
      p.id,
      p.label,
      sales.filter((s) => inRange(s.soldAt, p.range)),
    ),
  }))

  const allTime = periods.find((p) => p.id === 'all')!
  const available = db.inventory.filter((u) => u.status === 'available')
  const stockValue = available.reduce((sum, u) => {
    const product = db.products.find((p) => p.id === u.productId)
    return sum + (product?.price ?? 0)
  }, 0)
  const stockCost = available.reduce((sum, u) => sum + (u.purchasePrice ?? 0), 0)

  return {
    sales,
    periods,
    totals: {
      allTime,
      inventory: {
        available: available.length,
        reserved: db.inventory.filter((u) => u.status === 'reserved').length,
        sold: db.inventory.filter((u) => u.status === 'sold').length,
        maintenance: db.inventory.filter((u) => u.status === 'maintenance').length,
        stockValue,
        stockCost,
      },
      catalog: {
        products: db.products.length,
        published: db.products.filter((p) => p.published).length,
        onSale: db.products.filter((p) => p.sale).length,
      },
      crm: {
        customers: db.customers.length,
        interactions: db.interactions.length,
        saleInteractions: db.interactions.filter((i) => i.type === 'sale').length,
      },
      stores: {
        active: db.stores.filter((s) => s.active).length,
        total: db.stores.length,
      },
      topProducts: topByKey(sales, 'productName'),
      topStores: topByKey(sales, 'storeName'),
      monthlyRevenue: monthlyRevenueSeries(sales),
      recentSales: sales.slice(0, 10),
    },
  }
}

export function formatPeriodComparison(current: PeriodMetrics, previous: PeriodMetrics | null): string {
  if (!previous || previous.revenue === 0) {
    if (current.revenue === 0) return '—'
    return '+100%'
  }
  const pct = ((current.revenue - previous.revenue) / previous.revenue) * 100
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

export function getPreviousPeriodRange(id: string, now = new Date()): DateRange | null {
  const defs = buildPeriodDefinitions(now)
  const current = defs.find((d) => d.id === id)
  if (!current || id === 'all' || id.startsWith('last-')) return null
  const duration = rangeDuration(current.range)
  return shiftRange(current.range, duration + 1)
}

export function getPreviousPeriodMetrics(
  id: string,
  sales: SaleRecord[],
  now = new Date(),
): PeriodMetrics | null {
  const prevRange = getPreviousPeriodRange(id, now)
  if (!prevRange) return null
  const prevSales = sales.filter((s) => inRange(s.soldAt, prevRange))
  const def = buildPeriodDefinitions(now).find((d) => d.id === id)
  return computeMetrics(id, def?.label ?? id, prevSales)
}
