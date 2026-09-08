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
import { createLead } from '@/modules/leads/application/create-lead'
import { listLeads } from '@/modules/leads/application/list-leads'
import { createLeadSchema } from '@/modules/leads/schemas/create-lead.schema'
import { listLeadsQuerySchema } from '@/modules/leads/schemas/list-leads.schema'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.LEAD_READ, request)
    const ctx = await requireAuthorizationContext(request)

    const url = new URL(request.url)
    const query = listLeadsQuerySchema.parse({
      search: url.searchParams.get('search') ?? undefined,
      partnerId: url.searchParams.get('partnerId') ?? undefined,
      source: url.searchParams.get('source') ?? undefined,
      page: url.searchParams.get('page') ?? undefined,
      pageSize: url.searchParams.get('pageSize') ?? undefined,
    })

    const result = await listLeads(ctx, query)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.LEAD_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const body = await parseJsonBody(request, createLeadSchema)
    const lead = await createLead(ctx, body)
    return jsonOk({ lead }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
