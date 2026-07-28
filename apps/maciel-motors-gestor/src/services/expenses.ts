import type { Expense } from '@/types'
import { loadDatabase } from '@/services/database'
import { historyService, persist } from '@/services/auth'
import { generateId, nowISO } from '@/utils'
import { EXPENSE_LABELS } from '@/utils/constants'
import { formatCurrency } from '@/utils'

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
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.expenses.unshift(expense)
    historyService.add(db, {
      vehicleId: input.vehicleId,
      type: 'despesa',
      descricao: `Despesa ${EXPENSE_LABELS[input.categoria]}: ${input.descricao} — ${formatCurrency(input.valor)}`,
    })
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
