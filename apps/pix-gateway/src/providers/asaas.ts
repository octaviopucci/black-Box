import type {
  AsaasCredentials,
  CreateChargeInput,
  NormalizedWebhookEvent,
  ProviderCreateResult,
} from '../types.js'

export interface PixProvider {
  readonly kind: 'asaas'
  createCharge(input: CreateChargeInput, credentials: AsaasCredentials): Promise<ProviderCreateResult>
  getCharge(
    providerChargeId: string,
    credentials: AsaasCredentials,
  ): Promise<{
    status: 'pending' | 'paid' | 'expired' | 'cancelled' | 'refunded'
    paidAt: string | null
    raw: unknown
  }>
  parseWebhook(payload: unknown): NormalizedWebhookEvent | null
}

function asaasHeaders(apiKey: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    access_token: apiKey,
  }
}

function baseUrl(credentials: AsaasCredentials): string {
  return (credentials.apiUrl ?? 'https://api-sandbox.asaas.com').replace(/\/$/, '')
}

function mapAsaasStatus(status: string): 'pending' | 'paid' | 'expired' | 'cancelled' | 'refunded' {
  switch (status) {
    case 'RECEIVED':
    case 'CONFIRMED':
    case 'RECEIVED_IN_CASH':
      return 'paid'
    case 'REFUNDED':
    case 'REFUND_REQUESTED':
    case 'REFUND_IN_PROGRESS':
      return 'refunded'
    case 'DELETED':
      return 'cancelled'
    case 'OVERDUE':
      return 'expired'
    default:
      return 'pending'
  }
}

async function resolveCustomerId(
  credentials: AsaasCredentials,
  input: CreateChargeInput,
): Promise<string> {
  if (credentials.defaultCustomerId && !input.customerCpfCnpj) {
    return credentials.defaultCustomerId
  }

  if (!input.customerCpfCnpj) {
    throw new Error(
      'Informe customerCpfCnpj na cobrança ou cadastre defaultCustomerId na conta Asaas',
    )
  }

  const res = await fetch(`${baseUrl(credentials)}/v3/customers`, {
    method: 'POST',
    headers: asaasHeaders(credentials.apiKey),
    body: JSON.stringify({
      name: input.customerName ?? 'Cliente PIX',
      cpfCnpj: input.customerCpfCnpj.replace(/\D/g, ''),
      email: input.customerEmail,
    }),
  })

  const text = await res.text()
  if (!res.ok) {
    // Tenta reutilizar cliente existente pelo CPF
    const search = await fetch(
      `${baseUrl(credentials)}/v3/customers?cpfCnpj=${encodeURIComponent(input.customerCpfCnpj.replace(/\D/g, ''))}`,
      { headers: asaasHeaders(credentials.apiKey) },
    )
    if (search.ok) {
      const list = (await search.json()) as { data?: Array<{ id: string }> }
      if (list.data?.[0]?.id) return list.data[0].id
    }
    throw new Error(`Asaas customer failed (${res.status}): ${text}`)
  }

  const data = JSON.parse(text) as { id: string }
  return data.id
}

export const asaasProvider: PixProvider = {
  kind: 'asaas',

  async createCharge(input, credentials) {
    const customerId = await resolveCustomerId(credentials, input)

    const dueDate = new Date()
    const expiresIn = input.expiresInSeconds ?? 3600
    dueDate.setSeconds(dueDate.getSeconds() + expiresIn)
    const due = dueDate.toISOString().slice(0, 10)

    const paymentRes = await fetch(`${baseUrl(credentials)}/v3/payments`, {
      method: 'POST',
      headers: asaasHeaders(credentials.apiKey),
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        value: Number((input.amountCents / 100).toFixed(2)),
        dueDate: due,
        description: input.description ?? 'Cobrança PIX',
        externalReference: input.externalRef,
      }),
    })

    if (!paymentRes.ok) {
      const text = await paymentRes.text()
      throw new Error(`Asaas create payment failed (${paymentRes.status}): ${text}`)
    }

    const payment = (await paymentRes.json()) as { id: string }

    const qrRes = await fetch(`${baseUrl(credentials)}/v3/payments/${payment.id}/pixQrCode`, {
      method: 'GET',
      headers: asaasHeaders(credentials.apiKey),
    })

    if (!qrRes.ok) {
      const text = await qrRes.text()
      throw new Error(`Asaas pixQrCode failed (${qrRes.status}): ${text}`)
    }

    const qr = (await qrRes.json()) as {
      encodedImage?: string
      payload?: string
      expirationDate?: string
    }

    if (!qr.payload) {
      throw new Error('Asaas não retornou payload PIX (copia-e-cola)')
    }

    return {
      providerChargeId: payment.id,
      txid: payment.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 35),
      copyPaste: qr.payload,
      qrCodeBase64: qr.encodedImage ?? null,
      expiresAt: qr.expirationDate ?? dueDate.toISOString(),
      raw: { payment, qr },
    } satisfies ProviderCreateResult
  },

  async getCharge(providerChargeId, credentials) {
    const res = await fetch(`${baseUrl(credentials)}/v3/payments/${providerChargeId}`, {
      method: 'GET',
      headers: asaasHeaders(credentials.apiKey),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Asaas get payment failed (${res.status}): ${text}`)
    }
    const payment = (await res.json()) as {
      status: string
      paymentDate?: string
      confirmedDate?: string
      clientPaymentDate?: string
    }
    const status = mapAsaasStatus(payment.status)
    return {
      status,
      paidAt:
        status === 'paid'
          ? payment.confirmedDate ??
            payment.paymentDate ??
            payment.clientPaymentDate ??
            new Date().toISOString()
          : null,
      raw: payment,
    }
  },

  parseWebhook(payload: unknown) {
    if (!payload || typeof payload !== 'object') return null
    const body = payload as {
      event?: string
      payment?: {
        id?: string
        status?: string
        confirmedDate?: string
        paymentDate?: string
        clientPaymentDate?: string
      }
    }
    if (!body.payment?.id) return null
    const status = body.payment.status ? mapAsaasStatus(body.payment.status) : null
    return {
      eventType: body.event ?? 'UNKNOWN',
      providerChargeId: body.payment.id,
      status,
      paidAt:
        status === 'paid'
          ? body.payment.confirmedDate ??
            body.payment.paymentDate ??
            body.payment.clientPaymentDate ??
            new Date().toISOString()
          : null,
      raw: payload,
    }
  },
}

export function getProvider(kind: 'asaas'): PixProvider {
  if (kind === 'asaas') return asaasProvider
  throw new Error(`Provider não suportado: ${String(kind)}`)
}
