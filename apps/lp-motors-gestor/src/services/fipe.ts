import type { MarketQuote, VehicleMarketDataProvider } from '@/services/providers'

const API = '/api/lp-motors'

export type FipeType = 'cars' | 'motorcycles' | 'trucks'

export interface FipeOption {
  code: string
  name: string
}

export interface FipeDetail {
  brand?: string
  model?: string
  modelYear?: number
  fuel?: string
  codeFipe?: string
  price?: string
  referenceMonth?: string
  vehicleType?: string
  fuelAcronym?: string
}

export interface PlateConsultation {
  ok: boolean
  plate: string
  formats: { mercosul: string; antiga: string }
  source: string
  plateConfigured: boolean
  message?: string
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
  fipe?: FipeDetail | null
  ipva?: {
    uf: string
    rate: number
    aliquotPercent: number
    value: number
    base: number
  } | null
}

export interface FipeSearchHit {
  brand_name: string
  model_name: string
  model_year: number
  codigo_fipe: string
  price?: number | string
  reference_month?: string
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`)
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new Error((data as { error?: string }).error || `Erro ${res.status}`)
  return data
}

function parsePrice(price?: string): number {
  if (!price) return 0
  return Number(String(price).replace(/[^\d,]/g, '').replace(',', '.')) || 0
}

export const fipeService = {
  parsePrice,

  async brands(type: FipeType): Promise<FipeOption[]> {
    const data = await getJson<Array<{ code: string; name: string }>>(`/fipe/${type}/brands`)
    return (data || []).map((b) => ({ code: String(b.code), name: b.name }))
  },

  async models(type: FipeType, brandId: string): Promise<FipeOption[]> {
    const data = await getJson<Array<{ code: string; name: string }>>(
      `/fipe/${type}/brands/${brandId}/models`,
    )
    return (data || []).map((b) => ({ code: String(b.code), name: b.name }))
  },

  async years(type: FipeType, brandId: string, modelId: string): Promise<FipeOption[]> {
    const data = await getJson<Array<{ code: string; name: string }>>(
      `/fipe/${type}/brands/${brandId}/models/${modelId}/years`,
    )
    return (data || []).map((b) => ({ code: String(b.code), name: b.name }))
  },

  async detail(
    type: FipeType,
    brandId: string,
    modelId: string,
    yearId: string,
  ): Promise<FipeDetail> {
    return getJson<FipeDetail>(`/fipe/${type}/brands/${brandId}/models/${modelId}/years/${yearId}`)
  },

  async byFipeCode(type: FipeType, code: string, yearId: string): Promise<FipeDetail> {
    return getJson<FipeDetail>(`/fipe/${type}/fipe-code/${encodeURIComponent(code)}/years/${yearId}`)
  },

  async consultPlate(plate: string, uf = 'SP', type: FipeType = 'cars'): Promise<PlateConsultation> {
    const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '')
    return getJson<PlateConsultation>(
      `/placa/${encodeURIComponent(clean)}?uf=${encodeURIComponent(uf)}&type=${type}`,
    )
  },

  async search(q: string): Promise<FipeSearchHit[]> {
    const data = await getJson<{ results?: FipeSearchHit[] }>(
      `/fipe/search?q=${encodeURIComponent(q)}`,
    )
    return data.results || []
  },

  async estimateIpva(value: number, uf = 'SP') {
    const res = await fetch(`${API}/fipe/ipva`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, uf }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Falha ao estimar IPVA')
    return data as { uf: string; rate: number; aliquotPercent: number; value: number; base: number }
  },
}

/** Adapter Parallelum via nosso proxy — implementa VehicleMarketDataProvider. */
export class ParallelumMarketProvider implements VehicleMarketDataProvider {
  name = 'parallelum-proxy'

  isConfigured() {
    return true
  }

  async quote(input: {
    brand: string
    model: string
    year: number
    version?: string
  }): Promise<MarketQuote | null> {
    try {
      const brands = await fipeService.brands('cars')
      const brand = brands.find(
        (b) => b.name.toLowerCase() === input.brand.toLowerCase(),
      ) || brands.find((b) => b.name.toLowerCase().includes(input.brand.toLowerCase()))
      if (!brand) return null
      const models = await fipeService.models('cars', brand.code)
      const needle = `${input.model} ${input.version || ''}`.trim().toLowerCase()
      const model =
        models.find((m) => m.name.toLowerCase() === needle) ||
        models.find((m) => m.name.toLowerCase().includes(input.model.toLowerCase()))
      if (!model) return null
      const years = await fipeService.years('cars', brand.code, model.code)
      const year =
        years.find((y) => y.name.startsWith(String(input.year))) ||
        years.find((y) => y.code.startsWith(String(input.year)))
      if (!year) return null
      const detail = await fipeService.detail('cars', brand.code, model.code, year.code)
      const value = fipeService.parsePrice(detail.price)
      if (!value) return null
      return {
        brand: detail.brand || input.brand,
        model: detail.model || input.model,
        year: detail.modelYear || input.year,
        version: input.version,
        value,
        currency: 'BRL',
        reference: detail.referenceMonth || '',
        source: 'parallelum',
        fetchedAt: new Date().toISOString(),
      }
    } catch {
      return null
    }
  }
}
