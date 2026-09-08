import { z } from 'zod'
import { PRODUCT_CATEGORIES } from '@/modules/products/domain/catalog-status'

export const catalogStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'INACTIVE'])

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(120).optional(),
  description: z.string().max(4000).optional(),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  status: catalogStatusSchema.optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    slug: z.string().trim().min(1).max(120).optional(),
    description: z.string().max(4000).optional().nullable(),
    category: z.enum(PRODUCT_CATEGORIES).optional().nullable(),
    status: catalogStatusSchema.optional(),
  })
  .strict()

export type UpdateProductInput = z.infer<typeof updateProductSchema>

export const listProductsQuerySchema = z.object({
  search: z.string().max(200).optional(),
  status: catalogStatusSchema.optional(),
  category: z.enum(PRODUCT_CATEGORIES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
})

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>
