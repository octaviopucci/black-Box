import { describe, expect, it, beforeEach } from 'vitest'
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
    })

    const env = getEnv()
    expect(env.DATABASE_URL).toContain('postgresql://')
    expect(env.NODE_ENV).toBe('test')
  })

  it('rejects missing DATABASE_URL', () => {
    setTestEnv({ DATABASE_URL: undefined })
    expect(() => getEnv()).toThrow(/DATABASE_URL/)
  })
})
