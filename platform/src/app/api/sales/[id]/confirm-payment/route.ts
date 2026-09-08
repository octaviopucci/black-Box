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
import { confirmSalePayment } from '@/modules/sales'
import { confirmPaymentSchema } from '@/modules/sales/schemas/sale.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.SALE_CONFIRM_PAYMENT, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, confirmPaymentSchema)
    const sale = await confirmSalePayment(ctx, id, body)
    return jsonOk({ sale })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
