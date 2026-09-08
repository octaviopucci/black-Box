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
import { createOffer, listOffersForProduct } from '@/modules/products'
import { createOfferSchema } from '@/modules/products/schemas/offer.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OFFER_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const offers = await listOffersForProduct(ctx, id)
    return jsonOk({ offers })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OFFER_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, createOfferSchema)
    const offer = await createOffer(ctx, id, body)
    return jsonOk({ offer }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
