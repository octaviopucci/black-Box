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
  }
  message?: string
}

/**
 * Optional external plate API.
 * Configure LP_MOTORS_PLATE_API_URL as a template, e.g.:
 *   https://seu-provedor.example/placa/{plate}
 * Expected JSON fields (flexible): marca/brand, modelo/model, ano/anoModelo, codigoFipe/fipeCode
 */
export async function lookupPlateExternal(plate: string): Promise<PlateLookupResult> {
  const formats = plateFormats(plate)
  const normalized = formats.input
  const template = process.env.LP_MOTORS_PLATE_API_URL || ''

  if (!template) {
    return {
      ok: false,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: 'none',
      message:
        'Consulta automática por placa não configurada. Use a seleção FIPE abaixo (marca → modelo → ano) — gratuita.',
    }
  }

  const url = template
    .replace('{plate}', encodeURIComponent(normalized))
    .replace('{placa}', encodeURIComponent(normalized))
    .replace('{mercosul}', encodeURIComponent(formats.mercosul))
    .replace('{antiga}', encodeURIComponent(formats.antiga))

  try {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (process.env.LP_MOTORS_PLATE_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.LP_MOTORS_PLATE_API_TOKEN}`
    }
    const res = await fetch(url, { headers })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return {
        ok: false,
        plate: normalized,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        source: 'external',
        message: String(data.error || data.message || `Provedor de placa retornou ${res.status}`),
      }
    }

    const brand = String(data.brand || data.marca || data.Brand || '')
    const model = String(data.model || data.modelo || data.Model || '')
    const version = String(data.version || data.versao || data.Version || '')
    const fipeCode = String(data.fipeCode || data.codigoFipe || data.codigo_fipe || '')
    const modelYear = Number(data.modelYear || data.anoModelo || data.ano_modelo || data.ano || 0) || undefined
    const manufactureYear =
      Number(data.manufactureYear || data.anoFabricacao || data.ano_fabricacao || 0) || undefined

    if (!brand && !model && !fipeCode) {
      return {
        ok: false,
        plate: normalized,
        formats: { mercosul: formats.mercosul, antiga: formats.antiga },
        source: 'external',
        message: 'Provedor não retornou marca/modelo/código FIPE para esta placa.',
      }
    }

    return {
      ok: true,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: 'external',
      vehicle: {
        brand,
        model,
        version,
        fipeCode: fipeCode || undefined,
        modelYear,
        manufactureYear,
        fuel: String(data.fuel || data.combustivel || '') || undefined,
        city: String(data.city || data.municipio || '') || undefined,
        state: String(data.state || data.uf || '') || undefined,
      },
    }
  } catch (err) {
    return {
      ok: false,
      plate: normalized,
      formats: { mercosul: formats.mercosul, antiga: formats.antiga },
      source: 'external',
      message: err instanceof Error ? err.message : 'Falha na consulta de placa',
    }
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
