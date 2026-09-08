import { afterEach, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/db'
import { runBootstrap } from '../../database/bootstrap'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'
import { ROLE_SLUGS } from '@/lib/authorization/roles'
import { cleanupAllFixtures } from '../helpers/db'

describe('bootstrap RBAC', () => {
  afterEach(async () => {
    await cleanupAllFixtures()
  })

  it('seeds roles and assigns ADMIN idempotently', async () => {
    resetEnvCache()
    setTestEnv({
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://blackbox:blackbox@localhost:5432/blackbox_platform?schema=public',
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      AUTH_SECRET: 'test-auth-secret-with-at-least-32-characters',
      BOOTSTRAP_ORG_NAME: 'RBAC Bootstrap Org',
      BOOTSTRAP_ORG_SLUG: 'rbac-bootstrap',
      BOOTSTRAP_USER_NAME: 'Bootstrap Admin',
      BOOTSTRAP_USER_EMAIL: 'rbac-bootstrap@test.local',
      BOOTSTRAP_USER_PASSWORD: 'Bootstrap123!',
    })

    const first = await runBootstrap()
    const second = await runBootstrap()

    expect(first.created).toBe(true)
    expect(second.created).toBe(false)

    const roles = await prisma.role.findMany({ where: { organizationId: first.organizationId } })
    expect(roles.map((r) => r.slug).sort()).toEqual(
      [ROLE_SLUGS.ADMIN, ROLE_SLUGS.GESTOR, ROLE_SLUGS.PARCEIRO].sort(),
    )

    const permissions = await prisma.permission.count()
    expect(permissions).toBeGreaterThan(0)

    const adminRole = roles.find((r) => r.slug === ROLE_SLUGS.ADMIN)!
    const membershipRoles = await prisma.membershipRole.findMany({
      where: { membershipId: first.membershipId, roleId: adminRole.id },
    })
    expect(membershipRoles).toHaveLength(1)

    const rolesAfterSecond = await prisma.role.count({
      where: { organizationId: first.organizationId },
    })
    expect(rolesAfterSecond).toBe(3)
  })
})
