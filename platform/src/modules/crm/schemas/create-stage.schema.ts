import { z } from 'zod'

export const createStageSchema = z.object({
  name: z.string().min(1).max(120),
  position: z.coerce.number().int().min(0),
})

export type CreateStageInput = z.infer<typeof createStageSchema>
