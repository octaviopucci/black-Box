import type { LeadInteractionType } from '@prisma/client'

export type LeadInteractionDto = {
  id: string
  organizationId: string
  leadId: string
  type: LeadInteractionType
  description: string
  occurredAt: Date
  createdByUserId: string
  createdAt: Date
  createdBy?: { id: string; name: string }
}

export function isValidInteractionType(value: string): value is LeadInteractionType {
  return ['NOTE', 'CALL', 'WHATSAPP', 'EMAIL', 'MEETING', 'OTHER'].includes(value)
}
