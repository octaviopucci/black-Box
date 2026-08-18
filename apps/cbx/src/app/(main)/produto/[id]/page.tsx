import { notFound } from 'next/navigation'

import { productService } from '@/services'
import type { Product } from '@/types'
import { ProductDetail } from './product-detail'

export function generateStaticParams() {
  return productService.list().map((product) => ({ id: product.id }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

async function loadProduct(id: string): Promise<Product | undefined> {
  const mock = productService.get(id)
  if (mock) return mock

  // Server/API mode only — avoid Prisma during static Black Box export
  if (process.env.CBX_STATIC === '1' || !process.env.DATABASE_URL) return undefined

  try {
    const { prisma } = await import('@/lib/prisma')
    const { toApiProduct } = await import('@/lib/mappers')
    const row = await prisma.product.findUnique({ where: { id } })
    return row ? toApiProduct(row) : undefined
  } catch {
    return undefined
  }
}

export default async function ProdutoPage({ params }: PageProps) {
  const { id } = await params
  const product = await loadProduct(id)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
