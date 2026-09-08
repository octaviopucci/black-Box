import { describe, expect, it } from 'vitest'
import { createOpportunitySchema } from '@/modules/crm/schemas/create-opportunity.schema'
import { createPipelineSchema } from '@/modules/crm/schemas/create-pipeline.schema'
import { createStageSchema } from '@/modules/crm/schemas/create-stage.schema'
import { createCrmInteractionSchema } from '@/modules/crm/schemas/create-crm-interaction.schema'

describe('CRM schema validations', () => {
  it('requires opportunity title and valid probability', () => {
    expect(() =>
      createOpportunitySchema.parse({
        leadId: '00000000-0000-4000-8000-000000000001',
        title: '',
      }),
    ).toThrow()

    expect(
      createOpportunitySchema.parse({
        leadId: '00000000-0000-4000-8000-000000000001',
        title: '  Deal  ',
        probability: 50,
        amount: 0,
      }).title,
    ).toBe('  Deal  ')

    expect(() =>
      createOpportunitySchema.parse({
        leadId: '00000000-0000-4000-8000-000000000001',
        title: 'Deal',
        probability: 101,
      }),
    ).toThrow()
  })

  it('requires pipeline name', () => {
    expect(() => createPipelineSchema.parse({ name: '   ' })).toThrow()
    expect(createPipelineSchema.parse({ name: '  Comercial  ' }).name).toBe('Comercial')
  })

  it('requires stage name and position', () => {
    expect(() => createStageSchema.parse({ name: '', position: 0 })).toThrow()
    expect(createStageSchema.parse({ name: 'Novo', position: 0 }).name).toBe('Novo')
  })

  it('requires interaction type and description', () => {
    expect(() =>
      createCrmInteractionSchema.parse({ type: 'NOTE', description: '' }),
    ).toThrow()
    expect(
      createCrmInteractionSchema.parse({ type: 'CALL', description: '  Follow-up  ' }).description,
    ).toBe('  Follow-up  ')
  })
})
