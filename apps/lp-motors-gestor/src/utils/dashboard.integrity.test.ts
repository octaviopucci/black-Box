import { describe, expect, it } from 'vitest'
import { seedDatabase } from '@/data/seed'
import {
  calcSaleMetrics,
  isActiveStock,
  vehicleInvestment,
  vehicleStockValue,
} from '@/utils/finance'

describe('dashboard integrity from seed', () => {
  const db = seedDatabase()
  const active = db.vehicles.filter((v) => !v.archived)
  const stock = active.filter(isActiveStock)

  it('has coherent stock counts', () => {
    const disponiveis = stock.filter((v) => v.status === 'disponivel').length
    const reservados = stock.filter((v) => v.status === 'reservado').length
    const consignados = stock.filter((v) => v.consignado || v.status === 'consignado').length
    const emOficina = stock.filter((v) => v.status === 'oficina').length
    const outros = stock.filter(
      (v) => !['disponivel', 'reservado', 'consignado', 'oficina'].includes(v.status),
    ).length

    expect(stock.length).toBe(disponiveis + reservados + consignados + emOficina + outros)
    expect(disponiveis).toBeGreaterThan(0)
    expect(stock.length).toBeGreaterThanOrEqual(5)
  })

  it('sold vehicles match sales and metrics are recalculated correctly', () => {
    const vendidos = active.filter((v) => v.status === 'vendido' || v.status === 'entregue')
    expect(vendidos.length).toBe(db.sales.length)
    expect(db.sales.length).toBeGreaterThanOrEqual(4)

    for (const sale of db.sales) {
      const vehicle = db.vehicles.find((v) => v.id === sale.vehicleId)!
      const m = calcSaleMetrics(
        vehicle,
        db.expenses,
        sale.valorVendido,
        sale.comissao,
        sale.dataVenda,
      )
      expect(m.lucroBruto).toBeCloseTo(sale.lucroBruto, 2)
      expect(m.lucroLiquido).toBeCloseTo(sale.lucroLiquido, 2)
      expect(vehicle.status).toBe('vendido')
    }
  })

  it('computes real investment and stock value', () => {
    const investimento = stock.reduce((a, v) => a + vehicleInvestment(v, db.expenses), 0)
    const valorEstoque = stock.reduce((a, v) => a + vehicleStockValue(v), 0)
    const valorVendido = db.sales.reduce((a, s) => a + s.valorVendido, 0)
    const lucroLiquido = db.sales.reduce((a, s) => a + s.lucroLiquido, 0)

    expect(investimento).toBeGreaterThan(100000)
    expect(valorEstoque).toBeGreaterThan(investimento * 0.5)
    expect(valorVendido).toBeGreaterThan(300000)
    expect(lucroLiquido).not.toBe(0)

    const jeep = db.vehicles.find((v) => v.id === 'veh_003')!
    const jeepExp = db.expenses
      .filter((e) => e.vehicleId === 'veh_003')
      .reduce((a, e) => a + e.valor, 0)
    expect(jeep.consignado).toBe(true)
    expect(jeep.valorCompra).toBe(0)
    expect(vehicleInvestment(jeep, db.expenses)).toBe(jeepExp)
  })
})
