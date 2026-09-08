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
import { createCustomer, listCustomers } from '@/modules/customers'
import {
  createCustomerSchema,
  listCustomersQuerySchema,
} from '@/modules/customers/schemas/customer.schema'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.CUSTOMER_READ, request)
    const ctx = await requireAuthorizationContext(request)

    const url = new URL(request.url)
    const query = listCustomersQuerySchema.parse({
      search: url.searchParams.get('search') ?? undefined,
      status: url.searchParams.get('status') ?? undefined,
      partnerId: url.searchParams.get('partnerId') ?? undefined,
      page: url.searchParams.get('page') ?? undefined,
      pageSize: url.searchParams.get('pageSize') ?? undefined,
    })

    const result = await listCustomers(ctx, query)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.CUSTOMER_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const body = await parseJsonBody(request, createCustomerSchema)
    const customer = await createCustomer(ctx, body)
    return jsonOk({ customer }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
