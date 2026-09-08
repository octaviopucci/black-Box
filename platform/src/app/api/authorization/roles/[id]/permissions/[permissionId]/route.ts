import { jsonOk, handleRouteError, getRequestId } from '@/lib/http/response'
import {
  PERMISSIONS,
  requirePermission,
  requireAuthorizationContext,
} from '@/lib/authorization'
import { removePermissionFromRole } from '@/modules/authorization/application/role-service'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; permissionId: string }> },
) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.AUTHORIZATION_ROLE_ASSIGN_PERMISSION, request)
    const ctx = await requireAuthorizationContext(request)
    const { id, permissionId } = await params
    const result = await removePermissionFromRole(ctx, id, permissionId)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
