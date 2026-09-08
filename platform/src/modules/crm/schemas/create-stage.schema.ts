import { z } from 'zod'

export const createStageSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(500).optional(),
  position: z.coerce.number().int().min(0),
})

export type CreateStageInput = z.infer<typeof createStageSchema>
