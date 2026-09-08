import { z } from 'zod'

export const saleStatusSchema = z.enum(['DRAFT', 'PENDING_PAYMENT', 'PAID', 'CANCELED'])

const optionalPriceSchema = z.union([z.string(), z.number()]).optional()

export type CreateSaleInput = {
  offerId: string
  customerId?: string
  leadId?: string
  opportunityId?: string
  partnerId?: string
  finalPrice?: string
  status?: 'DRAFT' | 'PENDING_PAYMENT'
}

export type UpdateSaleInput = {
  status?: z.infer<typeof saleStatusSchema>
  partnerId?: string | null
  finalPrice?: string
  paymentMethod?: string | null
  paymentReference?: string | null
}

export const createSaleSchema = z.object({
  offerId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  opportunityId: z.string().uuid().optional(),
  partnerId: z.string().uuid().optional(),
  finalPrice: optionalPriceSchema,
  status: z.enum(['DRAFT', 'PENDING_PAYMENT']).optional(),
})

export const updateSaleSchema = z
  .object({
    status: saleStatusSchema.optional(),
    partnerId: z.string().uuid().nullable().optional(),
    finalPrice: optionalPriceSchema,
    paymentMethod: z.string().max(100).nullable().optional(),
    paymentReference: z.string().max(200).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' })

export const confirmPaymentSchema = z.object({
  paymentMethod: z.string().max(100).optional(),
  paymentReference: z.string().max(200).optional(),
})

export const listSalesQuerySchema = z.object({
  search: z.string().max(200).optional(),
  status: saleStatusSchema.optional(),
  partnerId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  offerId: z.string().uuid().optional(),
  soldFrom: z.string().datetime().optional(),
  soldTo: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
})

export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>
export type ListSalesQuery = z.infer<typeof listSalesQuerySchema>
