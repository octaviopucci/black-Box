import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import { orgWhere } from '@/modules/crm/application/crm-repository'
import type { CreatePipelineInput } from '@/modules/crm/schemas/create-pipeline.schema'
import type { UpdatePipelineInput } from '@/modules/crm/schemas/update-pipeline.schema'

export async function createPipeline(ctx: AuthorizationContext, input: CreatePipelineInput) {
  if (input.isDefault) {
    await prisma.pipeline.updateMany({
      where: { organizationId: ctx.organization.id, isDefault: true },
      data: { isDefault: false },
    })
  }

  return prisma.pipeline.create({
    data: {
      organizationId: ctx.organization.id,
      name: input.name.trim(),
      description: input.description?.trim(),
      isDefault: input.isDefault ?? false,
      isActive: input.isActive ?? true,
    },
    include: { stages: { orderBy: { position: 'asc' } } },
  })
}

export async function listPipelines(ctx: AuthorizationContext) {
  return prisma.pipeline.findMany({
    where: orgWhere(ctx),
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    include: { stages: { orderBy: { position: 'asc' } } },
  })
}

export async function getPipeline(ctx: AuthorizationContext, id: string) {
  const pipeline = await prisma.pipeline.findFirst({
    where: { id, ...orgWhere(ctx) },
    include: { stages: { orderBy: { position: 'asc' } } },
  })
  if (!pipeline) throw (await import('@/lib/errors')).notFoundError()
  return pipeline
}

export async function updatePipeline(
  ctx: AuthorizationContext,
  id: string,
  input: UpdatePipelineInput,
) {
  await getPipeline(ctx, id)

  if (input.isDefault) {
    await prisma.pipeline.updateMany({
      where: { organizationId: ctx.organization.id, isDefault: true },
      data: { isDefault: false },
    })
  }

  return prisma.pipeline.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() ?? null } : {}),
      ...(input.isDefault !== undefined ? { isDefault: input.isDefault } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    },
    include: { stages: { orderBy: { position: 'asc' } } },
  })
}
