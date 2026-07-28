import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Customer } from '@/types'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { maskCPF, maskPhone } from '@/utils'
import type { CustomerInput } from '@/services/sales'

const schema = z.object({
  nome: z.string().min(1),
  cpf: z.string(),
  telefone: z.string(),
  cidade: z.string(),
  endereco: z.string(),
  email: z.string().email('E-mail inválido').or(z.literal('')),
  observacoes: z.string(),
})

type FormValues = z.infer<typeof schema>

export function CustomerForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Customer
  onSubmit: (data: CustomerInput) => Promise<void>
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
    defaultValues: initial || {
      nome: '',
      cpf: '',
      telefone: '',
      cidade: '',
      endereco: '',
      email: '',
      observacoes: '',
    },
  })

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values)
      })}
    >
      <Input label="Nome *" {...register('nome')} />
      <div className="grid gap-3 sm:grid-cols-2">
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
        <Input label="E-mail" type="email" {...register('email')} />
      </div>
      <Input label="Endereço" {...register('endereco')} />
      <Textarea label="Observações" {...register('observacoes')} />
      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" loading={isSubmitting}>
          {initial ? 'Atualizar' : 'Cadastrar'} cliente
        </Button>
      </div>
    </form>
  )
}
