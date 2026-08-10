import type {
  DashboardStats,
  Database,
  Settings,
  StatusChartData,
} from '@/types'
import {
  clearDatabase,
  exportDatabase,
  importDatabase,
  loadDatabase,
  resetDatabase,
  saveDatabase,
} from '@/services/database'
import { daysBetween, downloadJSON, nowISO } from '@/utils'
import {
  aggregateSalesByMonth,
  calcPotentialProfit,
  isActiveStock,
  isSoldStatus,
  stockAgeDays,
  vehicleInvestment,
  vehicleStockValue,
} from '@/utils/finance'
import { STATUS_CHART_COLORS, STATUS_LABELS } from '@/utils/constants'
import { expenseService } from '@/services/expenses'
import { historyService } from '@/services/auth'
import { intelligenceService } from '@/services/intelligence'
import { APP_NAME } from '@/config/variant'

export const settingsService = {
  get(): Settings {
    const db = loadDatabase()
    return db.settings[0]
  },

  update(patch: Partial<Settings>): Settings {
    const db = loadDatabase()
    db.settings[0] = {
      ...db.settings[0],
      ...patch,
      id: db.settings[0].id,
      updatedAt: nowISO(),
    }
    saveDatabase(db)
    return db.settings[0]
  },
}

export const backupService = {
  exportJSON(): void {
    const db = exportDatabase()
    const stamp = new Date().toISOString().slice(0, 10)
    downloadJSON(`lp-motors-backup-${stamp}.json`, db)
  },

  async importJSON(file: File): Promise<Database> {
    const text = await file.text()
    const data = JSON.parse(text)
    return importDatabase(data)
  },

  restoreSeed(): Database {
    return resetDatabase()
  },

  resetAll(): Database {
    return clearDatabase()
  },

  getRaw(): Database {
    return exportDatabase()
  },
}

export const dashboardService = {
  getStats(): DashboardStats {
    const db = loadDatabase()
    const active = db.vehicles.filter((v) => !v.archived)
    const stock = active.filter(isActiveStock)

    const disponiveis = stock.filter((v) => v.status === 'disponivel').length
    const reservados = stock.filter((v) => v.status === 'reservado').length
    const consignados = stock.filter(
      (v) => v.consignado || v.status === 'consignado',
    ).length
    const vendidos = active.filter((v) => isSoldStatus(v.status)).length
    const emOficina = stock.filter((v) => v.status === 'oficina').length

    // Capital próprio empatado no estoque atual
    const investimentoTotal = stock.reduce(
      (acc, v) => acc + vehicleInvestment(v, db.expenses),
      0,
    )

    // Valor de venda potencial do estoque
    const valorTotalEstoque = stock.reduce((acc, v) => acc + vehicleStockValue(v), 0)

    // Performance de vendas realizadas
    const valorVendido = db.sales.reduce((acc, s) => acc + s.valorVendido, 0)
    const lucroBruto = db.sales.reduce((acc, s) => acc + s.lucroBruto, 0)
    const lucroLiquido = db.sales.reduce((acc, s) => acc + s.lucroLiquido, 0)
    const ticketMedio = db.sales.length ? valorVendido / db.sales.length : 0

    // Dias médios dos veículos ainda no pátio
    const diasMediosEstoque = stock.length
      ? stock.reduce((acc, v) => acc + stockAgeDays(v), 0) / stock.length
      : 0

    const lucroPotencial = stock.reduce(
      (acc, v) => acc + calcPotentialProfit(v, db.expenses),
      0,
    )

    const margemMedia =
      db.sales.length > 0
        ? db.sales.reduce((acc, s) => acc + s.margem, 0) / db.sales.length
        : stock.length
          ? stock.reduce((acc, v) => {
              const price = v.precoAnunciado || 0
              const pot = calcPotentialProfit(v, db.expenses)
              return acc + (price ? (pot / price) * 100 : 0)
            }, 0) / stock.length
          : 0

    const capitalParado = stock
      .filter((v) => stockAgeDays(v) >= (db.settings[0]?.org?.alertDaysAlert || 45))
      .reduce((acc, v) => acc + vehicleInvestment(v, db.expenses), 0)

    const alerts = intelligenceService.getAlerts(db)
    const alertasCriticos = alerts.filter((a) => a.severity === 'critico').length
    const docsPendentes = db.documents.filter(
      (d) => d.status === 'pendente' || d.status === 'vencido',
    ).length

    return {
      totalEstoque: stock.length,
      disponiveis,
      reservados,
      consignados,
      vendidos,
      emOficina,
      investimentoTotal,
      valorTotalEstoque,
      valorVendido,
      lucroBruto,
      lucroLiquido,
      lucroPotencial,
      ticketMedio,
      diasMediosEstoque,
      margemMedia,
      capitalParado,
      alertasCriticos,
      docsPendentes,
    }
  },

  salesChart() {
    return aggregateSalesByMonth(loadDatabase().sales, 12)
  },

  statusChart(): StatusChartData[] {
    const db = loadDatabase()
    const counts = new Map<string, number>()
    for (const v of db.vehicles.filter((x) => !x.archived)) {
      counts.set(v.status, (counts.get(v.status) || 0) + 1)
    }
    return Array.from(counts.entries())
      .map(([status, quantidade]) => ({
        status: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
        quantidade,
        fill: STATUS_CHART_COLORS[status as keyof typeof STATUS_CHART_COLORS] || '#3A3A3A',
      }))
      .sort((a, b) => b.quantidade - a.quantidade)
  },

  recentHistory(limit = 8) {
    return historyService.listRecent(limit)
  },

  recentVehicles(limit = 5) {
    return loadDatabase()
      .vehicles.filter((v) => !v.archived)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
  },
}

