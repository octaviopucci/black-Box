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
import { getOpportunity, getOpportunityStageHistory } from '@/modules/crm/application/get-opportunity'
import { updateOpportunity } from '@/modules/crm/application/update-opportunity'
import { updateOpportunitySchema } from '@/modules/crm/schemas/update-opportunity.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OPPORTUNITY_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const [opportunity, stageHistory] = await Promise.all([
      getOpportunity(ctx, id),
      getOpportunityStageHistory(ctx, id),
    ])
    return jsonOk({ opportunity, stageHistory })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OPPORTUNITY_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, updateOpportunitySchema)
    const opportunity = await updateOpportunity(ctx, id, body)
    return jsonOk({ opportunity })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
