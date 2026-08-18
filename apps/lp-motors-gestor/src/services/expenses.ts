import type {
  Expense,
  Payable,
  Supplier,
  VehicleChecklist,
  VehicleDocument,
} from '@/types'
import { ensureChecklist, loadDatabase } from '@/services/database'
import { auditService, historyService, persist } from '@/services/auth'
import { generateId, nowISO, formatCurrency } from '@/utils'
import { EXPENSE_LABELS, DOCUMENT_LABELS } from '@/utils/constants'

export type ExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>

export const expenseService = {
  listByVehicle(vehicleId: string): Expense[] {
    return loadDatabase()
      .expenses.filter((e) => e.vehicleId === vehicleId)
      .sort((a, b) => b.data.localeCompare(a.data))
  },

  listAll(): Expense[] {
    return loadDatabase().expenses.slice().sort((a, b) => b.data.localeCompare(a.data))
  },

  create(input: ExpenseInput): Expense {
    const db = loadDatabase()
    const expense: Expense = {
      ...input,
      id: generateId('exp'),
      organizationId: db.organization?.id,
      fornecedorNome: input.fornecedorNome ?? '',
      responsavel: input.responsavel ?? '',
      formaPagamento: input.formaPagamento ?? '',
      status: input.status ?? 'pago',
      documentoUrl: input.documentoUrl ?? '',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.expenses.unshift(expense)
    historyService.add(db, {
      vehicleId: input.vehicleId,
      type: 'despesa',
      descricao: `Despesa ${EXPENSE_LABELS[input.categoria] || input.categoria}: ${input.descricao} — ${formatCurrency(input.valor)}`,
    })
    auditService.log(db, 'expense.create', 'expense', expense.id, expense.descricao)
    persist(db)
    return expense
  },

  update(id: string, patch: Partial<ExpenseInput>): Expense {
    const db = loadDatabase()
    const idx = db.expenses.findIndex((e) => e.id === id)
    if (idx < 0) throw new Error('Despesa não encontrada')
    const updated: Expense = {
      ...db.expenses[idx],
      ...patch,
      id: db.expenses[idx].id,
      createdAt: db.expenses[idx].createdAt,
      updatedAt: nowISO(),
    }
    db.expenses[idx] = updated
    auditService.log(db, 'expense.update', 'expense', id, updated.descricao)
    persist(db)
    return updated
  },

  remove(id: string): void {
    const db = loadDatabase()
    const expense = db.expenses.find((e) => e.id === id)
    if (!expense) throw new Error('Despesa não encontrada')
    db.expenses = db.expenses.filter((e) => e.id !== id)
    historyService.add(db, {
      vehicleId: expense.vehicleId,
      type: 'despesa',
      descricao: `Despesa removida: ${expense.descricao}`,
    })
    auditService.log(db, 'expense.delete', 'expense', id, expense.descricao)
    persist(db)
  },

  totalByVehicle(vehicleId: string): number {
    return this.listByVehicle(vehicleId).reduce((acc, e) => acc + e.valor, 0)
  },

  byCategory(): Record<string, number> {
    const map: Record<string, number> = {}
    for (const e of this.listAll()) {
      map[e.categoria] = (map[e.categoria] || 0) + e.valor
    }
    return map
  },
}

export const documentService = {
  listByVehicle(vehicleId: string): VehicleDocument[] {
    return loadDatabase()
      .documents.filter((d) => d.vehicleId === vehicleId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  create(input: Omit<VehicleDocument, 'id' | 'createdAt' | 'updatedAt'>): VehicleDocument {
    const db = loadDatabase()
    const doc: VehicleDocument = {
      ...input,
      id: generateId('doc'),
      organizationId: db.organization?.id,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.documents.unshift(doc)
    historyService.add(db, {
      vehicleId: input.vehicleId,
      type: 'documento',
      descricao: `Documento enviado: ${DOCUMENT_LABELS[input.categoria] || input.categoria} — ${input.nome}`,
    })
    auditService.log(db, 'document.upload', 'document', doc.id, doc.nome)
    persist(db)
    return doc
  },

  remove(id: string): void {
    const db = loadDatabase()
    const doc = db.documents.find((d) => d.id === id)
    if (!doc) throw new Error('Documento não encontrado')
    db.documents = db.documents.filter((d) => d.id !== id)
    historyService.add(db, {
      vehicleId: doc.vehicleId,
      type: 'documento',
      descricao: `Documento removido: ${doc.nome}`,
    })
    persist(db)
  },
}

export const checklistService = {
  get(vehicleId: string): VehicleChecklist {
    const db = loadDatabase()
    const chk = ensureChecklist(db, vehicleId)
    persist(db)
    return chk
  },

  toggle(vehicleId: string, itemId: string, done: boolean, doneBy?: string): VehicleChecklist {
    const db = loadDatabase()
    const chk = ensureChecklist(db, vehicleId)
    chk.items = chk.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            done,
            doneAt: done ? nowISO() : undefined,
            doneBy: done ? doneBy || 'Sistema' : undefined,
          }
        : item,
    )
    chk.updatedAt = nowISO()
    historyService.add(db, {
      vehicleId,
      type: 'checklist',
      descricao: `Checklist atualizado (${chk.items.filter((i) => i.done).length}/${chk.items.length})`,
    })
    persist(db)
    return chk
  },
}

export const supplierService = {
  list(): Supplier[] {
    return loadDatabase().suppliers.slice().sort((a, b) => a.nome.localeCompare(b.nome))
  },

  create(input: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | 'active'>): Supplier {
    const db = loadDatabase()
    const supplier: Supplier = {
      ...input,
      id: generateId('sup'),
      organizationId: db.organization?.id,
      active: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.suppliers.unshift(supplier)
    persist(db)
    return supplier
  },

  update(id: string, patch: Partial<Supplier>): Supplier {
    const db = loadDatabase()
    const idx = db.suppliers.findIndex((s) => s.id === id)
    if (idx < 0) throw new Error('Fornecedor não encontrado')
    db.suppliers[idx] = { ...db.suppliers[idx], ...patch, updatedAt: nowISO() }
    persist(db)
    return db.suppliers[idx]
  },

  remove(id: string): void {
    const db = loadDatabase()
    db.suppliers = db.suppliers.filter((s) => s.id !== id)
    persist(db)
  },

  stats() {
    const db = loadDatabase()
    return db.suppliers.map((s) => {
      const expenses = db.expenses.filter(
        (e) => e.fornecedorId === s.id || e.fornecedorNome.toLowerCase() === s.nome.toLowerCase(),
      )
      const total = expenses.reduce((a, e) => a + e.valor, 0)
      return {
        supplier: s,
        count: expenses.length,
        total,
        average: expenses.length ? total / expenses.length : 0,
      }
    })
  },
}

export const payableService = {
  list(): Payable[] {
    return loadDatabase().payables.slice().sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  },

  create(input: Omit<Payable, 'id' | 'createdAt' | 'updatedAt'>): Payable {
    const db = loadDatabase()
    const payable: Payable = {
      ...input,
      id: generateId('pay'),
      organizationId: db.organization?.id,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.payables.unshift(payable)
    auditService.log(db, 'payable.create', 'payable', payable.id, payable.descricao)
    persist(db)
    return payable
  },

  update(id: string, patch: Partial<Payable>): Payable {
    const db = loadDatabase()
    const idx = db.payables.findIndex((p) => p.id === id)
    if (idx < 0) throw new Error('Conta não encontrada')
    db.payables[idx] = {
      ...db.payables[idx],
      ...patch,
      updatedAt: nowISO(),
      paidAt: patch.status === 'pago' ? nowISO() : db.payables[idx].paidAt,
    }
    persist(db)
    return db.payables[idx]
  },

  remove(id: string): void {
    const db = loadDatabase()
    db.payables = db.payables.filter((p) => p.id !== id)
    persist(db)
  },
}
