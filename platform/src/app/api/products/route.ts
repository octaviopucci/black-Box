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
import { createProduct, listProducts } from '@/modules/products'
import { createProductSchema, listProductsQuerySchema } from '@/modules/products/schemas/product.schema'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PRODUCT_READ, request)
    const ctx = await requireAuthorizationContext(request)

    const url = new URL(request.url)
    const query = listProductsQuerySchema.parse({
      search: url.searchParams.get('search') ?? undefined,
      status: url.searchParams.get('status') ?? undefined,
      category: url.searchParams.get('category') ?? undefined,
      page: url.searchParams.get('page') ?? undefined,
      pageSize: url.searchParams.get('pageSize') ?? undefined,
    })

    const result = await listProducts(ctx, query)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PRODUCT_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const body = await parseJsonBody(request, createProductSchema)
    const product = await createProduct(ctx, body)
    return jsonOk({ product }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
