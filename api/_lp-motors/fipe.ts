/** Proxy helpers for FIPE (Parallelum) and optional plate lookup. Zero paid deps by default. */

const FIPE_BASE = 'https://fipe.parallelum.com.br/api/v2'

export type FipeVehicleType = 'cars' | 'motorcycles' | 'trucks'

export async function fipeFetch(path: string): Promise<{ ok: boolean; status: number; data: unknown }> {
  const url = `${FIPE_BASE}${path.startsWith('/') ? path : `/${path}`}`
  try {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (process.env.FIPE_API_TOKEN) {
      headers['X-Subscription-Token'] = process.env.FIPE_API_TOKEN
    }
    const res = await fetch(url, { headers })
    const data = await res.json().catch(() => null)
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    return {
      ok: false,
      status: 502,
      data: { error: err instanceof Error ? err.message : 'Falha ao consultar FIPE' },
    }
  }
}

function parseFipePrice(price?: string): number {
  if (!price) return 0
  return Number(String(price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
}

/**
 * Parallelum v2 path is `/{type}/{fipeCode}/years`, NOT `/fipe-code/...`.
 * Year ids are `{ano}-{combustivel}` (ex.: 2009-5 = Flex) — never assume `-1`.
 */
export async function fipeDetailByCode(
  type: FipeVehicleType,
  fipeCode: string,
  modelYear?: number,
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const code = encodeURIComponent(String(fipeCode).trim())
  const yearsRes = await fipeFetch(`/${type}/${code}/years`)
  if (!yearsRes.ok || !Array.isArray(yearsRes.data)) {
    return {
      ok: false,
      status: yearsRes.status || 404,
      data: (yearsRes.data as { error?: string }) || {
        error: 'Não foi possível listar anos para este código FIPE.',
      },
    }
  }
  const years = yearsRes.data as Array<{ code?: string; name?: string }>
  if (!years.length) {
    return { ok: false, status: 404, data: { error: 'Código FIPE sem anos disponíveis.' } }
  }

  let match = years[0]
  if (modelYear) {
    const y = String(modelYear)
    match =
      years.find((item) => String(item.code || '').startsWith(`${y}-`)) ||
      years.find((item) => String(item.name || '').startsWith(y)) ||
      years[0]
  }

  const yearId = String(match?.code || '')
  if (!yearId) {
    return { ok: false, status: 404, data: { error: 'Ano FIPE não encontrado para este código.' } }
  }
  return fipeFetch(`/${type}/${code}/years/${encodeURIComponent(yearId)}`)
}

export function normalizeTextSearchResults(raw: unknown): {
  query?: string
  count: number
  results: Array<{
    brand_name: string
    model_name: string
    model_year: number
    codigo_fipe: string
    fuel_name?: string
    price?: number
    value_label?: string
    reference_month?: string
    url_path?: string
  }>
} {
  const payload = (raw && typeof raw === 'object' ? raw : {}) as {
    query?: string
    count?: number
    results?: Array<Record<string, unknown>>
  }
  const results = (payload.results || []).map((hit) => {
    const valueLabel = String(hit.value_label || hit.price_label || hit.price || '')
    const price =
      typeof hit.price === 'number'
        ? hit.price
        : parseFipePrice(valueLabel) || parseFipePrice(String(hit.price || ''))
    return {
      brand_name: String(hit.brand_name || hit.brand || ''),
      model_name: String(hit.model_name || hit.model || ''),
      model_year: Number(hit.model_year || hit.year || 0) || 0,
      codigo_fipe: String(hit.codigo_fipe || hit.code_fipe || hit.codeFipe || ''),
      fuel_name: hit.fuel_name ? String(hit.fuel_name) : undefined,
      price: price || undefined,
      value_label: valueLabel || undefined,
      reference_month: hit.reference_month ? String(hit.reference_month) : undefined,
      url_path: hit.url_path ? String(hit.url_path) : undefined,
    }
  })
  return {
    query: payload.query,
    count: payload.count ?? results.length,
    results,
  }
}

/** Busca textual gratuita (tabelafipe.info) — marca/modelo/ano → código FIPE + preço. */
export async function fipeTextSearch(q: string): Promise<{ ok: boolean; status: number; data: unknown }> {
  const url = `https://tabelafipe.info/api/busca?q=${encodeURIComponent(q)}`
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'LPMotorsGestor/1.0' },
    })
    const data = await res.json().catch(() => null)
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    return {
      ok: false,
      status: 502,
      data: { error: err instanceof Error ? err.message : 'Falha na busca FIPE' },
    }
  }
}

