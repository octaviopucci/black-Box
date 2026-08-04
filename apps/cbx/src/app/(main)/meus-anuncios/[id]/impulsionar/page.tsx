import { notFound } from 'next/navigation'

import { productService } from '@/services'
import { productAdStaticParams } from '@/lib/static-params'
import { BoostOptions, BoostPageShell } from './boost-client'

export function generateStaticParams() {
  return productAdStaticParams()
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ImpulsionarPage({ params }: PageProps) {
  const { id } = await params
  const product = productService.get(id)

  if (!product) notFound()

  return (
    <BoostPageShell product={product}>
      <BoostOptions product={product} />
    </BoostPageShell>
  )
}
