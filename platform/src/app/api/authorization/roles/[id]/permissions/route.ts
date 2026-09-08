import { z } from 'zod'
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
import { assignPermissionToRole } from '@/modules/authorization/application/role-service'

const assignPermissionSchema = z.object({
  permissionKey: z.string().min(1),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.AUTHORIZATION_ROLE_ASSIGN_PERMISSION, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await params
    const body = await parseJsonBody(request, assignPermissionSchema)
    const result = await assignPermissionToRole(ctx, id, body.permissionKey)
    return jsonOk(result, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
