/**
 * Abstração para provedores de dados de mercado (FIPE e equivalentes).
 * Troque a implementação sem alterar a UI.
 */
export interface MarketQuote {
  brand: string
  model: string
  year: number
  version?: string
  value: number
  currency: 'BRL'
  reference: string
  source: string
  fetchedAt: string
}

export interface VehicleMarketDataProvider {
  name: string
  isConfigured(): boolean
  quote(input: {
    brand: string
    model: string
    year: number
    version?: string
  }): Promise<MarketQuote | null>
}

/** Stub gratuito — retorna null até um provedor autorizado ser configurado. */
export class NullMarketDataProvider implements VehicleMarketDataProvider {
  name = 'null'
  isConfigured() {
    return false
  }
  async quote(): Promise<MarketQuote | null> {
    return null
  }
}

/**
 * Consultas veiculares externas (multas, IPVA, restrições, sinistro, etc.).
 * Nenhuma API paga é chamada automaticamente.
 */
export type VehicleInquiryKind =
  | 'multas'
  | 'ipva'
  | 'licenciamento'
  | 'restricoes'
  | 'gravame'
  | 'historico'
  | 'sinistro'
  | 'leilao'
  | 'roubo_furto'
  | 'recall'

export interface VehicleInquiryResult {
  kind: VehicleInquiryKind
  ok: boolean
  summary: string
  raw?: unknown
  provider: string
  fetchedAt: string
}

export interface VehicleInquiryProvider {
  name: string
  supported: VehicleInquiryKind[]
  isConfigured(): boolean
  inquire(kind: VehicleInquiryKind, plate: string): Promise<VehicleInquiryResult>
}

export class NullInquiryProvider implements VehicleInquiryProvider {
  name = 'null'
  supported: VehicleInquiryKind[] = [
    'multas',
    'ipva',
    'licenciamento',
    'restricoes',
    'gravame',
    'historico',
    'sinistro',
    'leilao',
    'roubo_furto',
    'recall',
  ]
  isConfigured() {
    return false
  }
  async inquire(kind: VehicleInquiryKind, plate: string): Promise<VehicleInquiryResult> {
    return {
      kind,
      ok: false,
      summary: `Consulta de ${kind} para ${plate} não configurada. Integração preparada — nenhum provedor pago ativo.`,
      provider: this.name,
      fetchedAt: new Date().toISOString(),
    }
  }
}

let marketProvider: VehicleMarketDataProvider = new NullMarketDataProvider()
let inquiryProvider: VehicleInquiryProvider = new NullInquiryProvider()

export function getMarketProvider() {
  return marketProvider
}

export function setMarketProvider(provider: VehicleMarketDataProvider) {
  marketProvider = provider
}

export function getInquiryProvider() {
  return inquiryProvider
}

export function setInquiryProvider(provider: VehicleInquiryProvider) {
  inquiryProvider = provider
}
