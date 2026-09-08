import { afterEach, beforeEach, describe, expect, it } from 'vitest'
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

describe('privilege escalation', () => {
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

  it('PARCEIRO cannot assign ADMIN role to self', async () => {
    const { org } = await createOrganizationWithRbac('Org Esc', `org-esc-${Date.now()}`)
    const { user, membership } = await createUserWithMembership(
      org.id,
      `parceiro-esc-${Date.now()}@test.local`,
      'Parceiro',
      ROLE_SLUGS.PARCEIRO,
    )

    const adminRole = await prisma.role.findFirst({
      where: { organizationId: org.id, slug: ROLE_SLUGS.ADMIN },
    })

    const { token } = await createSession(user.id, org.id)
    const res = await assignRolePost(
      new Request(`http://localhost/api/organizations/memberships/${membership.id}/roles`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: adminRole!.id }),
      }),
      { params: Promise.resolve({ membershipId: membership.id }) },
    )

    expect(res.status).toBe(403)
  })

  it('GESTOR cannot assign ADMIN role', async () => {
    const { org } = await createOrganizationWithRbac('Org Esc2', `org-esc2-${Date.now()}`)
    const { user, membership: gestorMembership } = await createUserWithMembership(
      org.id,
      `gestor-esc-${Date.now()}@test.local`,
      'Gestor',
      ROLE_SLUGS.GESTOR,
    )

    const { membership: targetMembership } = await createUserWithMembership(
      org.id,
      `target-${Date.now()}@test.local`,
      'Target',
    )

    const adminRole = await prisma.role.findFirst({
      where: { organizationId: org.id, slug: ROLE_SLUGS.ADMIN },
    })

    const { token } = await createSession(user.id, org.id)
    const res = await assignRolePost(
      new Request(`http://localhost/api/organizations/memberships/${targetMembership.id}/roles`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: adminRole!.id }),
      }),
      { params: Promise.resolve({ membershipId: targetMembership.id }) },
    )

    expect(res.status).toBe(403)
    expect(gestorMembership.id).toBeTruthy()
  })
})
