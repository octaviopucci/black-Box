import {
  jsonOk,
  handleRouteError,
  getRequestId,
  parseJsonBody,
} from '@/lib/http/response'
import {
  PERMISSIONS,
  requirePermission,
  requireAuthorizationContext,
} from '@/lib/authorization'
import {
  getPartnerById,
  updatePartner,
  updatePartnerSchema,
} from '@/modules/partners'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PARTNER_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const partner = await getPartnerById(ctx, id)
    return jsonOk({ partner })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PARTNER_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, updatePartnerSchema)
    const partner = await updatePartner(ctx, id, body)
    return jsonOk({ partner })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
