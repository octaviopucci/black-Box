import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { ProductDetailClient } from '@/components/products/product-detail-client'

type PageProps = { params: Promise<{ id: string }> }

export default async function ProductDetailPage({ params }: PageProps) {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canRead = await hasPermission(PERMISSIONS.PRODUCT_READ)
  if (!canRead) redirect('/app')

  const { id } = await params
  const canUpdateProduct = await hasPermission(PERMISSIONS.PRODUCT_UPDATE)
  const canCreateOffer = await hasPermission(PERMISSIONS.OFFER_CREATE)
  const canUpdateOffer = await hasPermission(PERMISSIONS.OFFER_UPDATE)

  return (
    <ProductDetailClient
      productId={id}
      canUpdateProduct={canUpdateProduct}
      canCreateOffer={canCreateOffer}
      canUpdateOffer={canUpdateOffer}
    />
  )
}