export function normalizePlate(raw: string): string {
  return String(raw || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 7)
}

/** Converte ABC1D23 ↔ ABC1234 quando possível (heurística Mercosul). */
export function plateFormats(plate: string): { mercosul: string; antiga: string; input: string } {
  const p = normalizePlate(plate)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  // Mercosul: AAA1A23
  if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(p)) {
    const digitMap: Record<string, string> = {
      A: '0',
      B: '1',
      C: '2',
      D: '3',
      E: '4',
      F: '5',
      G: '6',
      H: '7',
      I: '8',
      J: '9',
    }
    const fourthLetter = p[4]
    const antiga = `${p.slice(0, 3)}${p[3]}${digitMap[fourthLetter] ?? p[4]}${p.slice(5)}`
    return { mercosul: p, antiga, input: p }
  }
  // Antiga: AAA1234
  if (/^[A-Z]{3}[0-9]{4}$/.test(p)) {
    const digit = p[4]
    const letter = letters[Number(digit)] || 'A'
    const mercosul = `${p.slice(0, 3)}${p[3]}${letter}${p.slice(5)}`
    return { mercosul, antiga: p, input: p }
  }
  return { mercosul: p, antiga: p, input: p }
}

export interface PlateFipeCandidate {
  brand: string
  model: string
  modelYear: number
  fipeCode: string
  fuel?: string
  price: number
  priceLabel: string
  referenceMonth?: string
  similarity?: number
}

export interface PlateLookupResult {
  ok: boolean
  plate: string
  formats: { mercosul: string; antiga: string }
  source: string
  vehicle?: {
    brand: string
    model: string
    modelYear?: number
    manufactureYear?: number
    version?: string
    fuel?: string
    fipeCode?: string
    city?: string
    state?: string
    color?: string
  }
  /** Opções FIPE retornadas pelo PlacaFIPE (já com preço). */
  fipeCandidates?: PlateFipeCandidate[]
  /** Melhor match já escolhido. */
  bestFipe?: PlateFipeCandidate | null
  message?: string
}

/** Template padrão WDAPI2 (API Placas) — caminho barato recomendado. */
export const DEFAULT_WDAPI_URL = 'https://wdapi2.com.br/consulta/{plate}/{token}'

export type PlateProviderKind = 'wdapi' | 'placafipe' | 'custom' | 'none'

export function resolvePlateProvider(): PlateProviderKind {
  if (process.env.LP_MOTORS_PLACAFIP_TOKEN || process.env.PLACAFIP_TOKEN) return 'placafipe'
  const url = process.env.LP_MOTORS_PLATE_API_URL || ''
  const token = process.env.LP_MOTORS_PLATE_API_TOKEN || ''
  if (url.includes('wdapi') || (!url && token)) return 'wdapi'
  if (url) return 'custom'
  return 'none'
}

export function plateProviderConfigured(): boolean {
  return resolvePlateProvider() !== 'none'
}

function plateApiUrlTemplate(): string {
  const url = process.env.LP_MOTORS_PLATE_API_URL || ''
  if (url) return url
  // Só o token → assume WDAPI2 (mais barato)
  if (process.env.LP_MOTORS_PLATE_API_TOKEN) return DEFAULT_WDAPI_URL
  return ''
}

function parseMoney(raw: unknown): number {
  if (typeof raw === 'number') return raw
  return Number(String(raw || '').replace(/[^\d,.-]/g, '').replace(',', '.')) || 0
}

function pickBestCandidate(list: PlateFipeCandidate[]): PlateFipeCandidate | null {
  if (!list.length) return null
  return [...list].sort((a, b) => (b.similarity || 0) - (a.similarity || 0) || b.price - a.price)[0]
}

function splitBrandModel(raw: string): { brand: string; model: string } {
  const cleaned = raw.trim()
  if (!cleaned) return { brand: '', model: '' }
  const parts = cleaned.split('/')
  if (parts.length >= 2) {
    return { brand: parts[0].trim(), model: parts.slice(1).join('/').trim() }
  }
  const sp = cleaned.split(/\s+/)
  if (sp.length >= 2) return { brand: sp[0], model: sp.slice(1).join(' ') }
  return { brand: cleaned, model: '' }
}

