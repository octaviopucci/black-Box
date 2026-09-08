import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { CrmPageClient } from '@/components/crm/crm-page-client'

export default async function CrmPage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canRead = await hasPermission(PERMISSIONS.OPPORTUNITY_READ)
  if (!canRead) redirect('/app')

  const canCreate = await hasPermission(PERMISSIONS.OPPORTUNITY_CREATE)
  const canMove = await hasPermission(PERMISSIONS.OPPORTUNITY_MOVE)

  return <CrmPageClient canCreate={canCreate} canMove={canMove} />
}
