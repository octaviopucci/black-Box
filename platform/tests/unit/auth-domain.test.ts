import { describe, expect, it } from 'vitest'
import { normalizeEmail, isValidEmail } from '@/modules/auth/domain/email'
import { slugifyOrganizationName, resolveUniqueSlug } from '@/modules/organization/domain/slug'

describe('email normalization', () => {
  it('lowercases and trims email', () => {
    expect(normalizeEmail('  User@Example.com ')).toBe('user@example.com')
  })

  it('validates email format', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('invalid')).toBe(false)
  })
})

describe('organization slug', () => {
  it('slugifies names', () => {
    expect(slugifyOrganizationName('Black Box Platform')).toBe('black-box-platform')
  })

  it('resolves slug collisions', () => {
    const existing = new Set(['black-box', 'black-box-2'])
    expect(resolveUniqueSlug('black-box', existing)).toBe('black-box-3')
  })
})
