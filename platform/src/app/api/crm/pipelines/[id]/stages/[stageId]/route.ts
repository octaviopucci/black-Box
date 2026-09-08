import {
  parseJsonBody,
  jsonOk,
  handleRouteError,
  getRequestId,
} from '@/lib/http/response'
import {
  PERMISSIONS,
  requirePermission,
  requireAuthorizationContext,
} from '@/lib/authorization'
import { updateStage } from '@/modules/crm/application/create-stage'
import { updateStageSchema } from '@/modules/crm/schemas/update-stage.schema'

type RouteContext = { params: Promise<{ id: string; stageId: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.STAGE_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id, stageId } = await context.params
    const body = await parseJsonBody(request, updateStageSchema)
    const stage = await updateStage(ctx, id, stageId, body)
    return jsonOk({ stage })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
