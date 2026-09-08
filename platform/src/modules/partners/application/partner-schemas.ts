import { z } from 'zod'

export const createPartnerSchema = z.object({
  name: z.string().min(1).max(200),
  legalName: z.string().max(200).optional(),
  document: z.string().max(50).optional(),
  email: z.union([z.string().email().max(320), z.literal('')]).optional(),
  phone: z.string().max(30).optional(),
  notes: z.string().max(2000).optional(),
  userId: z.string().uuid().optional(),
})

export const updatePartnerSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    legalName: z.string().max(200).optional().nullable(),
    document: z.string().max(50).optional().nullable(),
    email: z.union([z.string().email().max(320), z.literal(''), z.null()]).optional(),
    phone: z.string().max(30).optional().nullable(),
    notes: z.string().max(2000).optional().nullable(),
    userId: z.string().uuid().optional().nullable(),
  })
  .strict()

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>
