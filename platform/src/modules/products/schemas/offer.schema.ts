import { z } from 'zod'
import { catalogStatusSchema } from '@/modules/products/schemas/product.schema'

export const createOfferSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(120).optional(),
  description: z.string().max(4000).optional(),
  price: z.coerce.number().min(0),
  currency: z.string().trim().length(3).optional(),
  status: catalogStatusSchema.optional(),
})

export type CreateOfferInput = z.infer<typeof createOfferSchema>

export const updateOfferSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    slug: z.string().trim().min(1).max(120).optional(),
    description: z.string().max(4000).optional().nullable(),
    price: z.coerce.number().min(0).optional(),
    currency: z.string().trim().min(3).max(3).optional(),
    status: catalogStatusSchema.optional(),
  })
  .strict()

export type UpdateOfferInput = z.infer<typeof updateOfferSchema>

export const listOffersQuerySchema = z.object({
  search: z.string().max(200).optional(),
  status: catalogStatusSchema.optional(),
  productId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
})

export type ListOffersQuery = z.infer<typeof listOffersQuerySchema>
