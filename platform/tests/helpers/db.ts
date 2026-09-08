import { prisma } from '@/lib/db'

/** Deletes all test fixtures in FK-safe order (Mission 01–08). */
export async function cleanupAllFixtures(): Promise<void> {
  await prisma.membershipRole.deleteMany()
  await prisma.rolePermission.deleteMany()
  await prisma.role.deleteMany()
  await prisma.permission.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.product.deleteMany()
  await prisma.crmInteraction.deleteMany()
  await prisma.opportunityStageHistory.deleteMany()
  await prisma.opportunity.deleteMany()
  await prisma.pipelineStage.deleteMany()
  await prisma.pipeline.deleteMany()
  await prisma.leadInteraction.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.session.deleteMany()
  await prisma.organizationMembership.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()
}
