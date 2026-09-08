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
import { createSale, listSales } from '@/modules/sales'
import { createSaleSchema, listSalesQuerySchema, type CreateSaleInput } from '@/modules/sales/schemas/sale.schema'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.SALE_READ, request)
    const ctx = await requireAuthorizationContext(request)

    const url = new URL(request.url)
    const query = listSalesQuerySchema.parse({
      search: url.searchParams.get('search') ?? undefined,
      status: url.searchParams.get('status') ?? undefined,
      partnerId: url.searchParams.get('partnerId') ?? undefined,
      customerId: url.searchParams.get('customerId') ?? undefined,
      offerId: url.searchParams.get('offerId') ?? undefined,
      soldFrom: url.searchParams.get('soldFrom') ?? undefined,
      soldTo: url.searchParams.get('soldTo') ?? undefined,
      page: url.searchParams.get('page') ?? undefined,
      pageSize: url.searchParams.get('pageSize') ?? undefined,
    })

    const result = await listSales(ctx, query)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.SALE_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const body = await parseJsonBody(request, createSaleSchema) as CreateSaleInput
    const sale = await createSale(ctx, body)
    return jsonOk({ sale }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
