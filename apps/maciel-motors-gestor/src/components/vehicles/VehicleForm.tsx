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

const schema = z.object({
  marca: z.string().min(1, 'Obrigatório'),
  modelo: z.string().min(1, 'Obrigatório'),
  versao: z.string(),
  ano: z.coerce.number().min(1950).max(2100),
  anoModelo: z.coerce.number().min(1950).max(2100),
  categoria: z.string().min(1),
  cor: z.string().min(1, 'Obrigatório'),
  placa: z.string(),
  renavam: z.string(),
  chassi: z.string(),
  motor: z.string(),
  combustivel: z.enum(['flex', 'gasolina', 'etanol', 'diesel', 'eletrico', 'hibrido', 'gnv']),
  cambio: z.enum(['manual', 'automatico', 'cvt', 'automatizado']),
  quilometragem: z.coerce.number().min(0),
  cidade: z.string().min(1, 'Obrigatório'),
  estado: z.string().min(2).max(2),
  fornecedor: z.string(),
  telefoneFornecedor: z.string(),
  origem: z.string(),
  precoFipe: z.coerce.number().min(0),
  valorCompra: z.coerce.number().min(0),
  precoAnunciado: z.coerce.number().min(0),
  precoMinimo: z.coerce.number().min(0),
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
  consignado: z.boolean(),
  fotos: z.array(z.string()),
  fotoPrincipal: z.number(),
})

type FormValues = z.infer<typeof schema>

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

  const fotos = watch('fotos')
  const fotoPrincipal = watch('fotoPrincipal')
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
            await onSubmit({
              ...values,
              placa: values.placa.toUpperCase(),
              consignado: values.status === 'consignado' || values.consignado,
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
            <Input label="Marca *" error={errors.marca?.message} {...register('marca')} />
          </div>
          <div data-field-error={errors.modelo ? 'true' : undefined}>
            <Input label="Modelo *" error={errors.modelo?.message} {...register('modelo')} />
          </div>
          <Input label="Versão" {...register('versao')} />
          <Input label="Ano *" type="number" error={errors.ano?.message} {...register('ano')} />
          <Input
            label="Ano modelo *"
            type="number"
            error={errors.anoModelo?.message}
            {...register('anoModelo')}
          />
          <Select label="Categoria *" {...register('categoria')}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
          <div data-field-error={errors.cor ? 'true' : undefined}>
            <Input label="Cor *" error={errors.cor?.message} {...register('cor')} />
          </div>
          <Input
            label="Placa"
            value={watch('placa')}
            onChange={(e) => setValue('placa', maskPlate(e.target.value))}
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
          <Input label="Quilometragem *" type="number" {...register('quilometragem')} />
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
            <Input label="Cidade *" error={errors.cidade?.message} {...register('cidade')} />
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
            value={watch('telefoneFornecedor')}
            onChange={(e) => setValue('telefoneFornecedor', maskPhone(e.target.value))}
          />
          <div data-field-error={errors.dataCompra ? 'true' : undefined}>
            <Input
              label="Data da compra *"
              type="date"
              error={errors.dataCompra?.message}
              {...register('dataCompra')}
            />
          </div>
        </div>
      </section>

      <section className="panel space-y-4 p-5">
        <h3 className="font-display text-lg font-semibold tracking-wide">Valores</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input label="Preço FIPE" type="number" step="0.01" {...register('precoFipe')} />
          <Input label="Valor de compra *" type="number" step="0.01" {...register('valorCompra')} />
          <Input label="Preço anunciado" type="number" step="0.01" {...register('precoAnunciado')} />
          <Input label="Preço mínimo" type="number" step="0.01" {...register('precoMinimo')} />
        </div>
        <Textarea label="Observações" {...register('observacoes')} />
      </section>

      <section className="panel space-y-4 p-5">
        <h3 className="font-display text-lg font-semibold tracking-wide">Fotos (até 15)</h3>
        <PhotoGallery
          photos={fotos}
          mainIndex={fotoPrincipal}
          onChange={(photos, main) => {
            setValue('fotos', photos)
            setValue('fotoPrincipal', main)
          }}
        />
      </section>

      {hasFieldErrors || errors.root ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errors.root?.message ||
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
