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
import { createLeadInteraction } from '@/modules/leads/application/create-lead-interaction'
import { listLeadInteractions } from '@/modules/leads/application/list-lead-interactions'
import { createLeadInteractionSchema } from '@/modules/leads/schemas/create-lead-interaction.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.LEAD_INTERACTION_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const interactions = await listLeadInteractions(ctx, id)
    return jsonOk({ interactions })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.LEAD_INTERACTION_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, createLeadInteractionSchema)
    const interaction = await createLeadInteraction(ctx, id, body)
    return jsonOk({ interaction }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