function parseYearPair(raw: unknown): { manufactureYear?: number; modelYear?: number } {
  const s = String(raw || '').trim()
  if (!s) return {}
  const m = s.match(/(\d{4})\s*[\/\-]\s*(\d{4})/)
  if (m) return { manufactureYear: Number(m[1]), modelYear: Number(m[2]) }
  const y = Number(s.replace(/\D/g, '').slice(0, 4))
  return y ? { modelYear: y } : {}
}

function extractFipeRows(data: Record<string, unknown>): Record<string, unknown>[] {
  const candidates: unknown[] = []
  const push = (v: unknown) => {
    if (Array.isArray(v)) candidates.push(...v)
    else if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>
      if (Array.isArray(o.dados)) candidates.push(...o.dados)
      else if (Array.isArray(o.data)) candidates.push(...o.data)
      else if (Array.isArray(o.fipe)) candidates.push(...o.fipe)
      else if (Array.isArray(o.fipes)) candidates.push(...o.fipes)
    }
  }
  push(data.fipe)
  push(data.fipes)
  push(data.FIPE)
  push((data.extra as Record<string, unknown> | undefined)?.fipe)
  push((data.data as Record<string, unknown> | undefined)?.fipes)
  push((data.data as Record<string, unknown> | undefined)?.fipe)
  return candidates.filter((x): x is Record<string, unknown> => Boolean(x) && typeof x === 'object')
}

/**
 * Provedor nativo PlacaFIPE — https://api.placafipe.com.br/getplacafipe
 * Env: LP_MOTORS_PLACAFIP_TOKEN (ou PLACAFIP_TOKEN)
 */
