import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { runBootstrap } from '../database/bootstrap'
import { ensureDefaultPipelineForOrganization } from '@/modules/crm/infrastructure/crm-seed'

async function main() {
  await runBootstrap()

  const user = await prisma.user.findUnique({ where: { email: 'admin@blackbox.local' } })
  if (!user) throw new Error('Bootstrap user not found')

  const membership = await prisma.organizationMembership.findFirst({ where: { userId: user.id } })
  if (!membership) throw new Error('Membership not found')

  const orgId = membership.organizationId
  const { pipelineId, stages } = await ensureDefaultPipelineForOrganization(orgId)

  const leadData = [
    { name: 'Maria Silva', companyName: 'Acme Ltd', email: 'maria@acme.test', source: 'referral' },
    { name: 'João Santos', companyName: 'TechCorp', email: 'joao@tech.test', source: 'web' },
    { name: 'Ana Costa', companyName: 'StartupXYZ', email: 'ana@xyz.test', source: 'event' },
  ]

  const leads = []
  for (const l of leadData) {
    let lead = await prisma.lead.findFirst({
      where: { organizationId: orgId, email: l.email },
    })
    if (!lead) {
      lead = await prisma.lead.create({ data: { organizationId: orgId, ...l } })
    }
    leads.push(lead)
  }

  const opps = [
    { title: 'Acme — Plano Enterprise', leadIdx: 0, stageIdx: 2, amount: '45000', probability: 60 },
    { title: 'TechCorp — Integração API', leadIdx: 1, stageIdx: 3, amount: '28000', probability: 45 },
    { title: 'StartupXYZ — Piloto 90 dias', leadIdx: 2, stageIdx: 1, amount: '12000', probability: 30 },
    { title: 'Acme — Upsell Suporte', leadIdx: 0, stageIdx: 4, amount: '8500', probability: 75 },
  ]

  for (const o of opps) {
    const existing = await prisma.opportunity.findFirst({
      where: { organizationId: orgId, title: o.title },
    })
    if (existing) continue

    const stageId = stages[o.stageIdx]?.id ?? stages[0]!.id
    const opp = await prisma.opportunity.create({
      data: {
        organizationId: orgId,
        leadId: leads[o.leadIdx]!.id,
        pipelineId,
        stageId,
        title: o.title,
        amount: new Prisma.Decimal(o.amount),
        probability: o.probability,
        expectedCloseAt: new Date('2026-10-15'),
      },
    })

    await prisma.opportunityStageHistory.create({
      data: {
        organizationId: orgId,
        opportunityId: opp.id,
        fromStageId: null,
        toStageId: stageId,
        createdByUserId: user.id,
      },
    })
  }

  console.log('CRM demo data ready')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
