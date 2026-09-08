import { describe, expect, it, beforeEach } from 'vitest'
import { GET } from '@/app/api/health/route'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'

describe('GET /api/health', () => {
  beforeEach(() => {
    resetEnvCache()
  })

  it('returns health payload when env and database are available', async () => {
    setTestEnv({
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgresql://blackbox:blackbox@localhost:5432/blackbox_platform?schema=public',
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      AUTH_SECRET: 'test-auth-secret-with-at-least-32-characters',
    })

    const response = await GET(new Request('http://localhost/api/health'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.service).toBe('blackbox-platform')
    expect(body.checks.application).toBe(true)
    expect(typeof body.checks.database).toBe('boolean')
  })
})
