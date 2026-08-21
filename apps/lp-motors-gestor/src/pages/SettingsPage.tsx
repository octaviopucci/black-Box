import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  Cloud,
  CloudOff,
  ImagePlus,
  Palette,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { Input, Checkbox, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { MotionPage } from '@/components/common/MotionPage'
import { useApp } from '@/context/AppContext'
import { maskPhone, cn } from '@/utils'
import { LpLogo } from '@/components/common/LpLogo'
import {
  ATMOSPHERE_IMAGES,
  BRAND_PRESETS,
  applyBrandTheme,
  defaultBrandTheme,
  isDarkHex,
  normalizeBrand,
  normalizeHex,
  readLogoAsDataUrl,
  processLogoFile,
  suggestPainel,
  suggestSurface,
  suggestText,
} from '@/utils/brand'
import type { BrandAtmosfera, BrandTheme, Settings } from '@/types'

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
    presetId: z.enum(['lp', 'azul', 'champagne', 'racing', 'obsidian', 'custom']),
    corPrimaria: z.string().min(4),
    corSecundaria: z.string().min(4),
    corFundo: z.string().min(4),
    corSuperficie: z.string().min(4),
    corTexto: z.string().min(4),
    corPainel: z.string().min(4),
    aparencia: z.enum(['suave', 'reta', 'premium']),
    atmosfera: z.enum(['showroom', 'night', 'atelier', 'carbon']),
    intensidadeFoto: z.number().min(0).max(100),
  }),
})

type FormValues = z.infer<typeof schema>

