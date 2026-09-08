import { afterEach, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/db'
import { runBootstrap } from '../../database/bootstrap'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'
import { cleanupAllFixtures } from '../helpers/db'

describe('bootstrap', () => {
  afterEach(async () => {
    await cleanupAllFixtures()
  })

  it('is idempotent', async () => {
    resetEnvCache()
    setTestEnv({
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://blackbox:blackbox@localhost:5432/blackbox_platform?schema=public',
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      AUTH_SECRET: 'test-auth-secret-with-at-least-32-characters',
      BOOTSTRAP_ORG_NAME: 'Bootstrap Org',
      BOOTSTRAP_ORG_SLUG: 'bootstrap-org',
      BOOTSTRAP_USER_NAME: 'Bootstrap User',
      BOOTSTRAP_USER_EMAIL: 'bootstrap@test.local',
      BOOTSTRAP_USER_PASSWORD: 'Bootstrap123!',
    })

    const first = await runBootstrap()
    const second = await runBootstrap()

    expect(first.created).toBe(true)
    expect(second.created).toBe(false)

    const users = await prisma.user.findMany({ where: { email: 'bootstrap@test.local' } })
    expect(users).toHaveLength(1)
  })
})
