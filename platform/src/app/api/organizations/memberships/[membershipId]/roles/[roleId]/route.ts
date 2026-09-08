import { jsonOk, handleRouteError, getRequestId } from '@/lib/http/response'
import {
  PERMISSIONS,
  requirePermission,
  requireAuthorizationContext,
} from '@/lib/authorization'
import { removeRoleFromMembership } from '@/modules/authorization/application/role-service'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ membershipId: string; roleId: string }> },
) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.AUTHORIZATION_MEMBERSHIP_REMOVE_ROLE, request)
    const ctx = await requireAuthorizationContext(request)
    const { membershipId, roleId } = await params
    const result = await removeRoleFromMembership(ctx, membershipId, roleId)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
