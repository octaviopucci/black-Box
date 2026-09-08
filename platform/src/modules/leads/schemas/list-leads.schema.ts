import { z } from 'zod'

export const listLeadsQuerySchema = z.object({
  search: z.string().max(200).optional(),
  partnerId: z.string().uuid().optional(),
  source: z.string().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>
