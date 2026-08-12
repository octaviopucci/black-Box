import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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
  type FipeSearchHit,
  type FipeType,
  type PlateConsultation,
} from '@/services/fipe'
import { getMarketProvider } from '@/services/providers'
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
  const cascadeRef = useRef<HTMLElement>(null)

  const [plate, setPlate] = useState('')
  const [uf, setUf] = useState('SP')
  const [type, setType] = useState<FipeType>('cars')
  const [loadingPlate, setLoadingPlate] = useState(false)
  const [plateResult, setPlateResult] = useState<PlateConsultation | null>(null)
  const [searched, setSearched] = useState(false)

  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<FipeSearchHit[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)

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
  const fipeValue = fipeService.parsePrice(detail?.price)

  useEffect(() => {
    if (linkedVehicle?.placa && !plate) setPlate(maskPlate(linkedVehicle.placa))
    if (linkedVehicle?.estado) setUf(linkedVehicle.estado)
    if (linkedVehicle) {
      setQuery(`${linkedVehicle.marca} ${linkedVehicle.modelo} ${linkedVehicle.anoModelo || linkedVehicle.ano}`)
    }
  }, [linkedVehicle, plate])

  // Auto FIPE for stock vehicle (marca/modelo/ano já conhecidos)
  useEffect(() => {
    if (!linkedVehicle?.marca || !linkedVehicle.modelo) return
    let cancelled = false
    ;(async () => {
      setLoadingFipe(true)
      try {
        const quote = await getMarketProvider().quote({
          brand: linkedVehicle.marca,
          model: linkedVehicle.modelo,
          year: linkedVehicle.anoModelo || linkedVehicle.ano,
          version: linkedVehicle.versao,
        })
        if (cancelled || !quote) return
        setDetail({
          brand: quote.brand,
          model: quote.model,
          modelYear: quote.year,
          price: quote.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          referenceMonth: quote.reference,
          codeFipe: '',
        })
        const est = await fipeService.estimateIpva(quote.value, uf)
        if (!cancelled) setIpva(est)
      } catch {
        /* manual cascade still available */
      } finally {
        if (!cancelled) setLoadingFipe(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [linkedVehicle?.id, linkedVehicle?.marca, linkedVehicle?.modelo, linkedVehicle?.anoModelo, linkedVehicle?.ano, linkedVehicle?.versao, uf])

  useEffect(() => {
    let cancelled = false
    setBrandId('')
    setModelId('')
    setYearId('')
    setModels([])
    setYears([])
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
    setHits([])
    setSearched(true)
    try {
      const result = await fipeService.consultPlate(clean, uf, type)
      setPlateResult(result)

      if (result.fipe) {
        setDetail(result.fipe)
        if (result.ipva) setIpva(result.ipva)
        if (result.fipeCandidates?.length) {
          setHits(
            result.fipeCandidates.map((c) => ({
              brand_name: c.brand,
              model_name: c.model,
              model_year: c.modelYear,
              codigo_fipe: c.fipeCode,
              fuel_name: c.fuel,
              price: c.price,
              value_label: c.priceLabel,
              reference_month: c.referenceMonth,
            })),
          )
        } else if (result.suggestions?.length) {
          setHits(result.suggestions)
        }
        toast(
          result.source === 'wdapi'
            ? 'Placa via API Placas · FIPE resolvida.'
            : result.source === 'placafipe'
              ? 'FIPE puxada pelo PlacaFIPE.'
              : 'FIPE encontrada pela placa.',
          'success',
        )
        return
      }

      // Só veículo (sem preço) — preenche busca e mostra sugestões
      if (result.ok && result.vehicle) {
        const q = `${result.vehicle.brand} ${result.vehicle.model} ${result.vehicle.modelYear || ''}`.trim()
        setQuery(q)
        if (result.suggestions?.length) {
          setHits(result.suggestions)
          toast('Veículo identificado. Escolha a versão FIPE abaixo.', 'info')
          return
        }
      }

      // Estoque local: já temos marca/modelo
      const local = vehicles.find(
        (v) => v.placa.replace(/[^A-Z0-9]/gi, '').toUpperCase() === clean,
      )
      if (local) {
        setQuery(`${local.marca} ${local.modelo} ${local.anoModelo || local.ano}`)
        toast('Placa no estoque LP Motors. Buscando FIPE do cadastro…', 'info')
        const quote = await getMarketProvider().quote({
          brand: local.marca,
          model: local.modelo,
          year: local.anoModelo || local.ano,
          version: local.versao,
        })
        if (quote) {
          setDetail({
            brand: quote.brand,
            model: quote.model,
            modelYear: quote.year,
            price: quote.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            referenceMonth: quote.reference,
          })
          setIpva(await fipeService.estimateIpva(quote.value, uf))
          toast('Valor FIPE carregado a partir do veículo do estoque.', 'success')
          return
        }
        const results = await fipeService.search(
          `${local.marca} ${local.modelo} ${local.anoModelo || local.ano}`,
        )
        setHits(results)
        if (results.length) {
          toast('Escolha a versão FIPE correspondente ao veículo do estoque.', 'info')
          return
        }
      }

      if (!result.plateConfigured) {
        toast(
          'Configure LP_MOTORS_PLATE_API_TOKEN (API Placas) no Vercel para puxar FIPE pela placa.',
          'info',
        )
      } else {
        toast(result.message || 'Placa sem FIPE. Busque pelo modelo abaixo.', 'info')
      }
      cascadeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Falha na consulta da placa', 'error')
    } finally {
      setLoadingPlate(false)
    }
  }

  const searchModel = async () => {
    if (query.trim().length < 2) {
      toast('Digite marca e modelo, ex.: Gol 2018', 'error')
      return
    }
    setLoadingSearch(true)
    try {
      const results = await fipeService.search(query.trim())
      setHits(results)
      if (!results.length) toast('Nenhum modelo encontrado. Tente outros termos.', 'info')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Falha na busca FIPE', 'error')
    } finally {
      setLoadingSearch(false)
    }
  }

  const pickHit = async (hit: FipeSearchHit) => {
    setLoadingFipe(true)
    try {
      const valueFromSearch = fipeService.hitPrice(hit)
      if (valueFromSearch > 0) {
        setDetail({
          brand: hit.brand_name,
          model: hit.model_name,
          modelYear: hit.model_year,
          codeFipe: hit.codigo_fipe,
          fuel: hit.fuel_name,
          price: valueFromSearch.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          referenceMonth: hit.reference_month || '',
        })
        setIpva(await fipeService.estimateIpva(valueFromSearch, uf))
        toast('Modelo selecionado.', 'success')
        return
      }
      if (hit.codigo_fipe) {
        const d = await fipeService.byFipeCode(type, hit.codigo_fipe, hit.model_year)
        setDetail(d)
        const value = fipeService.parsePrice(d.price)
        if (value > 0) setIpva(await fipeService.estimateIpva(value, uf))
        toast('FIPE carregada pelo código.', 'success')
        return
      }
      toast('Este resultado não trouxe preço nem código FIPE.', 'error')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Não foi possível carregar este modelo', 'error')
    } finally {
      setLoadingFipe(false)
    }
  }

  const applyToVehicle = async () => {
    const targetId = vehicleId || localMatch?.id
    if (!targetId) {
      toast('Cadastre o veículo ou abra a consulta a partir do estoque.', 'info')
      return
    }
    if (!fipeValue) {
      toast('Selecione um resultado FIPE antes de aplicar.', 'error')
      return
    }
    await updateVehicle(targetId, {
      precoFipe: fipeValue,
      marca: detail?.brand || undefined,
      modelo: detail?.model?.split(' ')[0] || undefined,
      versao: detail?.model || undefined,
      anoModelo: detail?.modelYear || undefined,
    })
    toast('Valor FIPE aplicado ao veículo.', 'success')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lp-accent">Mercado</p>
        <h1 className="section-title">Consulta FIPE pela placa</h1>
        <p className="section-sub">
          Caminho barato: token da API Placas (WDAPI) + FIPE gratuita. Sem token, busque pelo modelo abaixo.
        </p>
      </div>

      <section className="panel overflow-hidden">
        <div className="bg-lp-hero bg-lp-grid bg-grid px-4 py-8 sm:px-8">
          <div className="mx-auto max-w-2xl">
            <label className="label-field">1. Indique a placa</label>
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
          </div>
        </div>
      </section>

      {searched || fipeValue || linkedVehicle ? (
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="panel p-5 lg:col-span-2">
            <h2 className="font-display text-lg font-bold">Dados da consulta</h2>
            {localMatch ? (
              <p className="mt-2 text-sm text-lp-accent">
                Placa no estoque:{' '}
                <Link className="underline" to={`/veiculos/${localMatch.id}`}>
                  {localMatch.marca} {localMatch.modelo}
                </Link>
              </p>
            ) : null}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="Placa" value={plate ? maskPlate(plate) : '—'} />
              <Info
                label="Formatos"
                value={
                  plateResult
                    ? `${plateResult.formats.mercosul} · ${plateResult.formats.antiga}`
                    : '—'
                }
              />
              <Info label="Marca" value={detail?.brand || plateResult?.vehicle?.brand || linkedVehicle?.marca || '—'} />
              <Info
                label="Modelo"
                value={detail?.model || plateResult?.vehicle?.model || linkedVehicle?.modelo || '—'}
              />
              <Info
                label="Ano"
                value={
                  String(
                    detail?.modelYear ||
                      plateResult?.vehicle?.modelYear ||
                      linkedVehicle?.anoModelo ||
                      '—',
                  )
                }
              />
              <Info label="Código FIPE" value={detail?.codeFipe || plateResult?.vehicle?.fipeCode || '—'} />
            </div>

            {plateResult?.ok &&
            (plateResult.source === 'wdapi' ||
              plateResult.source === 'placafipe' ||
              plateResult.source === 'external') ? (
              <p className="mt-3 text-xs text-lp-accent">
                Fonte:{' '}
                {plateResult.source === 'wdapi'
                  ? 'API Placas (WDAPI)'
                  : plateResult.source === 'placafipe'
                    ? 'PlacaFIPE'
                    : 'Provedor de placa'}{' '}
                · {plateResult.message}
              </p>
            ) : null}

            {searched && !fipeValue && !plateResult?.plateConfigured ? (
              <div
                className="mt-4 border border-lp-line bg-lp-mist px-3 py-3 text-sm text-lp-ink"
                style={{ borderRadius: 'var(--lp-radius)' }}
              >
                <p className="font-semibold">Ativar FIPE pela placa (caminho barato)</p>
                <p className="mt-1 text-lp-steel">
                  1) Cadastre em{' '}
                  <a
                    className="text-lp-accent underline"
                    href="https://apiplacas.com.br/contratar.php"
                    target="_blank"
                    rel="noreferrer"
                  >
                    apiplacas.com.br
                  </a>{' '}
                  (~R$ 0,03/consulta).
                  <br />
                  2) No Vercel, adicione{' '}
                  <code className="bg-lp-paper px-1 text-xs">LP_MOTORS_PLATE_API_TOKEN</code> = seu
                  token e faça redeploy.
                  <br />
                  3) O app puxa marca/modelo pela placa e resolve a FIPE de graça.
                </p>
                <p className="mt-2 text-lp-steel">
                  Enquanto isso, use a <strong>busca por modelo</strong> abaixo (gratuita).
                </p>
              </div>
            ) : null}
          </div>

          <div className="panel-ink p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">Tabela FIPE</p>
            {loadingFipe ? (
              <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
                <Loader2 className="h-4 w-4 animate-spin" /> Consultando…
              </p>
            ) : (
              <>
                <p className="mt-2 font-display text-3xl font-bold text-white">
                  {fipeValue ? formatCurrency(fipeValue) : '—'}
                </p>
                <p className="mt-1 text-sm text-white/60">
                  {detail?.referenceMonth || (fipeValue ? '' : 'Aguardando seleção do veículo')}
                </p>
              </>
            )}
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                IPVA estimado ({ipva?.uf || uf})
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-teal-300">
                {ipva ? formatCurrency(ipva.value) : '—'}
              </p>
              {ipva ? (
                <p className="mt-1 text-xs text-white/45">
                  Alíquota {ipva.aliquotPercent.toFixed(2)}% sobre o valor FIPE (estimativa).
                </p>
              ) : null}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Button onClick={() => void applyToVehicle()} disabled={!fipeValue}>
                Aplicar FIPE no veículo
              </Button>
              <Link
                to={`/veiculos/novo?fipe=${encodeURIComponent(String(fipeValue || ''))}&placa=${encodeURIComponent(plate)}`}
              >
                <Button variant="secondary" className="w-full">
                  Cadastrar veículo com estes dados <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Busca rápida por modelo — caminho gratuito tipo PlacaFIPE */}
      <section ref={cascadeRef as never} className="panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-lp-accent" />
          <div>
            <h2 className="font-display text-lg font-bold">2. Buscar modelo na FIPE</h2>
            <p className="text-sm text-lp-steel">Ex.: “Civic 2020”, “Onix 1.0 2019”, “Hilux 2018”</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input-field"
            placeholder="Marca, modelo e ano"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void searchModel()}
          />
          <Button onClick={() => void searchModel()} disabled={loadingSearch}>
            {loadingSearch ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Buscar
          </Button>
        </div>
        {hits.length ? (
          <ul className="mt-4 divide-y divide-lp-line rounded-xl border border-lp-line">
            {hits.map((hit) => (
              <li key={`${hit.codigo_fipe}-${hit.model_year}-${hit.model_name}`}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-lp-mist"
                  onClick={() => void pickHit(hit)}
                >
                  <div>
                    <p className="font-semibold text-lp-ink">
                      {hit.brand_name} · {hit.model_name}
                    </p>
                    <p className="text-xs text-lp-steel">
                      {hit.model_year} · {hit.codigo_fipe}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-lp-accent">
                    {fipeService.hitPrice(hit) > 0
                      ? formatCurrency(fipeService.hitPrice(hit))
                      : 'Selecionar'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <Table2 className="h-5 w-5 text-lp-accent" />
          <div>
            <h2 className="font-display text-lg font-bold">3. Ou navegue na Tabela FIPE</h2>
            <p className="text-sm text-lp-steel">Tipo → marca → modelo → ano</p>
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

        {detail && fipeValue ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-lp-line bg-lp-mist/50 p-4">
            <div>
              <p className="font-semibold text-lp-ink">
                {detail.brand} {detail.model}
              </p>
              <p className="text-sm text-lp-steel">
                {detail.modelYear} · {formatCurrency(fipeValue)}
                {ipva ? ` · IPVA ~ ${formatCurrency(ipva.value)}` : ''}
              </p>
            </div>
            <Button onClick={() => void applyToVehicle()}>
              <Car className="h-4 w-4" /> Usar este valor
            </Button>
          </div>
        ) : null}
      </section>

      <p className="text-xs text-lp-steel">
        Valores FIPE via provedores públicos (Parallelum / tabelafipe.info). IPVA é estimativa por alíquota estadual.
        Identificação automática placa→dados requer provedor externo configurado no servidor.
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
