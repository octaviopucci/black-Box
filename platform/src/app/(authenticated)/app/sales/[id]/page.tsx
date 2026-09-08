import { redirect } from 'next/navigation'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { SaleDetailClient } from '@/components/sales/sale-detail-client'

type PageProps = { params: Promise<{ id: string }> }

export default async function SaleDetailPage({ params }: PageProps) {
  const canRead = await hasPermission(PERMISSIONS.SALE_READ)
  if (!canRead) redirect('/app')

  const { id } = await params
  const canUpdate = await hasPermission(PERMISSIONS.SALE_UPDATE)
  const canConfirmPayment = await hasPermission(PERMISSIONS.SALE_CONFIRM_PAYMENT)

  return (
    <SaleDetailClient
      saleId={id}
      canUpdate={canUpdate}
      canConfirmPayment={canConfirmPayment}
    />
  )
}
