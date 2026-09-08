import { jsonOk, handleRouteError, getRequestId } from '@/lib/http/response'
import {
  PERMISSIONS,
  requirePermission,
  requireAuthorizationContext,
} from '@/lib/authorization'
import { activatePartner } from '@/modules/partners'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PARTNER_ACTIVATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const partner = await activatePartner(ctx, id)
    return jsonOk({ partner })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
