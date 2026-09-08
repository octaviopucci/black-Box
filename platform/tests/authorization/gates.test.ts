import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/db'
import { createSession } from '@/modules/auth/infrastructure/session-repository'
import {
  hasPermission,
  requirePermission,
  hasRole,
  PERMISSIONS,
  clearAuthorizationCacheForTests,
} from '@/lib/authorization'
import { ROLE_SLUGS } from '@/lib/authorization/roles'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'
import {
  cleanupRbacFixtures,
  createOrganizationWithRbac,
  createUserWithMembership,
} from './helpers'

function requestWithSession(token: string): Request {
  return new Request('http://localhost/api/test', {
    headers: { cookie: `bb_session=${token}` },
  })
}

async function loginAs(userId: string, orgId: string) {
  const { token } = await createSession(userId, orgId)
  return requestWithSession(token)
}

describe('authorization gates', () => {
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

  it('ADMIN has all catalog permissions', async () => {
    const { org } = await createOrganizationWithRbac('Org Admin', `org-admin-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `admin-${Date.now()}@test.local`,
      'Admin User',
      ROLE_SLUGS.ADMIN,
    )

    const req = await loginAs(user.id, org.id)
    expect(await hasPermission(PERMISSIONS.AUTHORIZATION_ROLE_READ, req)).toBe(true)
    expect(await hasPermission(PERMISSIONS.LEAD_CREATE, req)).toBe(true)
    await expect(requirePermission(PERMISSIONS.AUTHORIZATION_ROLE_READ, req)).resolves.toBeUndefined()
  })

  it('GESTOR has explicit permissions only', async () => {
    const { org } = await createOrganizationWithRbac('Org Gestor', `org-gestor-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `gestor-${Date.now()}@test.local`,
      'Gestor User',
      ROLE_SLUGS.GESTOR,
    )

    const req = await loginAs(user.id, org.id)
    expect(await hasPermission(PERMISSIONS.LEAD_CREATE, req)).toBe(true)
    expect(await hasPermission(PERMISSIONS.AUTHORIZATION_ROLE_READ, req)).toBe(false)
  })

  it('PARCEIRO lacks administrative permissions', async () => {
    const { org } = await createOrganizationWithRbac('Org Parceiro', `org-parceiro-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `parceiro-${Date.now()}@test.local`,
      'Parceiro User',
      ROLE_SLUGS.PARCEIRO,
    )

    const req = await loginAs(user.id, org.id)
    expect(await hasPermission(PERMISSIONS.LEAD_CREATE, req)).toBe(true)
    expect(await hasPermission(PERMISSIONS.AUTHORIZATION_ROLE_READ, req)).toBe(false)
    await expect(requirePermission(PERMISSIONS.AUTHORIZATION_ROLE_READ, req)).rejects.toMatchObject({
      status: 403,
    })
  })

  it('returns false without session', async () => {
    const req = new Request('http://localhost/api/test')
    expect(await hasPermission(PERMISSIONS.LEAD_READ, req)).toBe(false)
    await expect(requirePermission(PERMISSIONS.LEAD_READ, req)).rejects.toMatchObject({
      status: 401,
    })
  })

  it('inactive role grants no permissions', async () => {
    const { org } = await createOrganizationWithRbac('Org Inactive', `org-inactive-${Date.now()}`)
    const { user, membership } = await createUserWithMembership(
      org.id,
      `inactive-role-${Date.now()}@test.local`,
      'Inactive Role User',
      ROLE_SLUGS.ADMIN,
    )

    const role = await prisma.role.findFirst({
      where: { organizationId: org.id, slug: ROLE_SLUGS.ADMIN },
    })
    await prisma.role.update({ where: { id: role!.id }, data: { status: 'INACTIVE' } })

    const req = await loginAs(user.id, org.id)
    expect(await hasPermission(PERMISSIONS.LEAD_READ, req)).toBe(false)
    expect(membership.id).toBeTruthy()
  })

  it('hasRole detects role slug', async () => {
    const { org } = await createOrganizationWithRbac('Org Role Check', `org-role-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `role-check-${Date.now()}@test.local`,
      'Role Check',
      ROLE_SLUGS.GESTOR,
    )

    const req = await loginAs(user.id, org.id)
    expect(await hasRole(ROLE_SLUGS.GESTOR, req)).toBe(true)
    expect(await hasRole(ROLE_SLUGS.ADMIN, req)).toBe(false)
  })
})
