import { z } from 'zod'

export const moveOpportunitySchema = z.object({
  stageId: z.string().uuid(),
})

export type MoveOpportunityInput = z.infer<typeof moveOpportunitySchema>
