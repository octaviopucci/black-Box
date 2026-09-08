import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { PartnerCreateClient } from '@/components/partners/partner-create-client'

export default async function NewPartnerPage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canCreate = await hasPermission(PERMISSIONS.PARTNER_CREATE)
  if (!canCreate) redirect('/app/partners')

  return <PartnerCreateClient />
}
