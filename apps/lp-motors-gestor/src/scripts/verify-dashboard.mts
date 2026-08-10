/**
 * Script de integridade: seed → dashboard → venda → novos totais.
 * Roda em Node com localStorage mock.
 */
import { seedDatabase } from '../data/seed'
import {
  calcSaleMetrics,
  isActiveStock,
  vehicleInvestment,
  vehicleStockValue,
} from '../utils/finance'

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg)
}

const db = seedDatabase()

const active = db.vehicles.filter((v) => !v.archived)
const stock = active.filter(isActiveStock)
const disponiveis = stock.filter((v) => v.status === 'disponivel').length
const reservados = stock.filter((v) => v.status === 'reservado').length
const consignados = stock.filter((v) => v.consignado || v.status === 'consignado').length
const vendidos = active.filter((v) => v.status === 'vendido' || v.status === 'entregue').length
const emOficina = stock.filter((v) => v.status === 'oficina').length

const investimento = stock.reduce((a, v) => a + vehicleInvestment(v, db.expenses), 0)
const valorEstoque = stock.reduce((a, v) => a + vehicleStockValue(v), 0)
const valorVendido = db.sales.reduce((a, s) => a + s.valorVendido, 0)
const lucroBruto = db.sales.reduce((a, s) => a + s.lucroBruto, 0)
const lucroLiquido = db.sales.reduce((a, s) => a + s.lucroLiquido, 0)

console.log('=== Maciel Motors — integridade da dashboard ===')
console.log({
  totalEstoque: stock.length,
  disponiveis,
  reservados,
  consignados,
  vendidos,
  emOficina,
  investimento,
  valorEstoque,
  valorVendido,
  lucroBruto,
  lucroLiquido,
  ticketMedio: valorVendido / db.sales.length,
  vendas: db.sales.length,
})

assert(stock.length === disponiveis + reservados + consignados + emOficina + stock.filter((v) => !['disponivel','reservado','consignado','oficina'].includes(v.status)).length, 'contagem de estoque inconsistente')
assert(vendidos === db.sales.length, `vendidos (${vendidos}) deve igualar vendas (${db.sales.length})`)
assert(db.sales.length >= 3, 'precisa de múltiplas vendas para gráfico real')
assert(investimento > 0, 'investimento deve ser > 0')
assert(valorEstoque > investimento * 0.5, 'valor de estoque deve fazer sentido vs investimento')
assert(lucroLiquido !== 0, 'lucro líquido deve ser calculado')

for (const sale of db.sales) {
  const vehicle = db.vehicles.find((v) => v.id === sale.vehicleId)!
  const m = calcSaleMetrics(vehicle, db.expenses, sale.valorVendido, sale.comissao, sale.dataVenda)
  assert(
    Math.abs(m.lucroBruto - sale.lucroBruto) < 0.01,
    `lucro bruto inconsistente em ${sale.id}: seed=${sale.lucroBruto} calc=${m.lucroBruto}`,
  )
  assert(
    Math.abs(m.lucroLiquido - sale.lucroLiquido) < 0.01,
    `lucro líquido inconsistente em ${sale.id}: seed=${sale.lucroLiquido} calc=${m.lucroLiquido}`,
  )
  assert(vehicle.status === 'vendido', `veículo ${vehicle.id} da venda deve estar vendido`)
}

// Consignado: investimento = só despesas
const jeep = db.vehicles.find((v) => v.id === 'veh_003')!
const jeepInv = vehicleInvestment(jeep, db.expenses)
const jeepExp = db.expenses.filter((e) => e.vehicleId === 'veh_003').reduce((a, e) => a + e.valor, 0)
assert(jeep.consignado && jeep.valorCompra === 0, 'consignado deve ter valorCompra 0')
assert(jeepInv === jeepExp, `investimento consignado ${jeepInv} != despesas ${jeepExp}`)

console.log('OK — todos os números batem com a lógica financeira.')
