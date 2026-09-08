import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { OfferCreateClient } from '@/components/products/offer-create-client'

type PageProps = { params: Promise<{ id: string }> }

export default async function OfferCreatePage({ params }: PageProps) {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canCreate = await hasPermission(PERMISSIONS.OFFER_CREATE)
  if (!canCreate) redirect('/app/products')

  const { id } = await params
  return <OfferCreateClient productId={id} canCreate={canCreate} />
}
