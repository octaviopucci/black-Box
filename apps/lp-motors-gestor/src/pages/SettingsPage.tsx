import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Checkbox, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { maskPhone } from '@/utils'
import { LpLogo } from '@/components/common/LpLogo'

const schema = z.object({
  nomeEmpresa: z.string().min(1),
  logo: z.string(),
  telefone: z.string(),
  whatsapp: z.string(),
  instagram: z.string(),
  email: z.string(),
  endereco: z.string(),
  cidade: z.string(),
  tema: z.enum(['dark', 'light']),
  modoEscuro: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export function SettingsPage() {
  const { settings, updateSettings } = useApp()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      nomeEmpresa: settings.nomeEmpresa,
      logo: settings.logo,
      telefone: settings.telefone,
      whatsapp: settings.whatsapp,
      instagram: settings.instagram,
      email: settings.email,
      endereco: settings.endereco,
      cidade: settings.cidade,
      tema: settings.tema,
      modoEscuro: settings.modoEscuro,
    },
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Configurações</h1>
        <p className="section-sub">Dados da empresa e preferências do sistema</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel flex flex-col items-center justify-center gap-4 p-6 lg:col-span-1">
          {watch('logo') ? (
            <img src={watch('logo')} alt="Logo" className="max-h-24 object-contain" />
          ) : (
            <LpLogo size="lg" />
          )}
          <p className="text-center text-sm text-lp-steel">Pré-visualização da marca</p>
        </section>

        <form
          className="panel space-y-4 p-5 lg:col-span-2"
          onSubmit={handleSubmit(async (values) => {
            await updateSettings(values)
            document.documentElement.classList.toggle('dark', values.modoEscuro)
          })}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Nome da empresa *" {...register('nomeEmpresa')} />
            <Input label="E-mail" type="email" {...register('email')} />
            <Input
              label="Telefone"
              value={watch('telefone')}
              onChange={(e) => setValue('telefone', maskPhone(e.target.value))}
            />
            <Input
              label="WhatsApp"
              value={watch('whatsapp')}
              onChange={(e) => setValue('whatsapp', maskPhone(e.target.value))}
            />
            <Input label="Instagram" {...register('instagram')} />
            <Input label="Cidade" {...register('cidade')} />
          </div>
          <Input label="Endereço" {...register('endereco')} />
          <Textarea
            label="Logo (URL ou data URL)"
            {...register('logo')}
            placeholder="Cole uma URL de imagem ou data URL base64"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="label-field">Tema</span>
              <select className="input-field" {...register('tema')}>
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </label>
            <div className="flex items-end pb-2">
              <Checkbox label="Modo escuro" {...register('modoEscuro')} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              Salvar configurações
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
