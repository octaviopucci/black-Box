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
import { getOffer, updateOffer } from '@/modules/products'
import { updateOfferSchema } from '@/modules/products/schemas/offer.schema'

type RouteContext = { params: Promise<{ id: string; offerId: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OFFER_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id, offerId } = await context.params
    const offer = await getOffer(ctx, id, offerId)
    return jsonOk({ offer })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OFFER_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id, offerId } = await context.params
    const body = await parseJsonBody(request, updateOfferSchema)
    const offer = await updateOffer(ctx, id, offerId, body)
    return jsonOk({ offer })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
