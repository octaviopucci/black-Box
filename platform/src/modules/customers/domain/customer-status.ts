import type { CustomerStatus } from '@prisma/client'

export const CUSTOMER_STATUSES = ['ACTIVE', 'INACTIVE'] as const satisfies readonly CustomerStatus[]

export function assertValidCustomerStatus(value: string): asserts value is CustomerStatus {
  if (!CUSTOMER_STATUSES.includes(value as CustomerStatus)) {
    throw new Error(`Invalid customer status: ${value}`)
  }
}
