import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Vehicle } from '@/types'
import { Input, Select, Textarea, Checkbox } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PhotoGallery } from '@/components/vehicles/PhotoGallery'
import {
  BRAZIL_STATES,
  CATEGORIES,
  FUEL_LABELS,
  ORIGINS,
  STATUS_LABELS,
  TRANSMISSION_LABELS,
} from '@/utils/constants'
import { maskPhone, maskPlate } from '@/utils'
import type { VehicleInput } from '@/services/vehicles'

/** Converte valor de input (string/number/vazio) sem gerar NaN no Zod. */
function toNumber(val: unknown): number | undefined {
  if (val === '' || val === null || val === undefined) return undefined
  if (typeof val === 'number') return Number.isFinite(val) ? val : undefined
  const n = Number(String(val).trim().replace(',', '.'))
  return Number.isFinite(n) ? n : undefined
}

function numberField(message: string, min = 0, max = Number.MAX_SAFE_INTEGER) {
  return z.preprocess(
    toNumber,
    z
      .number({ required_error: message, invalid_type_error: message })
      .min(min, message)
      .max(max, message),
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
  combustivel: z.enum(['flex', 'gasolina', 'etanol', 'diesel', 'eletrico', 'hibrido', 'gnv']),
  cambio: z.enum(['manual', 'automatico', 'cvt', 'automatizado']),
  quilometragem: numberField('Informe a quilometragem', 0),
  cidade: z.string().trim().min(1, 'Obrigatório'),
  estado: z.string().min(2, 'Obrigatório').max(2),
  fornecedor: z.string(),
  telefoneFornecedor: z.string(),
  origem: z.string(),
  precoFipe: numberField('Informe o valor', 0),
  valorCompra: numberField('Informe o valor de compra', 0),
  precoAnunciado: numberField('Informe o valor', 0),
  precoMinimo: numberField('Informe o valor', 0),
  observacoes: z.string(),
  dataCompra: z.string().min(1, 'Obrigatório'),
  status: z.enum([
    'disponivel',
    'reservado',
    'consignado',
    'vendido',
    'oficina',
    'preparacao',
    'documentacao',
    'financiado',
    'entregue',
  ]),
  consignado: z.boolean().default(false),
  fotos: z.array(z.string()),
  fotoPrincipal: z.number(),
})

type FormValues = z.input<typeof schema>

interface VehicleFormProps {
  initial?: Vehicle
  onSubmit: (data: VehicleInput) => Promise<void>
  submitLabel?: string
}

