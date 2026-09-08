import { prisma } from '@/lib/db'
import { getBootstrapConfig } from '@/config/env'
import { normalizeEmail } from '@/modules/auth/domain/email'
import { hashPassword } from '@/modules/auth/infrastructure/password'
import { slugifyOrganizationName, resolveUniqueSlug } from '@/modules/organization/domain/slug'
import { seedRbacForOrganization } from '@/modules/authorization/infrastructure/rbac-seed'
import { logger } from '@/lib/logger'

export type BootstrapResult = {
  created: boolean
  organizationId: string
  userId: string
  membershipId: string
  message: string
}

async function ensureRbacForExistingUser(
  userId: string,
  organizationId: string,
  membershipId: string,
): Promise<BootstrapResult> {
  await seedRbacForOrganization(prisma, organizationId, membershipId)

  return {
    created: false,
    organizationId,
    userId,
    membershipId,
    message: 'Bootstrap skipped — user exists; RBAC seed ensured',
  }
}

export async function runBootstrap(): Promise<BootstrapResult> {
  const config = getBootstrapConfig()
  if (!config) {
    throw new Error(
      'Bootstrap config incomplete. Set BOOTSTRAP_ORG_NAME, BOOTSTRAP_ORG_SLUG, BOOTSTRAP_USER_NAME, BOOTSTRAP_USER_EMAIL, BOOTSTRAP_USER_PASSWORD in .env',
    )
  }

  const email = normalizeEmail(config.userEmail)

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    const membership = await prisma.organizationMembership.findFirst({
      where: { userId: existingUser.id },
    })

    if (!membership) {
      throw new Error('Bootstrap user exists but has no membership')
    }

    return ensureRbacForExistingUser(existingUser.id, membership.organizationId, membership.id)
  }

  const slugBase = slugifyOrganizationName(config.orgSlug || config.orgName)
  const existingSlugs = new Set(
    (await prisma.organization.findMany({ select: { slug: true } })).map((o) => o.slug),
  )
  const slug = resolveUniqueSlug(slugBase, existingSlugs)
  const passwordHash = await hashPassword(config.userPassword)

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: config.orgName,
        slug,
        status: 'ACTIVE',
      },
    })

    const user = await tx.user.create({
      data: {
        email,
        name: config.userName,
        passwordHash,
        status: 'ACTIVE',
      },
    })

    const membership = await tx.organizationMembership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        status: 'ACTIVE',
      },
    })

    return { organization, user, membership }
  })

  await seedRbacForOrganization(prisma, result.organization.id, result.membership.id)

  logger.info('Bootstrap completed', {
    organizationId: result.organization.id,
    userId: result.user.id,
  })

  return {
    created: true,
    organizationId: result.organization.id,
    userId: result.user.id,
    membershipId: result.membership.id,
    message: 'Bootstrap completed',
  }
}
