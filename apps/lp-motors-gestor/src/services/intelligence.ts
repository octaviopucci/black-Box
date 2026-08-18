import type {
  BuyOpportunity,
  Database,
  RuleAlert,
  PurchaseSimulation,
  PurchaseSimulationResult,
  VehicleDocument,
} from '@/types'
import { loadDatabase } from '@/services/database'
import {
  calcPotentialProfit,
  calcRealCost,
  isActiveStock,
  stockAgeDays,
  defaultOrgSettings,
} from '@/utils/finance'
import { generateId, nowISO, daysBetween } from '@/utils'

function settingsOf(db: Database) {
  return db.settings[0]?.org || defaultOrgSettings()
}

function docStatus(doc: VehicleDocument, warnDays: number): VehicleDocument['status'] {
  if (!doc.dataVencimento) return doc.status || 'regular'
  const days = daysBetween(nowISO(), doc.dataVencimento.includes('T') ? doc.dataVencimento : `${doc.dataVencimento}T12:00:00`)
  const end = new Date(doc.dataVencimento.includes('T') ? doc.dataVencimento : `${doc.dataVencimento}T12:00:00`)
  const today = new Date()
  if (end < today) return 'vencido'
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= warnDays) return 'proximo'
  return 'regular'
}

export const intelligenceService = {
  getAlerts(db?: Database): RuleAlert[] {
    const data = db || loadDatabase()
    const org = settingsOf(data)
    const alerts: RuleAlert[] = []
    const stock = data.vehicles.filter(isActiveStock)
    const recentSales = data.sales.filter((s) => daysBetween(s.dataVenda) <= 90)

    for (const v of stock) {
      const days = stockAgeDays(v)
      if (days >= org.alertDaysCritical) {
        alerts.push({
          id: `age_crit_${v.id}`,
          severity: 'critico',
          category: 'estoque',
          title: 'Capital parado crítico',
          message: `${v.marca} ${v.modelo} está há ${days} dias em estoque.`,
          recommendation: 'Reavalie preço, anúncio e possibilidade de troca/consignação.',
          vehicleId: v.id,
          createdAt: nowISO(),
        })
      } else if (days >= org.alertDaysAlert) {
        alerts.push({
          id: `age_alert_${v.id}`,
          severity: 'atencao',
          category: 'estoque',
          title: 'Veículo parado acima do alerta',
          message: `${v.marca} ${v.modelo} · ${days} dias em estoque.`,
          recommendation: 'Considere redução de preço ou campanha focada.',
          vehicleId: v.id,
          createdAt: nowISO(),
        })
      } else if (days >= org.alertDaysWarn) {
        alerts.push({
          id: `age_warn_${v.id}`,
          severity: 'info',
          category: 'estoque',
          title: 'Atenção ao tempo de estoque',
          message: `${v.marca} ${v.modelo} · ${days} dias.`,
          vehicleId: v.id,
          createdAt: nowISO(),
        })
      }

      if (!v.fotos?.length) {
        alerts.push({
          id: `photo_${v.id}`,
          severity: 'atencao',
          category: 'operacional',
          title: 'Veículo sem fotos',
          message: `${v.marca} ${v.modelo} não possui fotos cadastradas.`,
          recommendation: 'Capture fotos pelo celular para acelerar a venda.',
          vehicleId: v.id,
          createdAt: nowISO(),
        })
      }

      if (!v.precoAnunciado) {
        alerts.push({
          id: `price_${v.id}`,
          severity: 'atencao',
          category: 'operacional',
          title: 'Veículo sem preço anunciado',
          message: `${v.marca} ${v.modelo} está sem preço de anúncio.`,
          vehicleId: v.id,
          createdAt: nowISO(),
        })
      }

      const margin = (() => {
        const real = calcRealCost(v, data.expenses)
        const price = v.precoAnunciado || 0
        return price ? ((price - real) / price) * 100 : 0
      })()
      if (v.precoAnunciado && margin < org.minMarginPercent) {
        alerts.push({
          id: `margin_${v.id}`,
          severity: 'atencao',
          category: 'financeiro',
          title: 'Margem abaixo da meta',
          message: `${v.marca} ${v.modelo} com margem estimada de ${margin.toFixed(1)}% (meta ${org.minMarginPercent}%).`,
          recommendation: 'Revise custos de preparação ou preço de venda.',
          vehicleId: v.id,
          createdAt: nowISO(),
        })
      }

      const chk = data.checklists.find((c) => c.vehicleId === v.id)
      if (chk) {
        const pending = chk.items.filter((i) => !i.done).length
        if (pending > 0 && ['preparacao', 'pronto', 'anunciado'].includes(v.status)) {
          alerts.push({
            id: `chk_${v.id}`,
            severity: 'info',
            category: 'operacional',
            title: 'Preparação incompleta',
            message: `${v.marca} ${v.modelo} · ${pending} itens pendentes no checklist.`,
            vehicleId: v.id,
            createdAt: nowISO(),
          })
        }
      }
    }

    for (const doc of data.documents) {
      const status = docStatus(doc, org.docExpiryWarnDays)
      if (status === 'vencido') {
        const v = data.vehicles.find((x) => x.id === doc.vehicleId)
        alerts.push({
          id: `doc_v_${doc.id}`,
          severity: 'critico',
          category: 'documentacao',
          title: 'Documento vencido',
          message: `${doc.nome || doc.categoria}${v ? ` · ${v.marca} ${v.modelo}` : ''}`,
          recommendation: 'Regularize imediatamente para evitar risco operacional.',
          vehicleId: doc.vehicleId,
          entityId: doc.id,
          createdAt: nowISO(),
        })
      } else if (status === 'proximo') {
        const v = data.vehicles.find((x) => x.id === doc.vehicleId)
        alerts.push({
          id: `doc_p_${doc.id}`,
          severity: 'atencao',
          category: 'documentacao',
          title: 'Documento próximo do vencimento',
          message: `${doc.nome || doc.categoria}${v ? ` · ${v.marca} ${v.modelo}` : ''}`,
          vehicleId: doc.vehicleId,
          entityId: doc.id,
          createdAt: nowISO(),
        })
      }
    }

    for (const p of data.payables) {
      if (p.status === 'cancelado' || p.status === 'pago') continue
      const end = new Date(p.vencimento.includes('T') ? p.vencimento : `${p.vencimento}T12:00:00`)
      if (end < new Date()) {
        alerts.push({
          id: `pay_${p.id}`,
          severity: 'critico',
          category: 'financeiro',
          title: 'Conta vencida',
          message: `${p.descricao} · R$ ${p.valor.toFixed(2)}`,
          entityId: p.id,
          vehicleId: p.vehicleId,
          createdAt: nowISO(),
        })
      } else if (daysBetween(nowISO(), p.vencimento) <= 7) {
        alerts.push({
          id: `pay_soon_${p.id}`,
          severity: 'atencao',
          category: 'financeiro',
          title: 'Conta próxima do vencimento',
          message: `${p.descricao} · vence em ${p.vencimento}`,
          entityId: p.id,
          createdAt: nowISO(),
        })
      }
    }

    // Brand concentration vs sales
    if (stock.length >= 3 && recentSales.length >= 2) {
      const stockByBrand = new Map<string, number>()
      const salesByBrand = new Map<string, number>()
      for (const v of stock) stockByBrand.set(v.marca, (stockByBrand.get(v.marca) || 0) + 1)
      for (const s of recentSales) {
        const v = data.vehicles.find((x) => x.id === s.vehicleId)
        if (!v) continue
        salesByBrand.set(v.marca, (salesByBrand.get(v.marca) || 0) + 1)
      }
      for (const [brand, count] of stockByBrand) {
        const stockShare = (count / stock.length) * 100
        const salesShare = ((salesByBrand.get(brand) || 0) / recentSales.length) * 100
        if (stockShare >= org.brandConcentrationLimit && stockShare - salesShare >= 10) {
          alerts.push({
            id: `conc_${brand}`,
            severity: 'atencao',
            category: 'estoque',
            title: `Concentração elevada em ${brand}`,
            message: `Atualmente ${stockShare.toFixed(0)}% do estoque é ${brand}, enquanto a marca representa ${salesShare.toFixed(0)}% das vendas recentes.`,
            recommendation: 'Considere reduzir novas compras até normalizar o estoque.',
            createdAt: nowISO(),
          })
        }
      }

      // Opportunity: high sales share, low stock
      for (const [brand, salesCount] of salesByBrand) {
        const salesShare = (salesCount / recentSales.length) * 100
        const stockShare = ((stockByBrand.get(brand) || 0) / stock.length) * 100
        if (salesShare - stockShare >= org.lowStockDemandGap && salesShare >= 15) {
          alerts.push({
            id: `opp_${brand}`,
            severity: 'oportunidade',
            category: 'estoque',
            title: `Oportunidade: ${brand}`,
            message: `${brand} representa ${salesShare.toFixed(0)}% das vendas recentes, mas apenas ${stockShare.toFixed(0)}% do estoque atual.`,
            recommendation: 'Considere priorizar novas compras dessa marca/categoria.',
            createdAt: nowISO(),
          })
        }
      }
    }

    const severityRank = { critico: 0, atencao: 1, oportunidade: 2, info: 3 }
    return alerts.sort((a, b) => severityRank[a.severity] - severityRank[b.severity])
  },

  getOpportunities(db?: Database): BuyOpportunity[] {
    const data = db || loadDatabase()
    const stock = data.vehicles.filter(isActiveStock)
    const recentSales = data.sales.filter((s) => daysBetween(s.dataVenda) <= 120)
    if (!recentSales.length) return []

    const byCat = new Map<string, { sales: number; stock: number; margin: number[]; days: number[] }>()
    for (const s of recentSales) {
      const v = data.vehicles.find((x) => x.id === s.vehicleId)
      if (!v) continue
      const key = v.categoria || 'Geral'
      const cur = byCat.get(key) || { sales: 0, stock: 0, margin: [], days: [] }
      cur.sales += 1
      cur.margin.push(s.margem)
      cur.days.push(s.diasEstoque)
      byCat.set(key, cur)
    }
    for (const v of stock) {
      const key = v.categoria || 'Geral'
      const cur = byCat.get(key) || { sales: 0, stock: 0, margin: [], days: [] }
      cur.stock += 1
      byCat.set(key, cur)
    }

    const totalSales = recentSales.length
    const totalStock = Math.max(stock.length, 1)
    const list: BuyOpportunity[] = []

    for (const [label, stats] of byCat) {
      const salesShare = (stats.sales / totalSales) * 100
      const stockShare = (stats.stock / totalStock) * 100
      const avgMargin = stats.margin.length
        ? stats.margin.reduce((a, b) => a + b, 0) / stats.margin.length
        : 0
      const avgDays = stats.days.length
        ? stats.days.reduce((a, b) => a + b, 0) / stats.days.length
        : 0
      const gap = salesShare - stockShare
      const score = Math.round(
        Math.max(0, gap) * 2 + avgMargin * 1.5 + Math.max(0, 40 - avgDays) * 0.5,
      )
      if (score < 10) continue
      list.push({
        id: generateId('opp'),
        label,
        tipo: 'categoria',
        score,
        salesShare: Math.round(salesShare * 10) / 10,
        stockShare: Math.round(stockShare * 10) / 10,
        avgMargin: Math.round(avgMargin * 10) / 10,
        avgDays: Math.round(avgDays),
        recommendation:
          gap > 0
            ? `Priorize compras de ${label}: demanda ${salesShare.toFixed(0)}% vs estoque ${stockShare.toFixed(0)}%.`
            : `Monitore ${label}: estoque alinhado ou acima da demanda recente.`,
      })
    }

    return list.sort((a, b) => b.score - a.score).slice(0, 12)
  },

  simulatePurchase(input: PurchaseSimulation, db?: Database): PurchaseSimulationResult {
    const data = db || loadDatabase()
    const custoTotal = input.precoPedido + input.custoEstimado
    const lucro = input.precoVendaEstimado - custoTotal
    const margem = input.precoVendaEstimado
      ? (lucro / input.precoVendaEstimado) * 100
      : 0
    const org = settingsOf(data)
    const notes: string[] = []

    let score = 50
    if (margem >= org.minMarginPercent + 5) {
      score += 25
      notes.push('Margem confortável acima da meta.')
    } else if (margem >= org.minMarginPercent) {
      score += 12
      notes.push('Margem dentro da meta configurada.')
    } else {
      score -= 20
      notes.push('Margem abaixo da meta — risco elevado.')
    }

    if (input.prazoEstimado <= 20) {
      score += 15
      notes.push('Giro estimado rápido.')
    } else if (input.prazoEstimado <= org.alertDaysWarn) {
      score += 5
    } else if (input.prazoEstimado >= org.alertDaysCritical) {
      score -= 20
      notes.push('Prazo estimado acima do limite crítico de estoque.')
    }

    const sameBrand = data.vehicles.filter((v) => isActiveStock(v) && v.marca === input.marca)
    const stock = data.vehicles.filter(isActiveStock)
    if (stock.length && sameBrand.length / stock.length > org.brandConcentrationLimit / 100) {
      score -= 15
      notes.push(`Estoque já concentrado em ${input.marca}.`)
    }

    score = Math.max(0, Math.min(100, score))
    const risco: PurchaseSimulationResult['risco'] =
      score >= 70 ? 'baixo' : score >= 45 ? 'medio' : 'alto'

    return {
      custoTotal,
      lucro,
      margem: Math.round(margem * 100) / 100,
      risco,
      score,
      notes,
    }
  },

  capitalParado(db?: Database) {
    const data = db || loadDatabase()
    const org = settingsOf(data)
    return data.vehicles
      .filter(isActiveStock)
      .map((v) => {
        const days = stockAgeDays(v)
        const custoReal = calcRealCost(v, data.expenses)
        const preco = v.precoAnunciado || v.precoMinimo || 0
        const margemEstimada = preco ? ((preco - custoReal) / preco) * 100 : 0
        const nivel =
          days >= org.alertDaysCritical
            ? 'critico'
            : days >= org.alertDaysAlert
              ? 'alerta'
              : days >= org.alertDaysWarn
                ? 'atencao'
                : 'ok'
        return {
          vehicle: v,
          days,
          custoReal,
          preco,
          margemEstimada,
          potencial: calcPotentialProfit(v, data.expenses),
          nivel,
        }
      })
      .sort((a, b) => b.days - a.days || b.custoReal - a.custoReal)
  },
}
