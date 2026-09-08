import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/modules/auth/infrastructure/password'
import { normalizeEmail } from '@/modules/auth/domain/email'
import { POST as loginPost } from '@/app/api/auth/login/route'
import { POST as logoutPost } from '@/app/api/auth/logout/route'
import { GET as meGet } from '@/app/api/auth/me/route'
import { POST as selectOrgPost } from '@/app/api/organizations/select/route'
import { clearRateLimitsForTests } from '@/modules/auth/infrastructure/rate-limit'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'

const TEST_PASSWORD = 'TestPass123!'

async function createTestFixtures() {
  const orgA = await prisma.organization.create({
    data: { name: 'Org A', slug: `org-a-${Date.now()}`, status: 'ACTIVE' },
  })
  const orgB = await prisma.organization.create({
    data: { name: 'Org B', slug: `org-b-${Date.now()}`, status: 'ACTIVE' },
  })

  const passwordHash = await hashPassword(TEST_PASSWORD)
  const userA = await prisma.user.create({
    data: {
      email: `user-a-${Date.now()}@test.local`,
      name: 'User A',
      passwordHash,
      status: 'ACTIVE',
    },
  })
  const userB = await prisma.user.create({
    data: {
      email: `user-b-${Date.now()}@test.local`,
      name: 'User B',
      passwordHash,
      status: 'ACTIVE',
    },
  })

  await prisma.organizationMembership.create({
    data: { userId: userA.id, organizationId: orgA.id, status: 'ACTIVE' },
  })
  await prisma.organizationMembership.create({
    data: { userId: userB.id, organizationId: orgB.id, status: 'ACTIVE' },
  })

  return { orgA, orgB, userA, userB }
}

function extractSessionCookie(response: Response): string | undefined {
  const setCookie = response.headers.get('set-cookie')
  if (!setCookie) return undefined
  const match = setCookie.match(/bb_session=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : undefined
}

describe('auth integration', () => {
  beforeEach(() => {
    resetEnvCache()
    clearRateLimitsForTests()
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
    const { cleanupAllFixtures } = await import('../helpers/db')
    await cleanupAllFixtures()
  })

  it('logs in with valid credentials and returns session cookie', async () => {
    const { userA } = await createTestFixtures()

    const response = await loginPost(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userA.email, password: TEST_PASSWORD }),
      }),
    )

    expect(response.status).toBe(200)
    expect(extractSessionCookie(response)).toBeTruthy()
  })

  it('uses generic error for invalid credentials', async () => {
    const { userA } = await createTestFixtures()

    const response = await loginPost(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userA.email, password: 'WrongPass123!' }),
      }),
    )

    const body = await response.json()
    expect(response.status).toBe(401)
    expect(body.error.code).toBe('INVALID_CREDENTIALS')
    expect(body.error.message).toBe('Invalid credentials')
  })

  it('rejects unknown email with same invalid credentials message', async () => {
    const response = await loginPost(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'unknown@test.local', password: TEST_PASSWORD }),
      }),
    )

    const body = await response.json()
    expect(response.status).toBe(401)
    expect(body.error.message).toBe('Invalid credentials')
  })

  it('rejects inactive users', async () => {
    const passwordHash = await hashPassword(TEST_PASSWORD)
    const inactive = await prisma.user.create({
      data: {
        email: `inactive-${Date.now()}@test.local`,
        name: 'Inactive',
        passwordHash,
        status: 'INACTIVE',
      },
    })

    const response = await loginPost(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inactive.email, password: TEST_PASSWORD }),
      }),
    )

    expect(response.status).toBe(403)
  })

  it('returns current user and organization from session', async () => {
    const { userA, orgA } = await createTestFixtures()

    const loginResponse = await loginPost(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userA.email, password: TEST_PASSWORD }),
      }),
    )
    const cookie = extractSessionCookie(loginResponse)

    const meResponse = await meGet(
      new Request('http://localhost/api/auth/me', {
        headers: { cookie: `bb_session=${cookie}` },
      }),
    )

    const body = await meResponse.json()
    expect(meResponse.status).toBe(200)
    expect(body.user.email).toBe(normalizeEmail(userA.email))
    expect(body.organization.id).toBe(orgA.id)
    expect(body.user.passwordHash).toBeUndefined()
  })

  it('invalidates session on logout', async () => {
    const { userA } = await createTestFixtures()

    const loginResponse = await loginPost(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userA.email, password: TEST_PASSWORD }),
      }),
    )
    const cookie = extractSessionCookie(loginResponse)

    await logoutPost(
      new Request('http://localhost/api/auth/logout', {
        method: 'POST',
        headers: { cookie: `bb_session=${cookie}` },
      }),
    )

    const meResponse = await meGet(
      new Request('http://localhost/api/auth/me', {
        headers: { cookie: `bb_session=${cookie}` },
      }),
    )

    expect(meResponse.status).toBe(401)
  })

  it('denies organization selection for non-member', async () => {
    const { userA, orgB } = await createTestFixtures()

    const loginResponse = await loginPost(
      new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userA.email, password: TEST_PASSWORD }),
      }),
    )
    const cookie = extractSessionCookie(loginResponse)

    const selectResponse = await selectOrgPost(
      new Request('http://localhost/api/organizations/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: `bb_session=${cookie}`,
        },
        body: JSON.stringify({ organizationId: orgB.id }),
      }),
    )

    expect(selectResponse.status).toBe(403)
  })
})
