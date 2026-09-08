import { z } from 'zod'

export const CRM_INTERACTION_TYPES = [
  'NOTE',
  'CALL',
  'WHATSAPP',
  'EMAIL',
  'MEETING',
  'PROPOSAL',
  'OTHER',
] as const

export const createCrmInteractionSchema = z.object({
  type: z.enum(CRM_INTERACTION_TYPES),
  description: z.string().min(1).max(4000),
  occurredAt: z.coerce.date().optional(),
})

export type CreateCrmInteractionInput = z.infer<typeof createCrmInteractionSchema>
