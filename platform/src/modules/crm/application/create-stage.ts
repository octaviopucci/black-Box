import { prisma } from '@/lib/db'
import { notFoundError } from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'
import { getPipeline } from '@/modules/crm/application/create-pipeline'
import type { CreateStageInput } from '@/modules/crm/schemas/create-stage.schema'
import type { ReorderStagesInput, UpdateStageInput } from '@/modules/crm/schemas/update-stage.schema'

export async function createStage(
  ctx: AuthorizationContext,
  pipelineId: string,
  input: CreateStageInput,
) {
  await getPipeline(ctx, pipelineId)

  return prisma.pipelineStage.create({
    data: {
      organizationId: ctx.organization.id,
      pipelineId,
      name: input.name.trim(),
      description: input.description?.trim(),
      position: input.position,
    },
  })
}

export async function updateStage(
  ctx: AuthorizationContext,
  pipelineId: string,
  stageId: string,
  input: UpdateStageInput,
) {
  const stage = await prisma.pipelineStage.findFirst({
    where: {
      id: stageId,
      pipelineId,
      organizationId: ctx.organization.id,
    },
  })
  if (!stage) throw notFoundError()

  return prisma.pipelineStage.update({
    where: { id: stageId },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() ?? null } : {}),
      ...(input.position !== undefined ? { position: input.position } : {}),
    },
  })
}

export async function reorderStages(
  ctx: AuthorizationContext,
  pipelineId: string,
  input: ReorderStagesInput,
) {
  await getPipeline(ctx, pipelineId)

  const stages = await prisma.pipelineStage.findMany({
    where: { pipelineId, organizationId: ctx.organization.id },
  })

  const stageIdSet = new Set(stages.map((s) => s.id))
  if (input.stageIds.length !== stages.length || !input.stageIds.every((id) => stageIdSet.has(id))) {
    throw notFoundError()
  }

  await prisma.$transaction(
    input.stageIds.map((id, position) =>
      prisma.pipelineStage.update({
        where: { id },
        data: { position },
      }),
    ),
  )

  return prisma.pipelineStage.findMany({
    where: { pipelineId, organizationId: ctx.organization.id },
    orderBy: { position: 'asc' },
  })
}
