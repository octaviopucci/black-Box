import type { LeadInteractionType } from '@prisma/client'

export const LEAD_INTERACTION_TYPES = [
  'NOTE',
  'CALL',
  'WHATSAPP',
  'EMAIL',
  'MEETING',
  'OTHER',
] as const satisfies readonly LeadInteractionType[]

export type LeadDto = {
  id: string
  organizationId: string
  partnerId: string | null
  name: string
  companyName: string | null
  email: string | null
  phone: string | null
  document: string | null
  notes: string | null
  source: string | null
  createdAt: Date
  updatedAt: Date
  partner?: { id: string; name: string } | null
}

export function normalizeLeadName(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function normalizeOptionalText(value: string | undefined | null): string | undefined {
  if (value === undefined || value === null) return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function normalizeLeadEmail(value: string | undefined | null): string | undefined {
  const trimmed = normalizeOptionalText(value)
  return trimmed ? trimmed.toLowerCase() : undefined
}

export function normalizeDocument(value: string | undefined | null): string | undefined {
  const trimmed = normalizeOptionalText(value)
  if (!trimmed) return undefined
  return trimmed.replace(/\s+/g, '')
}
