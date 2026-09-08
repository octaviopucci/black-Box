import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { OpportunityDetailClient } from '@/components/crm/opportunity-detail-client'

type PageProps = { params: Promise<{ id: string }> }

export default async function OpportunityDetailPage({ params }: PageProps) {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canRead = await hasPermission(PERMISSIONS.OPPORTUNITY_READ)
  if (!canRead) redirect('/app')

  const { id } = await params
  const canUpdate = await hasPermission(PERMISSIONS.OPPORTUNITY_UPDATE)
  const canMove = await hasPermission(PERMISSIONS.OPPORTUNITY_MOVE)
  const canCreateInteraction = await hasPermission(PERMISSIONS.OPPORTUNITY_INTERACTION_CREATE)

  return (
    <OpportunityDetailClient
      opportunityId={id}
      canUpdate={canUpdate}
      canMove={canMove}
      canCreateInteraction={canCreateInteraction}
    />
  )
}
