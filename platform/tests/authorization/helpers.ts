import { prisma } from '@/lib/db'
import { hashPassword } from '@/modules/auth/infrastructure/password'
import { seedRbacForOrganization, assignRoleToMembership } from '@/modules/authorization/infrastructure/rbac-seed'
import { normalizeEmail } from '@/modules/auth/domain/email'

const TEST_PASSWORD = 'TestPass123!'

export async function createOrganizationWithRbac(name: string, slug: string) {
  const org = await prisma.organization.create({
    data: { name, slug, status: 'ACTIVE' },
  })
  await seedRbacForOrganization(prisma, org.id)
  const roles = await prisma.role.findMany({ where: { organizationId: org.id } })
  return { org, roles }
}

export async function createUserWithMembership(
  orgId: string,
  email: string,
  name: string,
  roleSlug?: string,
) {
  const passwordHash = await hashPassword(TEST_PASSWORD)
  const user = await prisma.user.create({
    data: {
      email: normalizeEmail(email),
      name,
      passwordHash,
      status: 'ACTIVE',
    },
  })

  const membership = await prisma.organizationMembership.create({
    data: {
      userId: user.id,
      organizationId: orgId,
      status: 'ACTIVE',
    },
  })

  if (roleSlug) {
    const role = await prisma.role.findFirst({
      where: { organizationId: orgId, slug: roleSlug },
    })
    if (role) {
      await assignRoleToMembership(prisma, membership.id, role.id)
    }
  }

  return { user, membership }
}

export { cleanupAllFixtures as cleanupRbacFixtures } from '../helpers/db'

export { TEST_PASSWORD }
