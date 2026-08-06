export type ProviderKind = 'native' | 'asaas'

export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'phone' | 'evp'

export type ChargeStatus = 'pending' | 'paid' | 'expired' | 'cancelled' | 'refunded'

export type RoutingStrategy =
  | 'explicit'
  | 'round_robin'
  | 'least_used_today'

export interface AccountRecord {
  id: string
  name: string
  provider: ProviderKind
  /** native: merchantName/city/webhookToken | asaas: apiKey/... */
  credentialsJson: string
  active: number
  createdAt: string
  updatedAt: string
}

export interface PixKeyRecord {
  id: string
  accountId: string
  label: string
  keyType: PixKeyType
  keyValue: string
  active: number
  createdAt: string
}

export interface ChargeRecord {
  id: string
  accountId: string
  pixKeyId: string | null
  provider: ProviderKind
  providerChargeId: string | null
  txid: string
  amountCents: number
  description: string | null
  status: ChargeStatus
  copyPaste: string | null
  qrCodeBase64: string | null
  expiresAt: string | null
  paidAt: string | null
  externalRef: string | null
  idempotencyKey: string | null
  rawJson: string | null
  createdAt: string
  updatedAt: string
}

export interface WebhookEventRecord {
  id: string
  accountId: string | null
  provider: ProviderKind
  eventType: string
  providerChargeId: string | null
  payloadJson: string
  processed: number
  createdAt: string
}

/** Conta gratuita: Pix cai direto na sua chave. Sem taxa de PSP. */
export interface NativeCredentials {
  merchantName: string
  merchantCity: string
  /** Token para autenticar webhooks de Pix recebido */
  webhookToken?: string
}

export interface AsaasCredentials {
  apiKey: string
  apiUrl?: string
  webhookToken?: string
  defaultCustomerId?: string
}

export interface CreateChargeInput {
  amountCents: number
  description?: string
  expiresInSeconds?: number
  accountId?: string
  pixKeyId?: string
  routing?: RoutingStrategy
  externalRef?: string
  customerName?: string
  customerCpfCnpj?: string
  customerEmail?: string
}

export interface ProviderCreateResult {
  providerChargeId: string
  txid: string
  copyPaste: string
  qrCodeBase64: string | null
  expiresAt: string | null
  raw: unknown
}

export interface NormalizedWebhookEvent {
  eventType: string
  providerChargeId: string
  status: ChargeStatus | null
  paidAt: string | null
  raw: unknown
  matchTxid?: string
}
