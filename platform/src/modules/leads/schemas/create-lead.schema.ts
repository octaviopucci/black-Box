import { z } from 'zod'

export const createLeadSchema = z.object({
  name: z.string().min(1).max(200),
  companyName: z.string().max(200).optional(),
  email: z.union([z.string().email().max(320), z.literal('')]).optional(),
  phone: z.string().max(30).optional(),
  document: z.string().max(50).optional(),
  partnerId: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
  source: z.string().max(120).optional(),
})

export type CreateLeadInput = z.infer<typeof createLeadSchema>
