import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { OpportunityCreateClient } from '@/components/crm/opportunity-create-client'
import { LoadingState } from '@/components/ui/states'

export default async function OpportunityCreatePage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canCreate = await hasPermission(PERMISSIONS.OPPORTUNITY_CREATE)
  if (!canCreate) redirect('/app/crm')

  return (
    <Suspense fallback={<LoadingState title="Carregando…" />}>
      <OpportunityCreateClient />
    </Suspense>
  )
}
