import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PAYMENT_LABELS } from '@/utils/constants'
import { maskCPF, maskPhone } from '@/utils'
import type { SaleInput } from '@/services/sales'
import type { Customer } from '@/types'
import { useMemo } from 'react'

const schema = z.object({
  customerId: z.string().optional(),
  clienteNome: z.string().min(1),
  cpf: z.string(),
  telefone: z.string(),
  cidade: z.string(),
  endereco: z.string(),
  dataVenda: z.string().min(1),
  formaPagamento: z.enum(['pix', 'ted', 'dinheiro', 'financiamento', 'consorcio', 'cartao']),
  entrada: z.coerce.number().min(0),
  parcelas: z.coerce.number().min(0),
  valorVendido: z.coerce.number().min(1),
  comissao: z.coerce.number().min(0),
  observacoes: z.string(),
})

type FormValues = z.infer<typeof schema>

export function SaleForm({
  vehicleId,
  suggestedPrice,
  customers,
  onSubmit,
  onCancel,
}: {
  vehicleId: string
  suggestedPrice: number
  customers: Customer[]
  onSubmit: (data: SaleInput) => Promise<void>
  onCancel?: () => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      customerId: '',
      clienteNome: '',
      cpf: '',
      telefone: '',
      cidade: '',
      endereco: '',
      dataVenda: new Date().toISOString().slice(0, 10),
      formaPagamento: 'pix',
      entrada: 0,
      parcelas: 0,
      valorVendido: suggestedPrice || 0,
      comissao: 0,
      observacoes: '',
    },
  })

  const customerId = watch('customerId')
  const selected = useMemo(
    () => customers.find((c) => c.id === customerId),
    [customers, customerId],
  )

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({
          vehicleId,
          customerId: values.customerId || undefined,
          clienteNome: values.clienteNome,
          cpf: values.cpf,
          telefone: values.telefone,
          cidade: values.cidade,
          endereco: values.endereco,
          dataVenda: values.dataVenda,
          formaPagamento: values.formaPagamento,
          entrada: values.entrada,
          parcelas: values.parcelas,
          valorVendido: values.valorVendido,
          comissao: values.comissao,
          observacoes: values.observacoes,
        })
      })}
    >
      <Select
        label="Cliente existente"
        value={customerId}
        onChange={(e) => {
          const id = e.target.value
          setValue('customerId', id)
          const c = customers.find((x) => x.id === id)
          if (c) {
            setValue('clienteNome', c.nome)
            setValue('cpf', c.cpf)
            setValue('telefone', c.telefone)
            setValue('cidade', c.cidade)
            setValue('endereco', c.endereco)
          }
        }}
      >
        <option value="">Novo cliente</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome} — {c.cpf}
          </option>
        ))}
      </Select>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Nome do cliente *" {...register('clienteNome')} />
        <Input
          label="CPF"
          value={watch('cpf')}
          onChange={(e) => setValue('cpf', maskCPF(e.target.value))}
        />
        <Input
          label="Telefone"
          value={watch('telefone')}
          onChange={(e) => setValue('telefone', maskPhone(e.target.value))}
        />
        <Input label="Cidade" {...register('cidade')} />
      </div>
      <Input label="Endereço" {...register('endereco')} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input label="Data da venda *" type="date" {...register('dataVenda')} />
        <Select label="Forma de pagamento *" {...register('formaPagamento')}>
          {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
        <Input label="Valor vendido *" type="number" step="0.01" {...register('valorVendido')} />
        <Input label="Entrada" type="number" step="0.01" {...register('entrada')} />
        <Input label="Parcelas" type="number" {...register('parcelas')} />
        <Input label="Comissão" type="number" step="0.01" {...register('comissao')} />
      </div>
      <Textarea label="Observações" {...register('observacoes')} />
      {selected ? (
        <p className="text-xs text-white/40">Cliente vinculado: {selected.email || selected.nome}</p>
      ) : null}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" loading={isSubmitting}>
          Confirmar venda
        </Button>
      </div>
    </form>
  )
}
