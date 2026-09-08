import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { LeadsPageClient } from '@/components/leads/leads-page-client'

export default async function LeadsPage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canRead = await hasPermission(PERMISSIONS.LEAD_READ)
  if (!canRead) redirect('/app')

  const canCreate = await hasPermission(PERMISSIONS.LEAD_CREATE)
  return <LeadsPageClient canCreate={canCreate} />
}
