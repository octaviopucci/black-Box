import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Expense } from '@/types'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EXPENSE_LABELS } from '@/utils/constants'
import type { ExpenseInput } from '@/services/expenses'

const schema = z.object({
  descricao: z.string().min(1),
  categoria: z.enum([
    'compra',
    'ipva',
    'transferencia',
    'licenciamento',
    'seguro',
    'lavagem',
    'polimento',
    'mecanica',
    'funilaria',
    'pintura',
    'eletrica',
    'pneus',
    'combustivel',
    'guincho',
    'publicidade',
    'comissao',
    'documentacao',
    'despachante',
    'outros',
  ]),
  valor: z.coerce.number().min(0.01),
  data: z.string().min(1),
  observacao: z.string(),
})

type FormValues = z.infer<typeof schema>

export function ExpenseForm({
  vehicleId,
  initial,
  onSubmit,
  onCancel,
}: {
  vehicleId: string
  initial?: Expense
  onSubmit: (data: ExpenseInput) => Promise<void>
  onCancel?: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: initial
      ? {
          descricao: initial.descricao,
          categoria: initial.categoria,
          valor: initial.valor,
          data: initial.data,
          observacao: initial.observacao,
        }
      : {
          descricao: '',
          categoria: 'outros',
          valor: 0,
          data: new Date().toISOString().slice(0, 10),
          observacao: '',
        },
  })

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit({ ...values, vehicleId })
      })}
    >
      <Input label="Descrição *" {...register('descricao')} />
      <Select label="Categoria *" {...register('categoria')}>
        {Object.entries(EXPENSE_LABELS).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </Select>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Valor *" type="number" step="0.01" {...register('valor')} />
        <Input label="Data *" type="date" {...register('data')} />
      </div>
      <Textarea label="Observação" {...register('observacao')} />
      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" loading={isSubmitting}>
          {initial ? 'Atualizar' : 'Adicionar'} despesa
        </Button>
      </div>
    </form>
  )
}
