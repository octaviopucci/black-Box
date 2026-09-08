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
import { createOpportunity } from '@/modules/crm/application/create-opportunity'
import { listOpportunities } from '@/modules/crm/application/list-opportunities'
import { createOpportunitySchema } from '@/modules/crm/schemas/create-opportunity.schema'
import { listOpportunitiesQuerySchema } from '@/modules/crm/schemas/list-opportunities.schema'

export async function GET(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OPPORTUNITY_READ, request)
    const ctx = await requireAuthorizationContext(request)

    const url = new URL(request.url)
    const query = listOpportunitiesQuerySchema.parse({
      search: url.searchParams.get('search') ?? undefined,
      pipelineId: url.searchParams.get('pipelineId') ?? undefined,
      stageId: url.searchParams.get('stageId') ?? undefined,
      partnerId: url.searchParams.get('partnerId') ?? undefined,
      leadId: url.searchParams.get('leadId') ?? undefined,
      page: url.searchParams.get('page') ?? undefined,
      pageSize: url.searchParams.get('pageSize') ?? undefined,
    })

    const result = await listOpportunities(ctx, query)
    return jsonOk(result)
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request)

  try {
    await requirePermission(PERMISSIONS.OPPORTUNITY_CREATE, request)
    const ctx = await requireAuthorizationContext(request)
    const body = await parseJsonBody(request, createOpportunitySchema)
    const opportunity = await createOpportunity(ctx, body)
    return jsonOk({ opportunity }, { status: 201 })
  } catch (error) {
    return handleRouteError(error, requestId)
  }
}
