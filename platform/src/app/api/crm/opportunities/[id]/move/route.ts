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
import { moveOpportunity } from '@/modules/crm/application/move-opportunity'
import { moveOpportunitySchema } from '@/modules/crm/schemas/move-opportunity.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OPPORTUNITY_MOVE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, moveOpportunitySchema)
    const opportunity = await moveOpportunity(ctx, id, body)
    return jsonOk({ opportunity })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
