import { z } from 'zod'

export const updatePipelineSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    description: z.string().max(500).optional().nullable(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .strict()

export type UpdatePipelineInput = z.infer<typeof updatePipelineSchema>
