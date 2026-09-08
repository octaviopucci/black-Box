import type { SaleStatus } from '@prisma/client'
import { validationError } from '@/lib/errors'

export const SALE_STATUSES = ['DRAFT', 'PENDING_PAYMENT', 'PAID', 'CANCELED'] as const satisfies readonly SaleStatus[]

const VALID_TRANSITIONS: Record<SaleStatus, SaleStatus[]> = {
  DRAFT: ['PENDING_PAYMENT', 'CANCELED'],
  PENDING_PAYMENT: ['PAID', 'CANCELED'],
  PAID: ['CANCELED'],
  CANCELED: [],
}

export function assertValidSaleStatusTransition(from: SaleStatus, to: SaleStatus) {
  if (from === to) return
  const allowed = VALID_TRANSITIONS[from]
  if (!allowed.includes(to)) {
    throw validationError(`Invalid sale status transition from ${from} to ${to}`)
  }
}

export function canConfirmPayment(status: SaleStatus): boolean {
  return status === 'PENDING_PAYMENT'
}
