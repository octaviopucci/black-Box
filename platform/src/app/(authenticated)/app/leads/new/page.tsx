import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { LeadCreateClient } from '@/components/leads/lead-create-client'

export default async function NewLeadPage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canCreate = await hasPermission(PERMISSIONS.LEAD_CREATE)
  if (!canCreate) redirect('/app/leads')

  return <LeadCreateClient />
}
