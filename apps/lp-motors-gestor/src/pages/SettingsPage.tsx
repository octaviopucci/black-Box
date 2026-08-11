import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Cloud, CloudOff, ExternalLink, RefreshCw } from 'lucide-react'
import { Input, Checkbox, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { maskPhone } from '@/utils'
import { LpLogo } from '@/components/common/LpLogo'
import { cn } from '@/utils'

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

const BLOB_STEPS = [
  'No Vercel → Project → Storage → Create Database → Blob',
  'Conecte o Blob Store ao projeto de produção (blckbox)',
  'Confirme que a env BLOB_READ_WRITE_TOKEN aparece em Settings → Environment Variables (Production)',
  'Faça Redeploy da produção (Deployments → … → Redeploy)',
  'Abra /api/lp-motors/health e confira "blob": true',
  'No app, toque em Sincronizar — o status deve mudar para “Sincronizado”',
]

export function SettingsPage() {
  const { settings, updateSettings, syncStatus, cloudHealth, syncNow } = useApp()
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

  const persistenceLabel =
    syncStatus === 'synced'
      ? 'Sincronizado na nuvem (multi-dispositivo)'
      : syncStatus === 'device-only'
        ? 'Só neste aparelho (falta Blob)'
        : syncStatus === 'offline'
          ? 'API offline'
          : syncStatus === 'syncing'
            ? 'Sincronizando…'
            : syncStatus === 'error'
              ? 'Erro ao sincronizar'
              : 'Verificando…'

  const PersistenceIcon = syncStatus === 'synced' ? Cloud : CloudOff

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Configurações</h1>
        <p className="section-sub">Dados da empresa, sync multi-dispositivo e preferências</p>
      </div>

      <section className="panel space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-lp-ink">Sincronização</h2>
            <p className="mt-1 text-sm text-lp-steel">
              PC e celular só compartilham estoque/dossiê quando o Vercel Blob estiver ativo.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            onClick={() => void syncNow()}
            disabled={syncStatus === 'syncing'}
          >
            <RefreshCw className={cn('h-4 w-4', syncStatus === 'syncing' && 'animate-spin')} />
            Sincronizar agora
          </Button>
        </div>

        <div
          className={cn(
            'flex items-start gap-3 rounded-xl border px-4 py-3',
            syncStatus === 'synced'
              ? 'border-lp-ok/40 bg-lp-ok/10'
              : syncStatus === 'device-only' || syncStatus === 'offline' || syncStatus === 'error'
                ? 'border-lp-copper/40 bg-lp-copper/10'
                : 'border-lp-line bg-lp-mist/40',
          )}
        >
          <PersistenceIcon
            className={cn(
              'mt-0.5 h-5 w-5 shrink-0',
              syncStatus === 'synced' ? 'text-lp-ok' : 'text-lp-copper',
            )}
          />
          <div className="min-w-0 space-y-1 text-sm">
            <p className="font-semibold text-lp-ink">{persistenceLabel}</p>
            <ul className="space-y-0.5 text-lp-steel">
              <li>
                API:{' '}
                <span className="font-medium text-lp-ink">
                  {cloudHealth == null ? '…' : cloudHealth.ok ? 'online' : 'offline'}
                </span>
              </li>
              <li>
                Persistência Blob:{' '}
                <span className="font-medium text-lp-ink">
                  {cloudHealth == null ? '…' : cloudHealth.blob ? 'ativa' : 'inativa'}
                </span>
              </li>
              <li>
                Health:{' '}
                <a
                  className="inline-flex items-center gap-1 text-lp-accent underline-offset-2 hover:underline"
                  href="/api/lp-motors/health"
                  target="_blank"
                  rel="noreferrer"
                >
                  /api/lp-motors/health
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {syncStatus !== 'synced' ? (
          <div>
            <h3 className="text-sm font-semibold text-lp-ink">Checklist Vercel Blob</h3>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-lp-steel">
              {BLOB_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-lp-steel">
              Detalhes também em <code className="rounded bg-lp-mist px-1">apps/lp-motors-gestor/DEPLOY.md</code>.
            </p>
          </div>
        ) : (
          <p className="text-sm text-lp-steel">
            Persistência na nuvem ativa. Alterações feitas neste login propagam para os outros
            dispositivos após sincronizar (automático a cada 2 min ou pelo botão acima).
          </p>
        )}
      </section>

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
