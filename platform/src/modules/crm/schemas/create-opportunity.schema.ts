import { z } from 'zod'

export const createOpportunitySchema = z.object({
  leadId: z.string().uuid(),
  partnerId: z.string().uuid().optional(),
  pipelineId: z.string().uuid().optional(),
  stageId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional(),
  amount: z.coerce.number().min(0).optional(),
  probability: z.coerce.number().int().min(0).max(100).optional(),
  expectedCloseAt: z.coerce.date().optional(),
})

export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>
