import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { PartnerDetailClient } from '@/components/partners/partner-detail-client'

type PageProps = { params: Promise<{ id: string }> }

export default async function PartnerDetailPage({ params }: PageProps) {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canRead = await hasPermission(PERMISSIONS.PARTNER_READ)
  if (!canRead) redirect('/app')

  const canUpdate = await hasPermission(PERMISSIONS.PARTNER_UPDATE)
  const canActivate = await hasPermission(PERMISSIONS.PARTNER_ACTIVATE)
  const { id } = await params

  return (
    <PartnerDetailClient
      partnerId={id}
      canUpdate={canUpdate}
      canActivate={canActivate}
    />
  )
}
