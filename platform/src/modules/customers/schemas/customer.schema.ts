import { z } from 'zod'

export const customerStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(200),
  legalName: z.string().max(200).optional(),
  document: z.string().max(50).optional(),
  email: z.string().email().max(200).optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  companyName: z.string().max(200).optional(),
  leadId: z.string().uuid().optional(),
  partnerId: z.string().uuid().optional(),
  status: customerStatusSchema.optional(),
})

export const updateCustomerSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    legalName: z.string().max(200).nullable().optional(),
    document: z.string().max(50).nullable().optional(),
    email: z.string().email().max(200).nullable().optional().or(z.literal('')),
    phone: z.string().max(50).nullable().optional(),
    companyName: z.string().max(200).nullable().optional(),
    partnerId: z.string().uuid().nullable().optional(),
    status: customerStatusSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' })

export const convertLeadSchema = z.object({
  leadId: z.string().uuid(),
})

export const listCustomersQuerySchema = z.object({
  search: z.string().max(200).optional(),
  status: customerStatusSchema.optional(),
  partnerId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
})

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>
