import { describe, expect, it } from 'vitest'
import { PERMISSIONS, ALL_PERMISSION_DEFINITIONS } from '@/lib/authorization/permissions'

describe('permission catalog', () => {
  it('has unique keys in definitions', () => {
    const keys = ALL_PERMISSION_DEFINITIONS.map((d) => d.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('constants match definition keys', () => {
    const constantValues = Object.values(PERMISSIONS)
    const definitionKeys = ALL_PERMISSION_DEFINITIONS.map((d) => d.key)
    for (const value of constantValues) {
      expect(definitionKeys).toContain(value)
    }
  })
})
