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
import { assignRoleToMembership } from '@/modules/authorization/application/role-service'

const assignRoleSchema = z.object({
  roleId: z.string().uuid(),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ membershipId: string }> },
) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.AUTHORIZATION_MEMBERSHIP_ASSIGN_ROLE, request)
    const ctx = await requireAuthorizationContext(request)
    const { membershipId } = await params
    const body = await parseJsonBody(request, assignRoleSchema)
    const result = await assignRoleToMembership(ctx, membershipId, body.roleId)
    return jsonOk(result, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
