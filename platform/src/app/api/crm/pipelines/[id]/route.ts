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
import { getPipeline, updatePipeline } from '@/modules/crm/application/create-pipeline'
import { updatePipelineSchema } from '@/modules/crm/schemas/update-pipeline.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PIPELINE_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const pipeline = await getPipeline(ctx, id)
    return jsonOk({ pipeline })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PIPELINE_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, updatePipelineSchema)
    const pipeline = await updatePipeline(ctx, id, body)
    return jsonOk({ pipeline })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