export async function lookupPlatePlacaFipe(plate: string): Promise<PlateLookupResult> {
  const formats = plateFormats(plate)
  const normalized = formats.input
  const token =
    process.env.LP_MOTORS_PLACAFIP_TOKEN ||
    process.env.PLACAFIP_TOKEN ||
    process.env.LP_MOTORS_PLATE_API_TOKEN ||
    ''

  if (!token) {
    return {
      ok: false,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: 'none',
      message: 'Token PlacaFIPE não configurado.',
    }
  }

  try {
    const res = await fetch('https://api.placafipe.com.br/getplacafipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ placa: normalized, token }),
    })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    const code = Number(data.codigo ?? 0)
    if (!res.ok || (code !== 0 && code !== 1 && code !== 22)) {
      return {
        ok: false,
        plate: normalized,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        source: 'placafipe',
        message: String(
          data.msg || data.message || data.error || `PlacaFIPE retornou ${res.status}`,
        ),
      }
    }

    const info = (data.informacoes_veiculo || {}) as Record<string, unknown>
    const brand = String(info.marca || '')
    const model = String(info.modelo || '')
    const modelYear = Number(info.ano_modelo || info.ano || 0) || undefined
    const manufactureYear = Number(info.ano || info.ano_fabricacao || 0) || undefined

    const rawFipe = Array.isArray(data.fipe) ? data.fipe : []
    const fipeCandidates: PlateFipeCandidate[] = rawFipe
      .map((row) => {
        const item = row as Record<string, unknown>
        const price = parseMoney(item.valor)
        const unit = String(item.unidade_valor || 'R$')
        return {
          brand: String(item.marca || brand),
          model: String(item.modelo || model),
          modelYear: Number(item.ano_modelo || modelYear || 0) || 0,
          fipeCode: String(item.codigo_fipe || ''),
          fuel: item.combustivel ? String(item.combustivel) : undefined,
          price,
          priceLabel:
            price > 0
              ? `${unit} ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              : '',
          referenceMonth: item.mes_referencia ? String(item.mes_referencia) : undefined,
          similarity: Number(item.similaridade || item.correspondencia || 0) || 0,
        }
      })
      .filter((c) => c.fipeCode || c.price > 0)

    const bestFipe = pickBestCandidate(fipeCandidates)

    if (!brand && !model && !fipeCandidates.length) {
      return {
        ok: false,
        plate: normalized,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        source: 'placafipe',
        message: String(data.msg || 'PlacaFIPE não encontrou veículo para esta placa.'),
      }
    }

    return {
      ok: true,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: 'placafipe',
      vehicle: {
        brand,
        model,
        version: model,
        modelYear,
        manufactureYear,
        fipeCode: bestFipe?.fipeCode,
        fuel: String(info.combustivel || bestFipe?.fuel || '') || undefined,
        city: info.municipio ? String(info.municipio) : undefined,
        state: info.uf ? String(info.uf) : undefined,
        color: info.cor ? String(info.cor) : undefined,
      },
      fipeCandidates,
      bestFipe,
      message: String(data.msg || 'Veículo encontrado no PlacaFIPE'),
    }
  } catch (err) {
    return {
      ok: false,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: 'placafipe',
      message: err instanceof Error ? err.message : 'Falha ao consultar PlacaFIPE',
    }
  }
}

/**
 * Caminho barato: WDAPI2 / API Placas (ou outro template).
 *
 * Env recomendada (só o token):
 *   LP_MOTORS_PLATE_API_TOKEN=<token>
 *   → usa https://wdapi2.com.br/consulta/{plate}/{token}
 *
 * Ou template custom:
 *   LP_MOTORS_PLATE_API_URL=https://wdapi2.com.br/consulta/{plate}/{token}
 *   LP_MOTORS_PLATE_API_TOKEN=...
 *
 * Depois o backend resolve FIPE de graça (Parallelum) por código ou marca/modelo.
 */
export async function lookupPlateGeneric(plate: string): Promise<PlateLookupResult> {
  const formats = plateFormats(plate)
  const normalized = formats.input
  const template = plateApiUrlTemplate()
  const provider = resolvePlateProvider() === 'wdapi' ? 'wdapi' : 'external'

  if (!template) {
    return {
      ok: false,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: 'none',
      message: 'Provedor de placa não configurado.',
    }
  }

  const token = process.env.LP_MOTORS_PLATE_API_TOKEN || ''
  const url = template
    .replace('{plate}', encodeURIComponent(normalized))
    .replace('{placa}', encodeURIComponent(normalized))
    .replace('{mercosul}', encodeURIComponent(formats.mercosul))
    .replace('{antiga}', encodeURIComponent(formats.antiga))
    .replace('{token}', encodeURIComponent(token))

  try {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (token && !template.includes('{token}')) {
      headers.Authorization = `Bearer ${token}`
    }
    const res = await fetch(url, { headers })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        plate: normalized,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        source: provider,
        message: String(data.error || data.message || data.mensagem || `Provedor de placa retornou ${res.status}`),
      }
    }

    const nested = (data.informacoes_veiculo ||
      data.vehicle ||
      data.veiculo ||
      (data.data as Record<string, unknown> | undefined)?.veiculo ||
      data.dados ||
      data.extra ||
      data) as Record<string, unknown>

    let brand = String(
      nested.brand || nested.marca || nested.MARCA || data.brand || data.marca || data.MARCA || '',
    )
    let model = String(
      nested.model || nested.modelo || nested.MODELO || data.model || data.modelo || data.MODELO || '',
    )
    const marcaModelo = String(
      nested.marcaModelo ||
        nested.marca_modelo ||
        nested.MARCA_MODELO ||
        data.marcaModelo ||
        data.marca_modelo ||
        '',
    )
    if ((!brand || !model) && marcaModelo) {
      const split = splitBrandModel(marcaModelo)
      brand = brand || split.brand
      model = model || split.model
    }

    const version = String(nested.version || nested.versao || model || '')
    const yearFromAno = parseYearPair(nested.ano || nested.ANO || data.ano)
    const modelYear =
      Number(nested.modelYear || nested.anoModelo || nested.ano_modelo || nested.AnoModelo || 0) ||
      yearFromAno.modelYear ||
      undefined
    const manufactureYear =
      Number(
        nested.manufactureYear || nested.anoFabricacao || nested.ano_fabricacao || nested.AnoFabricacao || 0,
      ) ||
      yearFromAno.manufactureYear ||
      undefined

    const fipeRows = extractFipeRows(data)
    const fipeCandidates: PlateFipeCandidate[] = fipeRows
      .map((item) => {
        const price = parseMoney(item.valor || item.preco || item.price || item.valor_fipe)
        const code = String(item.codigo_fipe || item.codigoFipe || item.codigo || item.fipe_codigo || '')
        const rowBrand = String(item.marca || item.texto_marca || brand)
        const rowModel = String(
          item.modelo || item.texto_modelo || item.marca_modelo || item.modelo_versao || model,
        )
        return {
          brand: rowBrand,
          model: rowModel,
          modelYear: Number(item.ano_modelo || item.anoModelo || modelYear || 0) || 0,
          fipeCode: code,
          fuel: item.combustivel ? String(item.combustivel) : undefined,
          price,
          priceLabel:
            price > 0
              ? `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
              : '',
          referenceMonth: item.mes_referencia
            ? String(item.mes_referencia)
            : item.mesReferencia
              ? String(item.mesReferencia)
              : undefined,
          similarity: Number(item.score || item.similaridade || item.correspondencia || 0) || 0,
        }
      })
      .filter((c) => c.fipeCode || c.price > 0)

    const bestFipe = pickBestCandidate(fipeCandidates)
    const fipeCode =
      bestFipe?.fipeCode ||
      String(nested.fipeCode || nested.codigoFipe || nested.codigo_fipe || data.codigo_fipe || '') ||
      undefined

    if (!brand && !model && !fipeCode && !fipeCandidates.length) {
      return {
        ok: false,
        plate: normalized,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        source: provider,
        message: 'Provedor não retornou marca/modelo/código FIPE para esta placa.',
      }
    }

    return {
      ok: true,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: provider,
      vehicle: {
        brand,
        model,
        version,
        fipeCode,
        modelYear,
        manufactureYear,
        fuel: String(nested.fuel || nested.combustivel || nested.COMBUSTIVEL || '') || undefined,
        city: String(nested.city || nested.municipio || nested.MUNICIPIO || '') || undefined,
        state: String(nested.state || nested.uf || nested.UF || '') || undefined,
        color: nested.cor || nested.COR ? String(nested.cor || nested.COR) : undefined,
      },
      fipeCandidates: fipeCandidates.length ? fipeCandidates : undefined,
      bestFipe,
      message:
        provider === 'wdapi'
          ? 'Veículo identificado via API Placas (WDAPI). FIPE resolvida no LP Motors.'
          : 'Veículo identificado no provedor de placa.',
    }
  } catch (err) {
    return {
      ok: false,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: provider,
      message: err instanceof Error ? err.message : 'Falha na consulta de placa',
    }
  }
}

