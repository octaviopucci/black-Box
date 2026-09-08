import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { PartnersPageClient } from '@/components/partners/partners-page-client'

export default async function PartnersPage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canRead = await hasPermission(PERMISSIONS.PARTNER_READ)
  if (!canRead) redirect('/app')

  const canCreate = await hasPermission(PERMISSIONS.PARTNER_CREATE)

  return <PartnersPageClient canCreate={canCreate} />
}
