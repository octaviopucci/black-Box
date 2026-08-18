import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import type { Vehicle } from '@/types'
import { Input, Select, Textarea, Checkbox } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PhotoGallery } from '@/components/vehicles/PhotoGallery'
import {
  BRAZIL_STATES,
  CATEGORIES,
  FUEL_LABELS,
  ORIGINS,
  PAYMENT_LABELS,
  STATUS_FLOW,
  STATUS_LABELS,
  TRANSMISSION_LABELS,
} from '@/utils/constants'
import { maskPhone, maskPlate } from '@/utils'
import type { VehicleInput } from '@/services/vehicles'

function toNumber(val: unknown): number | undefined {
  if (val === '' || val === null || val === undefined) return undefined
  if (typeof val === 'number') return Number.isFinite(val) ? val : undefined
  const n = Number(String(val).trim().replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}

function numberField(message: string, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return z.preprocess(
    toNumber,
    z.number({ required_error: message, invalid_type_error: message }).min(min, message).max(max, message),
  )
}

const schema = z.object({
  marca: z.string().trim().min(1, 'Obrigatório'),
  modelo: z.string().trim().min(1, 'Obrigatório'),
  versao: z.string(),
  ano: numberField('Informe um ano válido', 1950, 2100),
  anoModelo: numberField('Informe um ano válido', 1950, 2100),
  categoria: z.string().min(1, 'Obrigatório'),
  cor: z.string().trim().min(1, 'Obrigatório'),
  placa: z.string(),
  renavam: z.string(),
  chassi: z.string(),
  motor: z.string(),
  portas: numberField('Informe', 0, 6).optional(),
  combustivel: z.enum(['flex', 'gasolina', 'etanol', 'diesel', 'eletrico', 'hibrido', 'gnv']),
  cambio: z.enum(['manual', 'automatico', 'cvt', 'automatizado']),
  quilometragem: numberField('Informe a quilometragem', 0),
  cidade: z.string().trim().min(1, 'Obrigatório'),
  estado: z.string().min(2, 'Obrigatório').max(2),
  fornecedor: z.string(),
  telefoneFornecedor: z.string(),
  origem: z.string(),
  cpfCnpjOrigem: z.string(),
  localCompra: z.string(),
  formaPagamentoCompra: z.enum(['pix', 'ted', 'dinheiro', 'financiamento', 'consorcio', 'cartao', 'boleto', 'cheque', '']),
  entradaCompra: numberField('Informe', 0).optional(),
  financiamentoCompra: numberField('Informe', 0).optional(),
  observacoesCompra: z.string(),
  precoFipe: numberField('Informe o valor', 0),
  valorCompra: numberField('Informe o valor de compra', 0),
  precoAnunciado: numberField('Informe o valor', 0),
  precoMinimo: numberField('Informe o valor', 0),
  observacoes: z.string(),
  dataCompra: z.string().min(1, 'Obrigatório'),
  status: z.enum([
    'negociacao', 'comprado', 'documentacao', 'preparacao', 'pronto', 'anunciado',
    'reservado', 'vendido', 'entregue', 'cancelado', 'disponivel', 'consignado', 'oficina', 'financiado',
  ]),
  consignado: z.boolean().default(false),
  vendedorResponsavel: z.string(),
  fotos: z.array(z.string()),
  fotoPrincipal: z.number(),
})

type FormValues = z.input<typeof schema>

interface VehicleFormProps {
  initial?: Vehicle
  onSubmit: (data: VehicleInput) => Promise<void>
  submitLabel?: string
  wizardStep?: number
  onStepData?: (data: Partial<VehicleInput>) => void
  extraActions?: ReactNode
}

const WIZARD_STEPS = ['identificacao', 'compra', 'documentacao', 'preparacao', 'comercial', 'fotos'] as const

export function VehicleForm({
  initial,
  onSubmit,
  submitLabel = 'Salvar veículo',
  wizardStep,
  onStepData,
  extraActions,
}: VehicleFormProps) {
  const isWizard = wizardStep !== undefined

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    shouldFocusError: true,
    defaultValues: initial
      ? { ...initial, portas: initial.portas || 4 }
      : {
          marca: '',
          modelo: '',
          versao: '',
          ano: new Date().getFullYear(),
          anoModelo: new Date().getFullYear(),
          categoria: 'Sedan',
          cor: '',
          placa: '',
          renavam: '',
          chassi: '',
          motor: '',
          portas: 4,
          combustivel: 'flex',
          cambio: 'automatico',
          quilometragem: 0,
          cidade: '',
          estado: 'SP',
          fornecedor: '',
          telefoneFornecedor: '',
          origem: 'Particular',
          cpfCnpjOrigem: '',
          localCompra: '',
          formaPagamentoCompra: '',
          entradaCompra: 0,
          financiamentoCompra: 0,
          observacoesCompra: '',
          precoFipe: 0,
          valorCompra: 0,
          precoAnunciado: 0,
          precoMinimo: 0,
          observacoes: '',
          dataCompra: new Date().toISOString().slice(0, 10),
          status: 'comprado',
          consignado: false,
          vendedorResponsavel: '',
          fotos: [],
          fotoPrincipal: 0,
        },
  })

  const fotos = watch('fotos') || []
  const fotoPrincipal = watch('fotoPrincipal') || 0
  const currentStepKey = isWizard ? WIZARD_STEPS[wizardStep] : null

  const show = (key: typeof WIZARD_STEPS[number]) => !isWizard || currentStepKey === key

  const handleStepBlur = () => {
    if (onStepData) onStepData(getValues() as Partial<VehicleInput>)
  }

  return (
    <form
      className="space-y-6"
      onBlur={handleStepBlur}
      onSubmit={handleSubmit(
        async (values) => {
          clearErrors('root')
          try {
            const parsed = schema.parse(values)
            await onSubmit({
              ...parsed,
              portas: parsed.portas || 4,
              placa: String(parsed.placa || '').toUpperCase(),
              consignado: parsed.status === 'consignado' || Boolean(parsed.consignado),
              codigoInterno: initial?.codigoInterno || '',
              draft: initial?.draft || false,
            } as VehicleInput)
          } catch (e) {
            const message = e instanceof Error ? e.message : 'Não foi possível salvar.'
            setError('root', { message })
            throw e
          }
        },
        () => {},
      )}
    >
      {show('identificacao') ? (
        <section className="panel space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Identificação</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Marca *" {...register('marca')} error={errors.marca?.message} />
            <Input label="Modelo *" {...register('modelo')} error={errors.modelo?.message} />
            <Input label="Versão" {...register('versao')} />
            <Input label="Ano *" type="number" {...register('ano')} error={errors.ano?.message as string} />
            <Input label="Ano modelo *" type="number" {...register('anoModelo')} error={errors.anoModelo?.message as string} />
            <Select label="Categoria *" {...register('categoria')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
            <Input label="Cor *" {...register('cor')} error={errors.cor?.message} />
            <Input
              label="Placa"
              {...register('placa')}
              value={watch('placa') || ''}
              onChange={(e) => setValue('placa', maskPlate(e.target.value), { shouldDirty: true })}
            />
            <Input label="Renavam" {...register('renavam')} />
            <Input label="Chassi" {...register('chassi')} />
            <Input label="Motor" {...register('motor')} />
            <Select label="Combustível *" {...register('combustivel')}>
              {Object.entries(FUEL_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
            <Select label="Câmbio *" {...register('cambio')}>
              {Object.entries(TRANSMISSION_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
            <Input label="Quilometragem *" type="number" {...register('quilometragem')} />
            <Input label="Portas" type="number" {...register('portas')} />
          </div>
        </section>
      ) : null}

      {show('compra') ? (
        <section className="panel space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Compra</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Cidade *" {...register('cidade')} error={errors.cidade?.message} />
            <Select label="Estado *" {...register('estado')}>
              {BRAZIL_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Select label="Origem" {...register('origem')}>
              {ORIGINS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </Select>
            <Input label="Fornecedor" {...register('fornecedor')} />
            <Input
              label="Telefone fornecedor"
              value={watch('telefoneFornecedor') || ''}
              onChange={(e) => setValue('telefoneFornecedor', maskPhone(e.target.value))}
            />
            <Input label="CPF/CNPJ origem" {...register('cpfCnpjOrigem')} />
            <Input label="Local da compra" {...register('localCompra')} />
            <Input label="Data da compra *" type="date" {...register('dataCompra')} />
            <Select label="Forma pagamento compra" {...register('formaPagamentoCompra')}>
              <option value="">—</option>
              {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
            <Input label="Entrada compra" type="number" step="0.01" {...register('entradaCompra')} />
            <Input label="Financiamento compra" type="number" step="0.01" {...register('financiamentoCompra')} />
            <Input label="Valor de compra *" type="number" step="0.01" {...register('valorCompra')} />
          </div>
          <Textarea label="Observações da compra" {...register('observacoesCompra')} />
        </section>
      ) : null}

      {show('documentacao') ? (
        <section className="panel space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Documentação</h3>
          <p className="text-sm text-lp-steel">
            Após salvar o veículo, anexe CRLV, notas e comprovantes na aba Documentos do dossiê.
          </p>
          <Select label="Status no fluxo" {...register('status')}>
            {STATUS_FLOW.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </Select>
        </section>
      ) : null}

      {show('preparacao') ? (
        <section className="panel space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Preparação</h3>
          <p className="text-sm text-lp-steel">
            O checklist de preparação será criado automaticamente. Gerencie em Preparação ou no dossiê do veículo.
          </p>
          <Select label="Status" {...register('status')}>
            <option value="preparacao">{STATUS_LABELS.preparacao}</option>
            <option value="pronto">{STATUS_LABELS.pronto}</option>
            <option value="anunciado">{STATUS_LABELS.anunciado}</option>
          </Select>
        </section>
      ) : null}

      {show('comercial') ? (
        <section className="panel space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Comercial</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Input label="Preço FIPE" type="number" step="0.01" {...register('precoFipe')} />
            <Input label="Preço anunciado" type="number" step="0.01" {...register('precoAnunciado')} />
            <Input label="Preço mínimo" type="number" step="0.01" {...register('precoMinimo')} />
            <Input label="Vendedor responsável" {...register('vendedorResponsavel')} />
          </div>
          <div className="flex items-center gap-4">
            <Checkbox label="Consignado" {...register('consignado')} />
          </div>
          <Textarea label="Observações gerais" {...register('observacoes')} />
        </section>
      ) : null}

      {show('fotos') ? (
        <section className="panel space-y-4 p-5">
          <h3 className="font-display text-lg font-semibold">Fotos (até 15)</h3>
          <PhotoGallery
            photos={fotos}
            mainIndex={fotoPrincipal}
            onChange={(photos, main) => {
              setValue('fotos', photos, { shouldDirty: true })
              setValue('fotoPrincipal', main, { shouldDirty: true })
            }}
          />
        </section>
      ) : null}

      {errors.root ? (
        <div className="rounded-xl border border-lp-danger/30 bg-red-50 px-4 py-3 text-sm text-lp-danger">
          {errors.root.message as string}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        {extraActions}
        {!isWizard || wizardStep === WIZARD_STEPS.length - 1 ? (
          <Button type="submit" loading={isSubmitting} size="lg" className="ml-auto">
            {submitLabel}
          </Button>
        ) : null}
      </div>
    </form>
  )
}
