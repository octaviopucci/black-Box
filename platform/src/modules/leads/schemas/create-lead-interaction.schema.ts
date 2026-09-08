import { z } from 'zod'
import { LEAD_INTERACTION_TYPES } from '@/modules/leads/domain/lead'

export const createLeadInteractionSchema = z.object({
  type: z.enum(LEAD_INTERACTION_TYPES),
  description: z.string().min(1).max(4000),
  occurredAt: z.coerce.date().optional(),
})

export type CreateLeadInteractionInput = z.infer<typeof createLeadInteractionSchema>
