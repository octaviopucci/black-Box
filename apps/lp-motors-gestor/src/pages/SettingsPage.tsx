import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Cloud, CloudOff, ExternalLink, ImagePlus, Palette, RefreshCw, RotateCcw } from 'lucide-react'
import { Input, Checkbox, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { maskPhone, cn } from '@/utils'
import { LpLogo } from '@/components/common/LpLogo'
import {
  BRAND_PRESETS,
  applyBrandTheme,
  defaultBrandTheme,
  normalizeBrand,
  normalizeHex,
  readLogoAsDataUrl,
} from '@/utils/brand'
import type { BrandTheme, Settings } from '@/types'

const schema = z.object({
  nomeEmpresa: z.string().min(1),
  nomeCurto: z.string(),
  slogan: z.string(),
  logo: z.string(),
  telefone: z.string(),
  whatsapp: z.string(),
  instagram: z.string(),
  email: z.string(),
  endereco: z.string(),
  cidade: z.string(),
  tema: z.enum(['dark', 'light']),
  modoEscuro: z.boolean(),
  brand: z.object({
    presetId: z.enum(['lp', 'azul', 'vermelho', 'verde', 'noite', 'custom']),
    corPrimaria: z.string().min(4),
    corSecundaria: z.string().min(4),
    corFundo: z.string().min(4),
    corTexto: z.string().min(4),
    corPainel: z.string().min(4),
    aparencia: z.enum(['suave', 'reta']),
  }),
})

type FormValues = z.infer<typeof schema>

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="h-10 w-12 cursor-pointer rounded-lp border border-lp-line bg-white p-1"
          value={normalizeHex(value, '#000000')}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
        <input
          className="input-field font-mono text-sm uppercase"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </label>
  )
}

function previewSettings(values: FormValues): Settings {
  return {
    id: 'preview',
    nomeEmpresa: values.nomeEmpresa,
    nomeCurto: values.nomeCurto,
    slogan: values.slogan,
    logo: values.logo,
    telefone: values.telefone,
    whatsapp: values.whatsapp,
    instagram: values.instagram,
    email: values.email,
    endereco: values.endereco,
    cidade: values.cidade,
    tema: values.tema,
    modoEscuro: values.modoEscuro,
    brand: normalizeBrand(values.brand as BrandTheme),
    org: {
      alertDaysWarn: 30,
      alertDaysAlert: 45,
      alertDaysCritical: 60,
      minMarginPercent: 8,
      brandConcentrationLimit: 0.35,
      lowStockDemandGap: 2,
      docExpiryWarnDays: 15,
    },
    updatedAt: new Date().toISOString(),
  }
}

