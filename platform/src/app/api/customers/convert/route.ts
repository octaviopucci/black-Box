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
import { convertLeadToCustomer } from '@/modules/customers'
import { convertLeadSchema } from '@/modules/customers/schemas/customer.schema'

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.CUSTOMER_CONVERT, request)
    const ctx = await requireAuthorizationContext(request)
    const body = await parseJsonBody(request, convertLeadSchema)
    const customer = await convertLeadToCustomer(ctx, body.leadId)
    return jsonOk({ customer }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
