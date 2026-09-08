import { describe, expect, it } from 'vitest'
import { createProductSchema } from '@/modules/products/schemas/product.schema'
import { createOfferSchema } from '@/modules/products/schemas/offer.schema'

describe('products schema validations', () => {
  it('validates product name and status', () => {
    expect(() => createProductSchema.parse({ name: '' })).toThrow()
    expect(createProductSchema.parse({ name: '  Website  ' }).name).toBe('Website')
  })

  it('validates offer price and currency', () => {
    expect(() => createOfferSchema.parse({ name: 'Plan', price: -1 })).toThrow()
    expect(createOfferSchema.parse({ name: 'Plan', price: 0 }).price).toBe(0)
    expect(createOfferSchema.parse({ name: 'Plan', price: 99.9, currency: 'BRL' }).currency).toBe('BRL')
  })
})
