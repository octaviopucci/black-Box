import { redirect } from 'next/navigation'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { CustomersPageClient } from '@/components/customers/customers-page-client'

export default async function CustomersPage() {
  const canRead = await hasPermission(PERMISSIONS.CUSTOMER_READ)
  if (!canRead) redirect('/app')

  return <CustomersPageClient />
}
