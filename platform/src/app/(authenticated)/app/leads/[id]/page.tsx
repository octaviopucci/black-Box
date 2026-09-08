import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { LeadDetailClient } from '@/components/leads/lead-detail-client'

type PageProps = { params: Promise<{ id: string }> }

export default async function LeadDetailPage({ params }: PageProps) {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canRead = await hasPermission(PERMISSIONS.LEAD_READ)
  if (!canRead) redirect('/app')

  const canUpdate = await hasPermission(PERMISSIONS.LEAD_UPDATE)
  const canCreateInteraction = await hasPermission(PERMISSIONS.LEAD_INTERACTION_CREATE)
  const { id } = await params

  return (
    <LeadDetailClient
      leadId={id}
      canUpdate={canUpdate}
      canCreateInteraction={canCreateInteraction}
    />
  )
}