/**
 * Orquestra provedores:
 * 1) PlacaFIPE (se token — mais caro, FIPE pronta)
 * 2) WDAPI / custom (barato) → FIPE grátis via Parallelum
 */
export async function lookupPlateExternal(plate: string): Promise<PlateLookupResult> {
  const formats = plateFormats(plate)
  const normalized = formats.input

  if (process.env.LP_MOTORS_PLACAFIP_TOKEN || process.env.PLACAFIP_TOKEN) {
    const r = await lookupPlatePlacaFipe(plate)
    if (r.ok || r.source === 'placafipe') return r
  }

  if (plateApiUrlTemplate()) {
    return lookupPlateGeneric(plate)
  }

  return {
    ok: false,
    plate: normalized,
    formats: { mercosul: formats.mercosul, antiga: formats.antiga },
    source: 'none',
    message:
      'Para FIPE pela placa no caminho barato: cadastre em apiplacas.com.br, coloque LP_MOTORS_PLATE_API_TOKEN no Vercel e redeploy. Sem token, use a busca por modelo (gratuita).',
  }
}

/** Alíquotas padrão de IPVA (estimativa — regras locais podem variar). */
export const DEFAULT_IPVA_RATES: Record<string, number> = {
  AC: 0.02,
  AL: 0.03,
  AM: 0.03,
  AP: 0.03,
  BA: 0.025,
  CE: 0.03,
  DF: 0.03,
  ES: 0.02,
  GO: 0.0375,
  MA: 0.025,
  MG: 0.04,
  MS: 0.03,
  MT: 0.03,
  PA: 0.025,
  PB: 0.025,
  PE: 0.03,
  PI: 0.025,
  PR: 0.035,
  RJ: 0.04,
  RN: 0.03,
  RO: 0.03,
  RR: 0.03,
  RS: 0.03,
  SC: 0.02,
  SE: 0.025,
  SP: 0.04,
  TO: 0.02,
}

export function estimateIpva(fipeValue: number, uf = 'SP') {
  const rate = DEFAULT_IPVA_RATES[uf.toUpperCase()] ?? 0.03
  const value = Math.round(fipeValue * rate * 100) / 100
  return { uf: uf.toUpperCase(), rate, aliquotPercent: rate * 100, value, base: fipeValue }
}
