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
import { createPipeline, listPipelines } from '@/modules/crm/application/create-pipeline'
import { createPipelineSchema } from '@/modules/crm/schemas/create-pipeline.schema'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PIPELINE_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const pipelines = await listPipelines(ctx)
    return jsonOk({ pipelines })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PIPELINE_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const body = await parseJsonBody(request, createPipelineSchema)
    const pipeline = await createPipeline(ctx, body)
    return jsonOk({ pipeline }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
