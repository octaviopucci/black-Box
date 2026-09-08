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
import { getPipeline } from '@/modules/crm/application/create-pipeline'
import { createStage } from '@/modules/crm/application/create-stage'
import { createStageSchema } from '@/modules/crm/schemas/create-stage.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PIPELINE_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const pipeline = await getPipeline(ctx, id)
    return jsonOk({ stages: pipeline.stages })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.STAGE_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, createStageSchema)
    const stage = await createStage(ctx, id, body)
    return jsonOk({ stage }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
