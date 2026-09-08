import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { ProductsPageClient } from '@/components/products/products-page-client'

export default async function ProductsPage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canRead = await hasPermission(PERMISSIONS.PRODUCT_READ)
  if (!canRead) redirect('/app')

  const canCreate = await hasPermission(PERMISSIONS.PRODUCT_CREATE)
  const canUpdate = await hasPermission(PERMISSIONS.PRODUCT_UPDATE)

  return <ProductsPageClient canCreate={canCreate} canUpdate={canUpdate} />
}