export const reportService = {
  soldVehicles() {
    return loadDatabase().vehicles.filter((v) => isSoldStatus(v.status))
  },
  availableVehicles() {
    return loadDatabase().vehicles.filter((v) => !v.archived && v.status === 'disponivel')
  },
  consignados() {
    return loadDatabase().vehicles.filter(
      (v) => !v.archived && (v.consignado || v.status === 'consignado'),
    )
  },
  stalled(days: number) {
    return loadDatabase().vehicles.filter(
      (v) => !v.archived && isActiveStock(v) && daysBetween(v.dataCompra) >= days,
    )
  },
  monthlyProfit() {
    return aggregateSalesByMonth(loadDatabase().sales, 12)
  },
  annualProfit() {
    const map = new Map<number, number>()
    for (const s of loadDatabase().sales) {
      const y = new Date(s.dataVenda).getFullYear()
      map.set(y, (map.get(y) || 0) + s.lucroLiquido)
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([ano, lucro]) => ({ ano, lucro }))
  },
  totalInvestment() {
    const db = loadDatabase()
    return db.vehicles
      .filter((v) => !v.archived && isActiveStock(v))
      .reduce((acc, v) => acc + vehicleInvestment(v, db.expenses), 0)
  },
  expensesByCategory() {
    return expenseService.byCategory()
  },
  topBrands() {
    const db = loadDatabase()
    const soldIds = new Set(db.sales.map((s) => s.vehicleId))
    const map = new Map<string, number>()
    for (const v of db.vehicles) {
      if (soldIds.has(v.id)) map.set(v.marca, (map.get(v.marca) || 0) + 1)
    }
    return Array.from(map.entries())
      .map(([marca, qtd]) => ({ marca, qtd }))
      .sort((a, b) => b.qtd - a.qtd)
  },
  exportJSON(name: string, data: unknown) {
    downloadJSON(name, data)
  },
  exportPDF(title: string, rows: string[][]) {
    const table = rows
      .map(
        (r, i) =>
          `<tr>${r.map((c) => (i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`,
      )
      .join('')
    const win = window.open('', '_blank', 'width=1000,height=700')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:24px}
        h1{font-size:18px}
        table{width:100%;border-collapse:collapse;margin-top:16px}
        th,td{border:1px solid #ccc;padding:8px;font-size:12px;text-align:left}
        th{background:#111;color:#fff}
      </style></head><body>
      <h1>${title}</h1>
      <p>${APP_NAME} — ${new Date().toLocaleString('pt-BR')}</p>
      <table>${table}</table>
      <script>window.print()</script>
      </body></html>`)
    win.document.close()
  },
}
