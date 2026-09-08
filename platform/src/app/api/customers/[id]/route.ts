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
import { getCustomer, updateCustomer } from '@/modules/customers'
import { updateCustomerSchema } from '@/modules/customers/schemas/customer.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.CUSTOMER_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const result = await getCustomer(ctx, id)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.CUSTOMER_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, updateCustomerSchema)
    const customer = await updateCustomer(ctx, id, body)
    return jsonOk({ customer })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