const ATMOSFERA_LABELS: Record<BrandAtmosfera, string> = {
  showroom: 'Showroom',
  night: 'Night drive',
  atelier: 'Atelier',
  carbon: 'Carbon',
}

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  onChange: (hex: string) => void
}) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="h-11 w-14 cursor-pointer border border-lp-line bg-lp-surface p-1"
          style={{ borderRadius: 'var(--lp-radius)' }}
          value={normalizeHex(value, '#000000')}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
        <input
          className="input-field font-mono text-sm uppercase"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {hint ? <p className="mt-1 text-[11px] text-lp-steel">{hint}</p> : null}
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
  const { settings, updateSettings, toast, syncStatus, cloudHealth, user } = useApp()
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
  const brand = values.brand

  useEffect(() => {
    applyBrandTheme(previewSettings(values))
  }, [values])

  useEffect(() => {
    return () => {
      applyBrandTheme(settings)
    }
  }, [settings])

  const setBrand = (patch: Partial<BrandTheme>, markCustom = true) => {
    const next = normalizeBrand({
      ...brand,
      ...patch,
      presetId: markCustom ? 'custom' : patch.presetId || brand.presetId,
    })
    setValue('brand', next, { shouldDirty: true })
  }

  const onFundoChange = (hex: string) => {
    const fundo = normalizeHex(hex, brand.corFundo)
    setBrand({
      corFundo: fundo,
      corSuperficie: suggestSurface(fundo),
      corTexto: suggestText(fundo),
      corPainel: suggestPainel(fundo),
    })
  }

  const applyPreset = (id: (typeof BRAND_PRESETS)[number]['id']) => {
    const preset = BRAND_PRESETS.find((p) => p.id === id)
    if (!preset) return
    setValue('brand', { ...preset.brand }, { shouldDirty: true })
    const dark = isDarkHex(preset.brand.corFundo)
    setValue('tema', dark ? 'dark' : 'light')
    setValue('modoEscuro', dark)
  }

  const onLogoFile = async (file?: File | null) => {
    if (!file) return
    try {
      toast('Processando logo…', 'info')
      const dataUrl = await processLogoFile(file)
      setValue('logo', dataUrl, { shouldDirty: true })
      toast('Logo com fundo transparente. Salve para manter.', 'success')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Falha ao carregar logo', 'error')
    }
  }

  const photoUrl = useMemo(
    () => ATMOSPHERE_IMAGES[brand.atmosfera as BrandAtmosfera] || ATMOSPHERE_IMAGES.showroom,
    [brand.atmosfera],
  )

  return (
    <MotionPage className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lp-accent">Studio</p>
        <h1 className="section-title">Identidade da loja</h1>
        <p className="section-sub">
          Escolha qualquer cor — fundo, superfície, acentos e atmosfera mudam o app inteiro em tempo
          real.
        </p>
      </div>

      {/* Sync — automático, sem botão manual */}
      <section className="panel space-y-3 p-5">
        <div>
          <h2 className="text-base font-semibold text-lp-ink">Nuvem</h2>
          <p className="mt-1 text-sm text-lp-steel">
            PC e celular sincronizam automaticamente — basta fazer login com o mesmo código da loja.
          </p>
        </div>
        <div
          className={cn(
            'flex items-start gap-3 border px-4 py-3',
            syncStatus === 'synced'
              ? 'border-lp-ok/40 bg-lp-ok/10'
              : 'border-lp-copper/40 bg-lp-copper/10',
          )}
          style={{ borderRadius: 'var(--lp-radius)' }}
        >
          {syncStatus === 'synced' ? (
            <Cloud className="mt-0.5 h-5 w-5 shrink-0 text-lp-ok" />
          ) : (
            <CloudOff className="mt-0.5 h-5 w-5 shrink-0 text-lp-copper" />
          )}
          <div className="text-sm">
            <p className="font-semibold text-lp-ink">
              {syncStatus === 'synced'
                ? 'Sincronização automática ativa'
                : syncStatus === 'device-only'
                  ? 'Só neste aparelho (falta Blob)'
                  : syncStatus === 'offline'
                    ? 'Sem conexão — tentando de novo em breve'
                    : syncStatus === 'syncing'
                      ? 'Sincronizando…'
                      : 'Verificando nuvem…'}
            </p>
            <p className="mt-1 text-lp-steel">
              API {cloudHealth?.ok ? 'online' : '…'} · Blob{' '}
              {cloudHealth == null ? '…' : cloudHealth.blob ? 'ativo' : 'inativo'}
            </p>
          </div>
        </div>
      </section>

      {/* Presets */}
      <section className="panel space-y-4 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-lp-accent" />
          <div>
            <h2 className="font-semibold text-lp-ink">Templates de partida</h2>
            <p className="text-sm text-lp-steel">Depois ajuste qualquer cor livremente abaixo.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {BRAND_PRESETS.map((preset) => {
            const active = brand.presetId === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={cn(
                  'overflow-hidden border text-left transition',
                  active ? 'premium-ring border-lp-accent' : 'border-lp-line hover:border-lp-accent/50',
                )}
                style={{ borderRadius: 'var(--lp-radius-lg)' }}
              >
                <div
                  className="h-16 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(120deg, ${preset.brand.corFundo}cc, ${preset.brand.corPrimaria}66), url(${ATMOSPHERE_IMAGES[preset.brand.atmosfera]})`,
                  }}
                />
                <div className="space-y-1 p-3">
                  <div className="flex gap-1">
                    {[
                      preset.brand.corFundo,
                      preset.brand.corPrimaria,
                      preset.brand.corSecundaria,
                      preset.brand.corSuperficie,
                    ].map((c) => (
                      <span
                        key={c}
                        className="h-3.5 w-3.5 rounded-full border border-white/20"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-lp-ink">{preset.name}</p>
                  <p className="text-[11px] text-lp-steel">{preset.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-5">
        {/* Live stage */}
        <section className="panel overflow-hidden p-0 xl:col-span-2">
          <div className="relative min-h-[360px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500"
              style={{
                backgroundImage: `url(${photoUrl})`,
                opacity: brand.intensidadeFoto / 100,
                transform: 'scale(1.06)',
              }}
            />
            <div
              className="absolute inset-0 transition-colors duration-300"
              style={{
                background: `linear-gradient(160deg, ${brand.corFundo}f2 10%, ${brand.corFundo}cc 55%, ${brand.corPrimaria}55 100%)`,
              }}
            />
            <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-8">
              <LpLogo
                size="lg"
                name={values.nomeCurto || values.nomeEmpresa}
                logoUrl={values.logo}
                accent={brand.corPrimaria}
                copper={brand.corSecundaria}
                ink={brand.corPainel}
              />
              <div>
                <motion.p
                  key={brand.corFundo + brand.corPrimaria}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-cinema text-4xl text-white drop-shadow"
                >
                  {values.nomeEmpresa || 'Sua loja'}
                </motion.p>
                <p className="mt-2 max-w-sm text-sm text-white/75">
                  {values.slogan || 'Slogan da operação'}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="btn-primary">Botão primário</span>
                  <span className="btn-secondary">Secundário</span>
                </div>
              </div>
              <div
                className="mt-6 border p-4"
                style={{
                  borderRadius: 'var(--lp-radius-lg)',
                  background: brand.corSuperficie,
                  borderColor: 'color-mix(in srgb, white 12%, transparent)',
                  color: brand.corTexto,
                }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
                  Painel / superfície
                </p>
                <p className="mt-1 font-display text-xl font-bold">KPI R$ 248.900</p>
                <p className="text-sm opacity-70">Muda com a cor de fundo e superfície</p>
              </div>
            </div>
          </div>
        </section>

        <form
          className="panel space-y-5 p-5 xl:col-span-3"
          onSubmit={handleSubmit(async (form) => {
            await updateSettings({
              ...form,
              brand: normalizeBrand({ ...form.brand, presetId: form.brand.presetId || 'custom' }),
            })
            toast('Identidade premium salva.', 'success')
          })}
        >
          <div>
            <h2 className="flex items-center gap-2 font-semibold text-lp-ink">
              <Palette className="h-4 w-4 text-lp-accent" />
              Cores livres
            </h2>
            <p className="text-sm text-lp-steel">
              Alterar o fundo recalcula superfície/texto automaticamente — você pode sobrescrever.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ColorField
              label="Fundo da aplicação *"
              hint="Cor dominante da página (muda o background)"
              value={brand.corFundo}
              onChange={onFundoChange}
            />
            <ColorField
              label="Superfície (cards/header)"
              value={brand.corSuperficie}
              onChange={(hex) => setBrand({ corSuperficie: hex })}
            />
            <ColorField
              label="Primária (botões / destaques)"
              value={brand.corPrimaria}
              onChange={(hex) => setBrand({ corPrimaria: hex })}
            />
            <ColorField
              label="Secundária (acentos)"
              value={brand.corSecundaria}
              onChange={(hex) => setBrand({ corSecundaria: hex })}
            />
            <ColorField
              label="Texto"
              value={brand.corTexto}
              onChange={(hex) => setBrand({ corTexto: hex })}
            />
            <ColorField
              label="Painéis escuros / marca"
              value={brand.corPainel}
              onChange={(hex) => setBrand({ corPainel: hex })}
            />
          </div>

          <div>
            <span className="label-field">Atmosfera cinematográfica</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(ATMOSFERA_LABELS) as BrandAtmosfera[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBrand({ atmosfera: key })}
                  className={cn(
                    'overflow-hidden border text-left',
                    brand.atmosfera === key ? 'border-lp-accent' : 'border-lp-line',
                  )}
                  style={{ borderRadius: 'var(--lp-radius)' }}
                >
                  <div
                    className="h-14 bg-cover bg-center"
                    style={{ backgroundImage: `url(${ATMOSPHERE_IMAGES[key]})` }}
                  />
                  <p className="px-2 py-1.5 text-xs font-semibold text-lp-ink">
                    {ATMOSFERA_LABELS[key]}
                  </p>
                </button>
              ))}
            </div>
            <label className="mt-3 block">
              <span className="label-field">
                Intensidade da foto ({brand.intensidadeFoto}%)
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={brand.intensidadeFoto}
                onChange={(e) => setBrand({ intensidadeFoto: Number(e.target.value) })}
                className="w-full accent-[var(--lp-accent)]"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="label-field">Aparência</span>
              <select
                className="input-field"
                value={brand.aparencia}
                onChange={(e) =>
                  setBrand({
                    aparencia: e.target.value as BrandTheme['aparencia'],
                  })
                }
              >
                <option value="premium">Premium</option>
                <option value="suave">Cantos suaves</option>
                <option value="reta">Cantos retos</option>
              </select>
            </label>
            <label className="block">
              <span className="label-field">Tema</span>
              <select className="input-field" {...register('tema')}>
                <option value="dark">Escuro</option>
                <option value="light">Claro</option>
              </select>
            </label>
            <div className="flex items-end pb-2">
              <Checkbox label="Forçar modo escuro" {...register('modoEscuro')} />
            </div>
          </div>

          <div className="border-t border-lp-line pt-4">
            <h2 className="font-semibold text-lp-ink">Dados da loja</h2>
            {user?.organizationSlug ? (
              <p className="mt-2 rounded-lg border border-lp-line bg-lp-mist px-3 py-2 text-sm text-lp-steel">
                Código da loja:{' '}
                <code className="font-semibold text-lp-ink">{user.organizationSlug}</code>
                <span className="mt-1 block text-xs">
                  Funcionários usam este código no login se o usuário for igual em outra loja.
                </span>
              </p>
            ) : null}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Input label="Nome da empresa *" {...register('nomeEmpresa')} />
              <Input label="Nome curto" {...register('nomeCurto')} />
              <Input label="Slogan" {...register('slogan')} />
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
            <Input className="mt-3" label="Endereço" {...register('endereco')} />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button type="button" variant="secondary" onClick={() => fileRef.current?.click()}>
                <ImagePlus className="h-4 w-4" />
                Enviar logo (fundo removido auto)
              </Button>
              <Button type="button" variant="ghost" onClick={() => setValue('logo', '')}>
                Remover logo
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onLogoFile(e.target.files?.[0])}
              />
            </div>
            <Textarea className="mt-3" label="Logo (URL / data URL)" {...register('logo')} />
          </div>

          <div className="flex flex-wrap justify-between gap-3 border-t border-lp-line pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                const b = defaultBrandTheme()
                reset({
                  ...values,
                  brand: b,
                  tema: 'dark',
                  modoEscuro: true,
                  slogan: values.slogan,
                })
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar LP Showroom
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Salvar identidade
            </Button>
          </div>
        </form>
      </div>
    </MotionPage>
  )
}
