import { prisma } from '@/lib/db'
import { getBootstrapConfig } from '@/config/env'
import { normalizeEmail } from '@/modules/auth/domain/email'
import { hashPassword } from '@/modules/auth/infrastructure/password'
import { slugifyOrganizationName, resolveUniqueSlug } from '@/modules/organization/domain/slug'
import { logger } from '@/lib/logger'

export type BootstrapResult = {
  created: boolean
  organizationId: string
  userId: string
  message: string
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
      include: { organization: true },
    })

    return {
      created: false,
      organizationId: membership?.organizationId ?? '',
      userId: existingUser.id,
      message: 'Bootstrap skipped — user already exists',
    }
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

    await tx.organizationMembership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        status: 'ACTIVE',
      },
    })

    return { organization, user }
  })

  logger.info('Bootstrap completed', {
    organizationId: result.organization.id,
    userId: result.user.id,
  })

  return {
    created: true,
    organizationId: result.organization.id,
    userId: result.user.id,
    message: 'Bootstrap completed',
  }
}
