import { describe, expect, it } from 'vitest'
import {
  aggregateSalesByMonth,
  calcGrossProfit,
  calcMargin,
  calcNetProfit,
  calcROI,
  calcSaleMetrics,
  vehicleInvestment,
} from '../utils/finance'
import type { Expense, Sale, Vehicle } from '../types'

const baseVehicle: Vehicle = {
  id: 'v1',
  marca: 'Toyota',
  modelo: 'Corolla',
  versao: 'XEi',
  ano: 2022,
  anoModelo: 2023,
  categoria: 'Sedan',
  cor: 'Prata',
  placa: 'ABC1D23',
  renavam: '',
  chassi: '',
  motor: '2.0',
  combustivel: 'flex',
  cambio: 'automatico',
  quilometragem: 10000,
  cidade: 'SP',
  estado: 'SP',
  fornecedor: '',
  telefoneFornecedor: '',
  origem: 'Particular',
  precoFipe: 120000,
  valorCompra: 100000,
  precoAnunciado: 115000,
  precoMinimo: 110000,
  observacoes: '',
  dataCompra: '2026-01-01',
  fotos: [],
  fotoPrincipal: 0,
  status: 'disponivel',
  consignado: false,
  archived: false,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('finance calculations', () => {
  it('calculates gross and net profit correctly', () => {
    expect(calcGrossProfit(112000, 98000)).toBe(14000)
    expect(calcNetProfit(112000, 98000, 1200, 1500)).toBe(11300)
  })

  it('calculates ROI and margin', () => {
    expect(calcROI(11300, 99200)).toBeCloseTo(11.39, 1)
    expect(calcMargin(11300, 112000)).toBeCloseTo(10.09, 1)
  })

  it('calcSaleMetrics uses expenses excluding compra category', () => {
    const expenses: Expense[] = [
      {
        id: 'e1',
        vehicleId: 'v1',
        descricao: 'IPVA',
        categoria: 'ipva',
        valor: 3000,
        data: '2026-01-10',
        observacao: '',
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 'e2',
        vehicleId: 'v1',
        descricao: 'Compra registrada',
        categoria: 'compra',
        valor: 100000,
        data: '2026-01-01',
        observacao: '',
        createdAt: '',
        updatedAt: '',
      },
    ]
    const m = calcSaleMetrics(baseVehicle, expenses, 120000, 1000, '2026-03-01')
    expect(m.expensesTotal).toBe(3000)
    expect(m.lucroBruto).toBe(20000)
    expect(m.lucroLiquido).toBe(16000) // 120000 - 100000 - 3000 - 1000
    expect(m.investment).toBe(103000)
    expect(m.diasEstoque).toBe(59)
  })

  it('consignado investment counts only expenses', () => {
    const v = { ...baseVehicle, consignado: true, valorCompra: 0, status: 'consignado' as const }
    const expenses: Expense[] = [
      {
        id: 'e1',
        vehicleId: 'v1',
        descricao: 'Ads',
        categoria: 'publicidade',
        valor: 500,
        data: '2026-01-10',
        observacao: '',
        createdAt: '',
        updatedAt: '',
      },
    ]
    expect(vehicleInvestment(v, expenses)).toBe(500)
  })

  it('fills 12 months in sales chart aggregation', () => {
    const sales: Sale[] = [
      {
        id: 's1',
        vehicleId: 'v1',
        customerId: 'c1',
        clienteNome: 'A',
        cpf: '',
        telefone: '',
        cidade: '',
        endereco: '',
        dataVenda: new Date().toISOString().slice(0, 10),
        formaPagamento: 'pix',
        entrada: 10000,
        parcelas: 0,
        valorVendido: 10000,
        comissao: 0,
        observacoes: '',
        lucroBruto: 2000,
        lucroLiquido: 1500,
        roi: 10,
        margem: 15,
        diasEstoque: 10,
        createdAt: '',
        updatedAt: '',
      },
    ]
    const chart = aggregateSalesByMonth(sales, 12)
    expect(chart).toHaveLength(12)
    expect(chart.reduce((a, m) => a + m.vendas, 0)).toBe(10000)
    expect(chart.reduce((a, m) => a + m.quantidade, 0)).toBe(1)
  })
})
