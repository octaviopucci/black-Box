import { z } from 'zod'

export const createPipelineSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  isDefault: z.boolean().optional(),
})

export type CreatePipelineInput = z.infer<typeof createPipelineSchema>
