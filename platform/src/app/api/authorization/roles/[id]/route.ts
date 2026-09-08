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
import { updateRole } from '@/modules/authorization/application/role-service'

const updateRoleSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.AUTHORIZATION_ROLE_UPDATE, request)
    const ctx = await requireAuthorizationContext(request)
    const { id } = await params
    const body = await parseJsonBody(request, updateRoleSchema)
    const role = await updateRole(ctx, id, body)
    return jsonOk({ role })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
