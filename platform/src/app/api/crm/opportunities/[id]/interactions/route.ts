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
import {
  createCrmInteraction,
  listCrmInteractions,
} from '@/modules/crm/application/create-crm-interaction'
import { createCrmInteractionSchema } from '@/modules/crm/schemas/create-crm-interaction.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OPPORTUNITY_INTERACTION_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const interactions = await listCrmInteractions(ctx, id)
    return jsonOk({ interactions })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OPPORTUNITY_INTERACTION_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, createCrmInteractionSchema)
    const interaction = await createCrmInteraction(ctx, id, body)
    return jsonOk({ interaction }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
