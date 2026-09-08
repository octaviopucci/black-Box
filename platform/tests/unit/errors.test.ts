import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { AppError, mapUnknownError, toPublicErrorBody } from '@/lib/errors'

describe('validation foundation', () => {
  it('validates input with zod schema', () => {
    const schema = z.object({ ping: z.string().min(1) })
    const result = schema.safeParse({ ping: 'ok' })
    expect(result.success).toBe(true)
  })

  it('maps validation failures to structured details', () => {
    const schema = z.object({ ping: z.string().min(1) })
    const result = schema.safeParse({ ping: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.ping).toBeDefined()
    }
  })
})

describe('error mapping', () => {
  it('maps AppError to public body without secrets', () => {
    const error = new AppError({
      code: 'VALIDATION_ERROR',
      message: 'Invalid request',
      status: 400,
      details: { field: 'email' },
    })

    expect(toPublicErrorBody(error)).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request',
        details: { field: 'email' },
      },
    })
  })

  it('wraps unknown errors as internal', () => {
    const mapped = mapUnknownError(new Error('db secret postgresql://user:pass@host/db'))
    expect(mapped.code).toBe('INTERNAL_ERROR')
    expect(mapped.status).toBe(500)
    expect(mapped.expose).toBe(false)
  })
})
