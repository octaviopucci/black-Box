import { prisma } from '@/lib/db'

const DEFAULT_STAGES = [
  'Novo',
  'Contato',
  'Qualificação',
  'Proposta',
  'Negociação',
  'Fechamento',
]

export async function ensureDefaultPipelineForOrganization(
  organizationId: string,
): Promise<{ pipelineId: string; stages: Array<{ id: string; name: string; position: number }> }> {
  const existing = await prisma.pipeline.findFirst({
    where: { organizationId, isDefault: true },
    include: { stages: { orderBy: { position: 'asc' } } },
  })

  if (existing && existing.stages.length > 0) {
    return {
      pipelineId: existing.id,
      stages: existing.stages.map((s) => ({ id: s.id, name: s.name, position: s.position })),
    }
  }

  const pipeline = await prisma.pipeline.create({
    data: {
      organizationId,
      name: 'Pipeline Comercial',
      description: 'Pipeline padrão da organização',
      isDefault: true,
      stages: {
        create: DEFAULT_STAGES.map((name, index) => ({
          organizationId,
          name,
          position: index,
        })),
      },
    },
    include: { stages: { orderBy: { position: 'asc' } } },
  })

  return {
    pipelineId: pipeline.id,
    stages: pipeline.stages.map((s) => ({ id: s.id, name: s.name, position: s.position })),
  }
}