export function VehicleForm({ initial, onSubmit, submitLabel = 'Salvar veículo' }: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    shouldFocusError: true,
    defaultValues: initial
      ? {
          ...initial,
        }
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
          combustivel: 'flex',
          cambio: 'automatico',
          quilometragem: 0,
          cidade: '',
          estado: 'SP',
          fornecedor: '',
          telefoneFornecedor: '',
          origem: 'Particular',
          precoFipe: 0,
          valorCompra: 0,
          precoAnunciado: 0,
          precoMinimo: 0,
          observacoes: '',
          dataCompra: new Date().toISOString().slice(0, 10),
          status: 'disponivel',
          consignado: false,
          fotos: [],
          fotoPrincipal: 0,
        },
  })

  const fotos = watch('fotos') || []
  const fotoPrincipal = watch('fotoPrincipal') || 0
  const hasFieldErrors = Object.keys(errors).some((k) => k !== 'root')

  const scrollToFirstError = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector('[data-field-error="true"]')
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(
        async (values) => {
          clearErrors('root')
          try {
            const parsed = schema.parse(values)
            await onSubmit({
              ...parsed,
              placa: String(parsed.placa || '').toUpperCase(),
              consignado: parsed.status === 'consignado' || Boolean(parsed.consignado),
            })
          } catch (e) {
            const message =
              e instanceof Error ? e.message : 'Não foi possível salvar o veículo. Tente novamente.'
            setError('root', { message })
            throw e
          }
        },
        () => {
          scrollToFirstError()
        },
      )}
    >
      <section className="panel space-y-4 p-5">
        <h3 className="font-display text-lg font-semibold tracking-wide">Identificação</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div data-field-error={errors.marca ? 'true' : undefined}>
            <Input label="Marca *" {...register('marca')} error={errors.marca?.message} />
          </div>
          <div data-field-error={errors.modelo ? 'true' : undefined}>
            <Input label="Modelo *" {...register('modelo')} error={errors.modelo?.message} />
          </div>
          <Input label="Versão" {...register('versao')} />
          <div data-field-error={errors.ano ? 'true' : undefined}>
            <Input
              label="Ano *"
              type="number"
              inputMode="numeric"
              {...register('ano')}
              error={errors.ano?.message as string | undefined}
            />
          </div>
          <div data-field-error={errors.anoModelo ? 'true' : undefined}>
            <Input
              label="Ano modelo *"
              type="number"
              inputMode="numeric"
              {...register('anoModelo')}
              error={errors.anoModelo?.message as string | undefined}
            />
          </div>
          <Select label="Categoria *" {...register('categoria')} error={errors.categoria?.message}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <div data-field-error={errors.cor ? 'true' : undefined}>
            <Input label="Cor *" {...register('cor')} error={errors.cor?.message} />
          </div>
          <Input
            label="Placa"
            {...register('placa')}
            value={watch('placa') || ''}
            onChange={(e) =>
              setValue('placa', maskPlate(e.target.value), { shouldDirty: true, shouldValidate: true })
            }
          />
          <Input label="Renavam" {...register('renavam')} />
          <Input label="Chassi" {...register('chassi')} />
          <Input label="Motor" {...register('motor')} />
          <Select label="Combustível *" {...register('combustivel')}>
            {Object.entries(FUEL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
          <Select label="Câmbio *" {...register('cambio')}>
            {Object.entries(TRANSMISSION_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
          <Input
            label="Quilometragem *"
            type="number"
            inputMode="numeric"
            {...register('quilometragem')}
            error={errors.quilometragem?.message as string | undefined}
          />
          <Select label="Status *" {...register('status')}>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
          <div className="flex items-end pb-2">
            <Checkbox label="Consignado" {...register('consignado')} />
          </div>
        </div>
      </section>

      <section className="panel space-y-4 p-5">
        <h3 className="font-display text-lg font-semibold tracking-wide">Localização e origem</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div data-field-error={errors.cidade ? 'true' : undefined}>
            <Input label="Cidade *" {...register('cidade')} error={errors.cidade?.message} />
          </div>
          <Select label="Estado *" {...register('estado')}>
            {BRAZIL_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <Select label="Origem" {...register('origem')}>
            {ORIGINS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
          <Input label="Fornecedor" {...register('fornecedor')} />
          <Input
            label="Telefone fornecedor"
            {...register('telefoneFornecedor')}
            value={watch('telefoneFornecedor') || ''}
            onChange={(e) =>
              setValue('telefoneFornecedor', maskPhone(e.target.value), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          <div data-field-error={errors.dataCompra ? 'true' : undefined}>
            <Input
              label="Data da compra *"
              type="date"
              {...register('dataCompra')}
              error={errors.dataCompra?.message}
            />
          </div>
        </div>
      </section>

      <section className="panel space-y-4 p-5">
        <h3 className="font-display text-lg font-semibold tracking-wide">Valores</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            label="Preço FIPE"
            type="number"
            step="0.01"
            inputMode="decimal"
            {...register('precoFipe')}
            error={errors.precoFipe?.message as string | undefined}
          />
          <Input
            label="Valor de compra *"
            type="number"
            step="0.01"
            inputMode="decimal"
            {...register('valorCompra')}
            error={errors.valorCompra?.message as string | undefined}
          />
          <Input
            label="Preço anunciado"
            type="number"
            step="0.01"
            inputMode="decimal"
            {...register('precoAnunciado')}
            error={errors.precoAnunciado?.message as string | undefined}
          />
          <Input
            label="Preço mínimo"
            type="number"
            step="0.01"
            inputMode="decimal"
            {...register('precoMinimo')}
            error={errors.precoMinimo?.message as string | undefined}
          />
        </div>
        <Textarea label="Observações" {...register('observacoes')} />
      </section>

      <section className="panel space-y-4 p-5">
        <h3 className="font-display text-lg font-semibold tracking-wide">Fotos (até 15)</h3>
        <PhotoGallery
          photos={fotos}
          mainIndex={fotoPrincipal}
          onChange={(photos, main) => {
            setValue('fotos', photos, { shouldDirty: true })
            setValue('fotoPrincipal', main, { shouldDirty: true })
          }}
        />
      </section>

      {hasFieldErrors || errors.root ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {(errors.root?.message as string | undefined) ||
            'Preencha os campos obrigatórios marcados em vermelho antes de cadastrar.'}
        </div>
      ) : null}

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={isSubmitting} size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
