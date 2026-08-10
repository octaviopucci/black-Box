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
