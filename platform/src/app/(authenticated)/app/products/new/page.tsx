import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { ProductCreateClient } from '@/components/products/product-create-client'

export default async function ProductCreatePage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canCreate = await hasPermission(PERMISSIONS.PRODUCT_CREATE)
  if (!canCreate) redirect('/app/products')

  return <ProductCreateClient canCreate={canCreate} />
}
