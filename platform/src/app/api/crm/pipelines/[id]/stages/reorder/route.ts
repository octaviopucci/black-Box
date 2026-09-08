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
import { reorderStages } from '@/modules/crm/application/create-stage'
import { reorderStagesSchema } from '@/modules/crm/schemas/update-stage.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.STAGE_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, reorderStagesSchema)
    const stages = await reorderStages(ctx, id, body)
    return jsonOk({ stages })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
