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
import { getSale, updateSale } from '@/modules/sales'
import { updateSaleSchema, type UpdateSaleInput } from '@/modules/sales/schemas/sale.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.SALE_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const result = await getSale(ctx, id)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.SALE_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, updateSaleSchema) as UpdateSaleInput
    const sale = await updateSale(ctx, id, body)
    return jsonOk({ sale })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
