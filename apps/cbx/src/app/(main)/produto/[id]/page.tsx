import { notFound } from 'next/navigation'

import { productService } from '@/services'
import { ProductDetail } from './product-detail'

export function generateStaticParams() {
  return productService.list().map((product) => ({ id: product.id }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProdutoPage({ params }: PageProps) {
  const { id } = await params
  const product = productService.get(id)

  if (!product) notFound()

  return <ProductDetail product={product} />
}
