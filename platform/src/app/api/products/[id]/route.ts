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
import { getProduct, updateProduct } from '@/modules/products'
import { updateProductSchema } from '@/modules/products/schemas/product.schema'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PRODUCT_READ, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const product = await getProduct(ctx, id)
    return jsonOk({ product })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.PRODUCT_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await context.params
    const body = await parseJsonBody(request, updateProductSchema)
    const product = await updateProduct(ctx, id, body)
    return jsonOk({ product })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
