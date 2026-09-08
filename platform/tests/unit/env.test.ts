import { beforeEach, describe, expect, it } from 'vitest'
import { getEnv, resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'

describe('environment validation', () => {
  beforeEach(() => {
    resetEnvCache()
  })

  it('accepts valid configuration', () => {
    setTestEnv({
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      AUTH_SECRET: 'test-auth-secret-with-at-least-32-characters',
    })

    const env = getEnv()
    expect(env.DATABASE_URL).toContain('postgresql://')
    expect(env.AUTH_SECRET.length).toBeGreaterThanOrEqual(32)
  })

  it('rejects missing DATABASE_URL', () => {
    setTestEnv({ DATABASE_URL: undefined })
    expect(() => getEnv()).toThrow(/DATABASE_URL/)
  })

  it('rejects short AUTH_SECRET', () => {
    setTestEnv({
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      AUTH_SECRET: 'short',
    })
    expect(() => getEnv()).toThrow(/AUTH_SECRET/)
  })
})
