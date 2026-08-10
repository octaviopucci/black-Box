import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Car,
  Loader2,
  Search,
  Table2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import {
  fipeService,
  type FipeDetail,
  type FipeOption,
  type FipeType,
  type PlateConsultation,
} from '@/services/fipe'
import { BRAZIL_STATES } from '@/utils/constants'
import { formatCurrency, maskPlate } from '@/utils'
import { cn } from '@/utils'

const TYPES: { id: FipeType; label: string }[] = [
  { id: 'cars', label: 'Carros' },
  { id: 'motorcycles', label: 'Motos' },
  { id: 'trucks', label: 'Caminhões' },
]

export function FipePage() {
  const { vehicles, updateVehicle, toast } = useApp()
  const [params] = useSearchParams()
  const vehicleId = params.get('vehicleId') || ''

  const [plate, setPlate] = useState('')
  const [uf, setUf] = useState('SP')
  const [type, setType] = useState<FipeType>('cars')
  const [loadingPlate, setLoadingPlate] = useState(false)
  const [plateResult, setPlateResult] = useState<PlateConsultation | null>(null)

  const [brands, setBrands] = useState<FipeOption[]>([])
  const [models, setModels] = useState<FipeOption[]>([])
  const [years, setYears] = useState<FipeOption[]>([])
  const [brandId, setBrandId] = useState('')
  const [modelId, setModelId] = useState('')
  const [yearId, setYearId] = useState('')
  const [detail, setDetail] = useState<FipeDetail | null>(null)
  const [ipva, setIpva] = useState<{ value: number; aliquotPercent: number; uf: string } | null>(null)
  const [loadingFipe, setLoadingFipe] = useState(false)

  const localMatch = useMemo(() => {
    const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (clean.length < 7) return null
    return vehicles.find((v) => v.placa.replace(/[^A-Z0-9]/gi, '').toUpperCase() === clean) || null
  }, [plate, vehicles])

  const linkedVehicle = vehicleId ? vehicles.find((v) => v.id === vehicleId) : localMatch

  useEffect(() => {
    if (linkedVehicle?.placa && !plate) setPlate(maskPlate(linkedVehicle.placa))
    if (linkedVehicle?.estado) setUf(linkedVehicle.estado)
  }, [linkedVehicle, plate])

  useEffect(() => {
    let cancelled = false
    setBrandId('')
    setModelId('')
    setYearId('')
    setModels([])
    setYears([])
    setDetail(null)
    setIpva(null)
    ;(async () => {
      try {
        const list = await fipeService.brands(type)
        if (!cancelled) setBrands(list)
      } catch (e) {
        if (!cancelled) toast(e instanceof Error ? e.message : 'Falha ao carregar marcas FIPE', 'error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [type, toast])

  useEffect(() => {
    if (!brandId) return
    let cancelled = false
    setModelId('')
    setYearId('')
    setYears([])
    setDetail(null)
    setIpva(null)
    ;(async () => {
      try {
        const list = await fipeService.models(type, brandId)
        if (!cancelled) setModels(list)
      } catch (e) {
        if (!cancelled) toast(e instanceof Error ? e.message : 'Falha ao carregar modelos', 'error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [brandId, type, toast])

  useEffect(() => {
    if (!brandId || !modelId) return
    let cancelled = false
    setYearId('')
    setDetail(null)
    setIpva(null)
    ;(async () => {
      try {
        const list = await fipeService.years(type, brandId, modelId)
        if (!cancelled) setYears(list)
      } catch (e) {
        if (!cancelled) toast(e instanceof Error ? e.message : 'Falha ao carregar anos', 'error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [brandId, modelId, type, toast])

  useEffect(() => {
    if (!brandId || !modelId || !yearId) return
    let cancelled = false
    setLoadingFipe(true)
    ;(async () => {
      try {
        const d = await fipeService.detail(type, brandId, modelId, yearId)
        if (cancelled) return
        setDetail(d)
        const value = fipeService.parsePrice(d.price)
        if (value > 0) {
          const est = await fipeService.estimateIpva(value, uf)
          if (!cancelled) setIpva(est)
        }
      } catch (e) {
        if (!cancelled) toast(e instanceof Error ? e.message : 'Falha ao consultar FIPE', 'error')
      } finally {
        if (!cancelled) setLoadingFipe(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [brandId, modelId, yearId, type, uf, toast])

  const searchPlate = async () => {
    const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (clean.length < 7) {
      toast('Informe a placa completa (ABC1D23 ou ABC1234).', 'error')
      return
    }
    setLoadingPlate(true)
    setPlateResult(null)
    try {
      const result = await fipeService.consultPlate(clean, uf, type)
      setPlateResult(result)
      if (result.fipe) {
        setDetail(result.fipe)
        if (result.ipva) setIpva(result.ipva)
      }
      if (result.ok && result.vehicle?.brand) {
        // tenta pré-selecionar marca na cascata
        const brand = brands.find(
          (b) => b.name.toLowerCase() === result.vehicle!.brand.toLowerCase(),
        )
        if (brand) setBrandId(brand.code)
      }
      if (!result.ok) {
        toast(result.message || 'Placa não encontrada automaticamente. Selecione na FIPE abaixo.', 'info')
      } else {
        toast('Consulta da placa concluída.', 'success')
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Falha na consulta da placa', 'error')
    } finally {
      setLoadingPlate(false)
    }
  }

  const applyToVehicle = async () => {
    const targetId = vehicleId || localMatch?.id
    const value = fipeService.parsePrice(detail?.price)
    if (!targetId) {
      toast('Abra a consulta a partir de um veículo do estoque, ou cadastre com esses dados.', 'info')
      return
    }
    if (!value) {
      toast('Selecione um resultado FIPE antes de aplicar.', 'error')
      return
    }
    await updateVehicle(targetId, {
      precoFipe: value,
      marca: detail?.brand || undefined,
      modelo: detail?.model?.split(' ')[0] || undefined,
      versao: detail?.model || undefined,
      anoModelo: detail?.modelYear || undefined,
    })
    toast('Valor FIPE aplicado ao veículo.', 'success')
  }

  const activeDetail = detail
  const activeIpva = ipva
  const fipeValue = fipeService.parsePrice(activeDetail?.price)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lp-accent">Mercado</p>
        <h1 className="section-title">Consulta FIPE pela placa</h1>
        <p className="section-sub">
          Digite a placa e confira o valor da Tabela FIPE e a estimativa de IPVA — no estilo PlacaFIPE, dentro do LP Motors.
        </p>
      </div>

      {/* Hero plate search */}
      <section className="panel overflow-hidden">
        <div className="bg-lp-hero bg-lp-grid bg-grid px-4 py-8 sm:px-8">
          <div className="mx-auto max-w-2xl">
            <label className="label-field">Indique a placa</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="input-field font-mono text-2xl tracking-[0.2em] uppercase sm:text-3xl"
                placeholder="ABC1D23"
                value={plate}
                onChange={(e) => setPlate(maskPlate(e.target.value))}
                onKeyDown={(e) => e.key === 'Enter' && void searchPlate()}
                maxLength={8}
              />
              <Button className="sm:min-w-[140px]" onClick={() => void searchPlate()} disabled={loadingPlate}>
                {loadingPlate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Pesquisar
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-lp-steel">
              <label className="flex items-center gap-2">
                UF IPVA
                <select className="input-field w-auto py-1.5" value={uf} onChange={(e) => setUf(e.target.value)}>
                  {BRAZIL_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2">
                Tipo
                <select
                  className="input-field w-auto py-1.5"
                  value={type}
                  onChange={(e) => setType(e.target.value as FipeType)}
                >
                  {TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-3 text-xs text-lp-steel">
              Formatos: ABC1234 (antigo) ou ABC1D23 (Mercosul). Sem traço também funciona.
            </p>
          </div>
        </div>
      </section>

      {/* Plate / local results */}
      {(plateResult || localMatch) && (
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="panel p-5 lg:col-span-2">
            <h2 className="font-display text-lg font-bold">Resultado da placa</h2>
            {localMatch ? (
              <p className="mt-2 text-sm text-lp-accent">
                Veículo encontrado no estoque LP Motors:{' '}
                <Link className="underline" to={`/veiculos/${localMatch.id}`}>
                  {localMatch.marca} {localMatch.modelo}
                </Link>
              </p>
            ) : null}
            {plateResult ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Info label="Placa" value={maskPlate(plateResult.plate)} />
                <Info label="Mercosul / Antiga" value={`${plateResult.formats.mercosul} · ${plateResult.formats.antiga}`} />
                <Info label="Marca" value={plateResult.vehicle?.brand || '—'} />
                <Info label="Modelo" value={plateResult.vehicle?.model || plateResult.vehicle?.version || '—'} />
                <Info label="Ano modelo" value={plateResult.vehicle?.modelYear ? String(plateResult.vehicle.modelYear) : '—'} />
                <Info label="Código FIPE" value={plateResult.vehicle?.fipeCode || '—'} />
                <Info label="Município" value={[plateResult.vehicle?.city, plateResult.vehicle?.state].filter(Boolean).join(' / ') || '—'} />
                <Info label="Fonte" value={plateResult.source === 'none' ? 'Seleção manual FIPE' : plateResult.source} />
              </div>
            ) : null}
            {plateResult && !plateResult.plateConfigured ? (
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                Consulta automática por placa ainda não tem provedor gratuito estável configurado.
                Use a Tabela FIPE abaixo (marca → modelo → ano) — é o caminho zero custo.
                Para ativar placa→dados, configure <code className="font-mono">LP_MOTORS_PLATE_API_URL</code> na Vercel.
              </p>
            ) : null}
          </div>

          <div className="panel-ink p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Tabela FIPE</p>
            <p className="mt-2 font-display text-3xl font-bold text-white">
              {fipeValue ? formatCurrency(fipeValue) : '—'}
            </p>
            <p className="mt-1 text-sm text-white/60">{activeDetail?.referenceMonth || 'Selecione o veículo'}</p>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                IPVA estimado ({activeIpva?.uf || uf})
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-teal-300">
                {activeIpva ? formatCurrency(activeIpva.value) : '—'}
              </p>
              {activeIpva ? (
                <p className="mt-1 text-xs text-white/45">
                  Alíquota {activeIpva.aliquotPercent.toFixed(2)}% sobre o valor FIPE (estimativa).
                </p>
              ) : null}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button onClick={() => void applyToVehicle()} disabled={!fipeValue}>
                Aplicar FIPE no veículo
              </Button>
              <Link to={`/veiculos/novo?fipe=${encodeURIComponent(String(fipeValue || ''))}&placa=${encodeURIComponent(plate)}`}>
                <Button variant="secondary" className="w-full">
                  Cadastrar veículo com estes dados <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Manual FIPE cascade — always available like placafipe */}
      <section className="panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <Table2 className="h-5 w-5 text-lp-accent" />
          <div>
            <h2 className="font-display text-lg font-bold">Consulta Tabela FIPE</h2>
            <p className="text-sm text-lp-steel">Escolha tipo, marca, modelo e ano — gratuito via proxy Parallelum.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Tipo">
            <select className="input-field" value={type} onChange={(e) => setType(e.target.value as FipeType)}>
              {TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Marca">
            <select className="input-field" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
              <option value="">Selecione</option>
              {brands.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Modelo">
            <select
              className="input-field"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              disabled={!brandId}
            >
              <option value="">Selecione</option>
              {models.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ano">
            <select
              className="input-field"
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
              disabled={!modelId}
            >
              <option value="">Selecione</option>
              {years.map((y) => (
                <option key={y.code} value={y.code}>
                  {y.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {loadingFipe ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-lp-steel">
            <Loader2 className="h-4 w-4 animate-spin" /> Consultando tabela FIPE…
          </div>
        ) : null}

        {activeDetail && fipeValue ? (
          <div className="mt-6 grid gap-3 rounded-xl border border-lp-line bg-lp-mist/50 p-4 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Marca" value={activeDetail.brand || '—'} />
            <Info label="Modelo" value={activeDetail.model || '—'} />
            <Info label="Ano / combustível" value={`${activeDetail.modelYear || '—'} · ${activeDetail.fuel || '—'}`} />
            <Info label="Código FIPE" value={activeDetail.codeFipe || '—'} />
            <Info label="Preço FIPE" value={formatCurrency(fipeValue)} />
            <Info label="Referência" value={activeDetail.referenceMonth || '—'} />
            <Info
              label="IPVA estimado"
              value={activeIpva ? `${formatCurrency(activeIpva.value)} (${activeIpva.uf})` : '—'}
            />
            <div className="flex items-end">
              <Button className="w-full" onClick={() => void applyToVehicle()}>
                <Car className="h-4 w-4" /> Usar este valor
              </Button>
            </div>
          </div>
        ) : null}
      </section>

      <p className="text-xs text-lp-steel">
        O LP Motors agrega a Tabela FIPE por provedor substituível (hoje: Parallelum via `/api/lp-motors`).
        Não somos a FIPE, Renavam ou Detran. Valores de IPVA são estimativas por alíquota estadual típica.
      </p>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label-field">{label}</span>
      {children}
    </label>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn('rounded-lg border border-lp-line bg-white px-3 py-2')}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-lp-steel">{label}</p>
      <p className="mt-1 text-sm font-semibold text-lp-ink">{value}</p>
    </div>
  )
}
