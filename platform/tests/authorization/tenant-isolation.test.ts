import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GET as listRolesGet } from '@/app/api/authorization/roles/route'
import { POST as assignRolePost } from '@/app/api/organizations/memberships/[membershipId]/roles/route'
import { createSession } from '@/modules/auth/infrastructure/session-repository'
import { clearAuthorizationCacheForTests } from '@/lib/authorization'
import { ROLE_SLUGS } from '@/lib/authorization/roles'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'
import {
  cleanupRbacFixtures,
  createOrganizationWithRbac,
  createUserWithMembership,
} from './helpers'
import { prisma } from '@/lib/db'

function cookieHeader(token: string) {
  return { cookie: `bb_session=${token}` }
}

async function sessionFor(userId: string, orgId: string) {
  const { token } = await createSession(userId, orgId)
  return token
}

describe('tenant isolation', () => {
  beforeEach(() => {
    resetEnvCache()
    clearAuthorizationCacheForTests()
    setTestEnv({
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://blackbox:blackbox@localhost:5432/blackbox_platform?schema=public',
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      AUTH_SECRET: 'test-auth-secret-with-at-least-32-characters',
    })
  })

  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupRbacFixtures()
  })

  it('user A cannot list roles as if in org B without membership', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A', `org-a-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B', `org-b-${Date.now()}`)

    const { user: userA } = await createUserWithMembership(
      orgA.id,
      `user-a-${Date.now()}@test.local`,
      'User A',
      ROLE_SLUGS.ADMIN,
    )

    // Session active org is B but user A has no membership in B
    const token = await sessionFor(userA.id, orgB.id)
    const res = await listRolesGet(
      new Request('http://localhost/api/authorization/roles', { headers: cookieHeader(token) }),
    )
    expect([401, 403, 404]).toContain(res.status)
  })

  it('user A cannot assign org B role to org A membership', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A2', `org-a2-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B2', `org-b2-${Date.now()}`)

    const { user: adminA, membership: membershipA } = await createUserWithMembership(
      orgA.id,
      `admin-a-${Date.now()}@test.local`,
      'Admin A',
      ROLE_SLUGS.ADMIN,
    )

    const roleB = await prisma.role.findFirst({
      where: { organizationId: orgB.id, slug: ROLE_SLUGS.PARCEIRO },
    })

    const token = await sessionFor(adminA.id, orgA.id)
    const res = await assignRolePost(
      new Request(`http://localhost/api/organizations/memberships/${membershipA.id}/roles`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: roleB!.id }),
      }),
      { params: Promise.resolve({ membershipId: membershipA.id }) },
    )

    expect(res.status).toBe(404)
  })
})
