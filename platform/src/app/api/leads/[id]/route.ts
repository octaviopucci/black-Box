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
import { getLead } from '@/modules/leads/application/get-lead'
import { updateLead } from '@/modules/leads/application/update-lead'
import { updateLeadSchema } from '@/modules/leads/schemas/update-lead.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.LEAD_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const lead = await getLead(ctx, id)
    return jsonOk({ lead })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.LEAD_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, updateLeadSchema)
    const lead = await updateLead(ctx, id, body)
    return jsonOk({ lead })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
