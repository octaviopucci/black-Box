import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Expense } from '@/types'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { EXPENSE_LABELS, PAYABLE_STATUS_LABELS, PAYMENT_LABELS } from '@/utils/constants'
import type { ExpenseInput } from '@/services/expenses'

const schema = z.object({
  descricao: z.string().min(1),
  categoria: z.enum([
    'aquisicao',
    'compra',
    'mecanica',
    'eletrica',
    'funilaria',
    'pintura',
    'estetica',
    'higienizacao',
    'lavagem',
    'polimento',
    'pneus',
    'bateria',
    'pecas',
    'documentacao',
    'ipva',
    'licenciamento',
    'multas',
    'vistoria',
    'despachante',
    'guincho',
    'seguro',
    'comissao',
    'transferencia',
    'combustivel',
    'publicidade',
    'outros',
  ]),
  valor: z.coerce.number().min(0.01),
  data: z.string().min(1),
  fornecedorNome: z.string(),
  responsavel: z.string(),
  formaPagamento: z.enum(['pix', 'ted', 'dinheiro', 'financiamento', 'consorcio', 'cartao', 'boleto', 'cheque', '']),
  status: z.enum(['pendente', 'pago', 'vencido', 'cancelado']),
  documentoUrl: z.string(),
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
    resolver: zodResolver(schema) as never,
    defaultValues: initial
      ? {
          descricao: initial.descricao,
          categoria: initial.categoria,
          valor: initial.valor,
          data: initial.data,
          fornecedorNome: initial.fornecedorNome,
          responsavel: initial.responsavel,
          formaPagamento: initial.formaPagamento || '',
          status: initial.status,
          documentoUrl: initial.documentoUrl,
          observacao: initial.observacao,
        }
      : {
          descricao: '',
          categoria: 'outros',
          valor: 0,
          data: new Date().toISOString().slice(0, 10),
          fornecedorNome: '',
          responsavel: '',
          formaPagamento: '',
          status: 'pago',
          documentoUrl: '',
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
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Fornecedor" {...register('fornecedorNome')} />
        <Input label="Responsável" {...register('responsavel')} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Forma de pagamento" {...register('formaPagamento')}>
          <option value="">—</option>
          {Object.entries(PAYMENT_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
        <Select label="Status" {...register('status')}>
          {Object.entries(PAYABLE_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </div>
      <Input label="URL do documento / comprovante" {...register('documentoUrl')} placeholder="https://..." />
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
