import { z } from 'zod'

export const updateLeadSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    companyName: z.string().max(200).optional().nullable(),
    email: z.union([z.string().email().max(320), z.literal(''), z.null()]).optional(),
    phone: z.string().max(30).optional().nullable(),
    document: z.string().max(50).optional().nullable(),
    partnerId: z.string().uuid().optional().nullable(),
    notes: z.string().max(2000).optional().nullable(),
    source: z.string().max(120).optional().nullable(),
  })
  .strict()

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
