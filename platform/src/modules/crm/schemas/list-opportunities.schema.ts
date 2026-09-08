import { z } from 'zod'

export const listOpportunitiesQuerySchema = z.object({
  search: z.string().max(200).optional(),
  pipelineId: z.string().uuid().optional(),
  stageId: z.string().uuid().optional(),
  partnerId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
})

export type ListOpportunitiesQuery = z.infer<typeof listOpportunitiesQuerySchema>
