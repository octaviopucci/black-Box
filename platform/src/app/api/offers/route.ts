import {
  jsonOk,
  handleRouteError,
  getRequestId,
} from '@/lib/http/response'
import {
  PERMISSIONS,
  requirePermission,
  requireAuthorizationContext,
} from '@/lib/authorization'
import { listOffers } from '@/modules/products'
import { listOffersQuerySchema } from '@/modules/products/schemas/offer.schema'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OFFER_READ, request)
    const ctx = await requireAuthorizationContext(request)

    const url = new URL(request.url)
    const query = listOffersQuerySchema.parse({
      search: url.searchParams.get('search') ?? undefined,
      status: url.searchParams.get('status') ?? undefined,
      productId: url.searchParams.get('productId') ?? undefined,
      page: url.searchParams.get('page') ?? undefined,
      pageSize: url.searchParams.get('pageSize') ?? undefined,
    })

    const result = await listOffers(ctx, query)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
