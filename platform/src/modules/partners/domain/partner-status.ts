import type { PartnerStatus } from '@prisma/client'
import { validationError } from '@/lib/errors'

const ALLOWED_TRANSITIONS: Record<PartnerStatus, PartnerStatus[]> = {
  PENDING: ['ACTIVE', 'INACTIVE'],
  ACTIVE: ['INACTIVE'],
  INACTIVE: ['ACTIVE'],
}

export function assertValidStatusTransition(
  current: PartnerStatus,
  next: PartnerStatus,
): void {
  if (current === next) return
  if (!ALLOWED_TRANSITIONS[current].includes(next)) {
    throw validationError(`Invalid status transition from ${current} to ${next}`)
  }
}