export function SettingsPage() {
  const { settings, updateSettings, toast, syncStatus, cloudHealth, syncNow } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      nomeEmpresa: settings.nomeEmpresa,
      nomeCurto: settings.nomeCurto || '',
      slogan: settings.slogan || '',
      logo: settings.logo,
      telefone: settings.telefone,
      whatsapp: settings.whatsapp,
      instagram: settings.instagram,
      email: settings.email,
      endereco: settings.endereco,
      cidade: settings.cidade,
      tema: settings.tema,
      modoEscuro: settings.modoEscuro,
      brand: normalizeBrand(settings.brand),
    },
  })

  const values = watch()

  useEffect(() => {
    applyBrandTheme(previewSettings(values))
  }, [values])

  useEffect(() => {
    return () => {
      applyBrandTheme(settings)
    }
  }, [settings])

  const setBrand = (patch: Partial<BrandTheme>) => {
    const next = normalizeBrand({ ...values.brand, ...patch, presetId: patch.presetId || 'custom' })
    setValue('brand', next, { shouldDirty: true })
  }

  const applyPreset = (id: (typeof BRAND_PRESETS)[number]['id']) => {
    const preset = BRAND_PRESETS.find((p) => p.id === id)
    if (!preset) return
    setValue('brand', { ...preset.brand }, { shouldDirty: true })
    setValue('tema', preset.id === 'noite' ? 'dark' : 'light')
    setValue('modoEscuro', preset.id === 'noite')
  }

  const onLogoFile = async (file?: File | null) => {
    if (!file) return
    try {
      const dataUrl = await readLogoAsDataUrl(file)
      setValue('logo', dataUrl, { shouldDirty: true })
      toast('Logo carregada. Salve para manter.', 'success')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Falha ao carregar logo', 'error')
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Identidade da loja</h1>
        <p className="section-sub">
          Template editável da marca, sync multi-dispositivo e preferências da loja.
        </p>
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
          {syncStatus === 'synced' ? (
            <Cloud className="mt-0.5 h-5 w-5 shrink-0 text-lp-ok" />
          ) : (
            <CloudOff className="mt-0.5 h-5 w-5 shrink-0 text-lp-copper" />
          )}
          <div className="min-w-0 space-y-1 text-sm">
            <p className="font-semibold text-lp-ink">
              {syncStatus === 'synced'
                ? 'Sincronizado na nuvem (multi-dispositivo)'
                : syncStatus === 'device-only'
                  ? 'Só neste aparelho (falta Blob)'
                  : syncStatus === 'offline'
                    ? 'API offline'
                    : syncStatus === 'syncing'
                      ? 'Sincronizando…'
                      : syncStatus === 'error'
                        ? 'Erro ao sincronizar'
                        : 'Verificando…'}
            </p>
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
              <li>No Vercel → Project → Storage → Create Database → Blob</li>
              <li>Conecte o Blob Store ao projeto de produção (blckbox)</li>
              <li>Confirme BLOB_READ_WRITE_TOKEN em Environment Variables (Production)</li>
              <li>Faça Redeploy da produção</li>
              <li>Abra /api/lp-motors/health e confira &quot;blob&quot;: true</li>
            </ol>
          </div>
        ) : (
          <p className="text-sm text-lp-steel">
            Persistência na nuvem ativa. Alterações propagam após sincronizar (a cada 2 min ou pelo botão).
          </p>
        )}
      </section>

      <section className="panel space-y-4 p-5">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-lp-accent" />
          <div>
            <h2 className="font-semibold text-lp-ink">Templates prontos</h2>
            <p className="text-sm text-lp-steel">Escolha um ponto de partida e ajuste depois.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {BRAND_PRESETS.map((preset) => {
            const active = values.brand.presetId === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  'rounded-lp-lg border p-3 text-left transition',
                  active
                    ? 'border-lp-accent bg-lp-accent/10 ring-2 ring-lp-accent/30'
                    : 'border-lp-line hover:border-lp-steel/40',
                )}
              >
                <div className="mb-2 flex gap-1.5">
                  {[preset.brand.corPrimaria, preset.brand.corSecundaria, preset.brand.corPainel].map(
                    (c) => (
                      <span
                        key={c}
                        className="h-4 w-4 rounded-full border border-black/5"
                        style={{ background: c }}
                      />
                    ),
                  )}
                </div>
                <p className="text-sm font-semibold text-lp-ink">{preset.name}</p>
                <p className="mt-0.5 text-[11px] text-lp-steel">{preset.description}</p>
              </button>
            )
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel space-y-4 overflow-hidden p-0 lg:col-span-1">
          <div className="bg-lp-hero bg-lp-grid bg-grid px-5 py-8">
            <LpLogo
              size="lg"
              name={values.nomeCurto || values.nomeEmpresa}
              logoUrl={values.logo}
              accent={values.brand.corPrimaria}
              copper={values.brand.corSecundaria}
              ink={values.brand.corPainel}
            />
            <h3 className="mt-5 font-display text-2xl font-bold text-lp-ink">
              {values.nomeEmpresa || 'Nome da loja'}
            </h3>
            <p className="mt-1 text-sm text-lp-steel">
              {values.slogan || 'Slogan da sua operação'}
            </p>
            <button type="button" className="btn-primary mt-5">
              Botão de exemplo
            </button>
          </div>
          <div className="space-y-2 px-5 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-lp-steel">
              Pré-visualização ao vivo
            </p>
            <p className="text-sm text-lp-steel">
              As cores e o raio dos cantos já refletem no sistema. Clique em salvar para gravar na
              loja.
            </p>
          </div>
        </section>

        <form
          className="panel space-y-5 p-5 lg:col-span-2"
          onSubmit={handleSubmit(async (form) => {
            await updateSettings({
              ...form,
              brand: normalizeBrand({ ...form.brand, presetId: form.brand.presetId || 'custom' }),
            })
            toast('Identidade da loja salva.', 'success')
          })}
        >
          <div>
            <h2 className="font-semibold text-lp-ink">Dados da loja</h2>
            <p className="text-sm text-lp-steel">Nome e contatos usados no sistema e no rodapé.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Nome da empresa *" {...register('nomeEmpresa')} />
            <Input label="Nome curto (header)" {...register('nomeCurto')} placeholder="Ex.: Auto Prime" />
            <Input label="E-mail" type="email" {...register('email')} />
            <Input label="Cidade" {...register('cidade')} />
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
            <Input label="Endereço" {...register('endereco')} />
          </div>
          <Input label="Slogan" {...register('slogan')} placeholder="Ex.: Seu carro, nossa garantia" />

          <div className="border-t border-lp-line pt-4">
            <h2 className="font-semibold text-lp-ink">Logo</h2>
            <p className="mb-3 text-sm text-lp-steel">Envie um arquivo ou cole uma URL / data URL.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
                <ImagePlus className="h-4 w-4" />
                Enviar logo
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setValue('logo', '', { shouldDirty: true })}
              >
                Remover
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onLogoFile(e.target.files?.[0])}
              />
            </div>
            <Textarea
              className="mt-3"
              label="Logo (URL ou data URL)"
              {...register('logo')}
              placeholder="https://… ou data:image/png;base64,…"
            />
          </div>

          <div className="border-t border-lp-line pt-4">
            <h2 className="font-semibold text-lp-ink">Cores da marca</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <ColorField
                label="Primária (botões / destaques)"
                value={values.brand.corPrimaria}
                onChange={(hex) => setBrand({ corPrimaria: hex })}
              />
              <ColorField
                label="Secundária (acentos)"
                value={values.brand.corSecundaria}
                onChange={(hex) => setBrand({ corSecundaria: hex })}
              />
              <ColorField
                label="Fundo"
                value={values.brand.corFundo}
                onChange={(hex) => setBrand({ corFundo: hex })}
              />
              <ColorField
                label="Texto"
                value={values.brand.corTexto}
                onChange={(hex) => setBrand({ corTexto: hex })}
              />
              <ColorField
                label="Painéis escuros"
                value={values.brand.corPainel}
                onChange={(hex) => setBrand({ corPainel: hex })}
              />
            </div>
          </div>

          <div className="grid gap-3 border-t border-lp-line pt-4 sm:grid-cols-3">
            <label className="block">
              <span className="label-field">Aparência</span>
              <select
                className="input-field"
                value={values.brand.aparencia}
                onChange={(e) =>
                  setBrand({ aparencia: e.target.value === 'reta' ? 'reta' : 'suave' })
                }
              >
                <option value="suave">Cantos suaves</option>
                <option value="reta">Cantos retos</option>
              </select>
            </label>
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

          <div className="flex flex-wrap justify-between gap-3 border-t border-lp-line pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                const brand = defaultBrandTheme()
                reset({
                  ...values,
                  brand,
                  tema: 'light',
                  modoEscuro: false,
                })
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar padrão LP
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Salvar identidade
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
