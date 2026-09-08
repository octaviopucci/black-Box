import { redirect } from 'next/navigation'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { SaleCreateClient } from '@/components/sales/sale-create-client'

export default async function NewSalePage() {
  const canCreate = await hasPermission(PERMISSIONS.SALE_CREATE)
  if (!canCreate) redirect('/app/sales')

  const canOverridePrice = await hasPermission(PERMISSIONS.SALE_UPDATE)

  return <SaleCreateClient canOverridePrice={canOverridePrice} />
}
