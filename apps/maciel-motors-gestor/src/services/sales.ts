import type { Customer, Sale } from '@/types'
import { loadDatabase } from '@/services/database'
import { historyService, persist } from '@/services/auth'
import { generateId, nowISO } from '@/utils'
import { calcSaleMetrics } from '@/utils/finance'
import { formatCurrency } from '@/utils'

export type CustomerInput = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>

export type SaleInput = {
  vehicleId: string
  customerId?: string
  clienteNome: string
  cpf: string
  telefone: string
  cidade: string
  endereco: string
  dataVenda: string
  formaPagamento: Sale['formaPagamento']
  entrada: number
  parcelas: number
  valorVendido: number
  comissao: number
  observacoes: string
}

export const customerService = {
  list(search = ''): Customer[] {
    let items = loadDatabase().customers.slice()
    if (search) {
      const q = search.toLowerCase()
      items = items.filter((c) =>
        [c.nome, c.cpf, c.telefone, c.cidade, c.email].join(' ').toLowerCase().includes(q),
      )
    }
    return items.sort((a, b) => a.nome.localeCompare(b.nome))
  },

  getById(id: string): Customer | undefined {
    return loadDatabase().customers.find((c) => c.id === id)
  },

  create(input: CustomerInput): Customer {
    const db = loadDatabase()
    const customer: Customer = {
      ...input,
      id: generateId('cust'),
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.customers.unshift(customer)
    persist(db)
    return customer
  },

  update(id: string, patch: Partial<CustomerInput>): Customer {
    const db = loadDatabase()
    const idx = db.customers.findIndex((c) => c.id === id)
    if (idx < 0) throw new Error('Cliente não encontrado')
    const updated: Customer = {
      ...db.customers[idx],
      ...patch,
      id,
      createdAt: db.customers[idx].createdAt,
      updatedAt: nowISO(),
    }
    db.customers[idx] = updated
    persist(db)
    return updated
  },

  remove(id: string): void {
    const db = loadDatabase()
    db.customers = db.customers.filter((c) => c.id !== id)
    persist(db)
  },

  purchaseHistory(customerId: string): Sale[] {
    return loadDatabase().sales.filter((s) => s.customerId === customerId)
  },
}

export const saleService = {
  list(): Sale[] {
    return loadDatabase().sales.slice().sort((a, b) => b.dataVenda.localeCompare(a.dataVenda))
  },

  getByVehicle(vehicleId: string): Sale | undefined {
    return loadDatabase().sales.find((s) => s.vehicleId === vehicleId)
  },

  create(input: SaleInput): Sale {
    const db = loadDatabase()
    const vehicle = db.vehicles.find((v) => v.id === input.vehicleId)
    if (!vehicle) throw new Error('Veículo não encontrado')
    if (vehicle.archived) throw new Error('Não é possível vender um veículo arquivado')
    if (vehicle.status === 'vendido' || vehicle.status === 'entregue') {
      throw new Error('Este veículo já foi vendido')
    }
    if (db.sales.some((s) => s.vehicleId === input.vehicleId)) {
      throw new Error('Já existe uma venda registrada para este veículo')
    }
    if (input.valorVendido <= 0) throw new Error('Valor vendido deve ser maior que zero')

    let customerId = input.customerId
    if (!customerId) {
      const existing = db.customers.find(
        (c) => c.cpf.replace(/\D/g, '') === input.cpf.replace(/\D/g, '') && input.cpf,
      )
      if (existing) {
        customerId = existing.id
      } else {
        const customer: Customer = {
          id: generateId('cust'),
          nome: input.clienteNome,
          cpf: input.cpf,
          telefone: input.telefone,
          cidade: input.cidade,
          endereco: input.endereco,
          email: '',
          observacoes: '',
          createdAt: nowISO(),
          updatedAt: nowISO(),
        }
        db.customers.unshift(customer)
        customerId = customer.id
      }
    }

    const metrics = calcSaleMetrics(
      vehicle,
      db.expenses,
      input.valorVendido,
      input.comissao,
      input.dataVenda,
    )

    const sale: Sale = {
      id: generateId('sale'),
      vehicleId: input.vehicleId,
      customerId: customerId!,
      clienteNome: input.clienteNome,
      cpf: input.cpf,
      telefone: input.telefone,
      cidade: input.cidade,
      endereco: input.endereco,
      dataVenda: input.dataVenda,
      formaPagamento: input.formaPagamento,
      entrada: input.entrada,
      parcelas: input.parcelas,
      valorVendido: input.valorVendido,
      comissao: input.comissao,
      observacoes: input.observacoes,
      lucroBruto: metrics.lucroBruto,
      lucroLiquido: metrics.lucroLiquido,
      roi: metrics.roi,
      margem: metrics.margem,
      diasEstoque: metrics.diasEstoque,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }

    db.sales.unshift(sale)
    const vIdx = db.vehicles.findIndex((v) => v.id === input.vehicleId)
    db.vehicles[vIdx] = {
      ...db.vehicles[vIdx],
      status: 'vendido',
      updatedAt: nowISO(),
    }

    historyService.add(db, {
      vehicleId: input.vehicleId,
      type: 'venda',
      descricao: `Venda para ${input.clienteNome} — ${formatCurrency(input.valorVendido)}`,
    })

    persist(db)
    return sale
  },
}
