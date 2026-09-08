import { redirect } from 'next/navigation'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { SalesPageClient } from '@/components/sales/sales-page-client'

export default async function SalesPage() {
  const canRead = await hasPermission(PERMISSIONS.SALE_READ)
  if (!canRead) redirect('/app')

  const canCreate = await hasPermission(PERMISSIONS.SALE_CREATE)

  return <SalesPageClient canCreate={canCreate} />
}
