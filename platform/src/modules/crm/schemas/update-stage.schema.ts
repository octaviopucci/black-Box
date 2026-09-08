import { z } from 'zod'

export const updateStageSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    description: z.string().max(500).optional().nullable(),
    position: z.coerce.number().int().min(0).optional(),
  })
  .strict()

export type UpdateStageInput = z.infer<typeof updateStageSchema>

export const reorderStagesSchema = z.object({
  stageIds: z.array(z.string().uuid()).min(1),
})

export type ReorderStagesInput = z.infer<typeof reorderStagesSchema>
