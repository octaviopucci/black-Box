import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/auth/context'
import { hasPermission, PERMISSIONS } from '@/lib/authorization'
import { PipelinesPageClient } from '@/components/crm/pipelines-page-client'

export default async function PipelinesPage() {
  const ctx = await getAuthContext()
  if (!ctx) redirect('/login')

  const canRead = await hasPermission(PERMISSIONS.PIPELINE_READ)
  if (!canRead) redirect('/app/crm')

  const canCreatePipeline = await hasPermission(PERMISSIONS.PIPELINE_CREATE)
  const canUpdatePipeline = await hasPermission(PERMISSIONS.PIPELINE_UPDATE)
  const canCreateStage = await hasPermission(PERMISSIONS.STAGE_CREATE)
  const canUpdateStage = await hasPermission(PERMISSIONS.STAGE_UPDATE)

  return (
    <PipelinesPageClient
      canCreatePipeline={canCreatePipeline}
      canUpdatePipeline={canUpdatePipeline}
      canCreateStage={canCreateStage}
      canUpdateStage={canUpdateStage}
    />
  )
}
