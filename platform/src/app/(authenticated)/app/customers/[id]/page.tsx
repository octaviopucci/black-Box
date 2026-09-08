import { redirect } from 'next/navigation'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { CustomerDetailClient } from '@/components/customers/customer-detail-client'

type PageProps = { params: Promise<{ id: string }> }

export default async function CustomerDetailPage({ params }: PageProps) {
  const canRead = await hasPermission(PERMISSIONS.CUSTOMER_READ)
  if (!canRead) redirect('/app')

  const { id } = await params

  return <CustomerDetailClient customerId={id} />
}
