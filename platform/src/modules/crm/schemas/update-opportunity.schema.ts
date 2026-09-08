import { z } from 'zod'

export const updateOpportunitySchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(4000).optional().nullable(),
    amount: z.coerce.number().min(0).optional().nullable(),
    probability: z.coerce.number().int().min(0).max(100).optional().nullable(),
    expectedCloseAt: z.coerce.date().optional().nullable(),
    partnerId: z.string().uuid().optional().nullable(),
  })
  .strict()

export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>
