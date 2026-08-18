import { getSellerPlan, type SellerPlanId } from '@/lib/plans'

const MP_API = 'https://api.mercadopago.com'

export type PixCharge = {
  provider: 'mercadopago' | 'sandbox'
  providerPaymentId: string
  pixCopyPaste: string
  pixQrBase64: string | null
  pixExpiresAt: Date
  amount: number
}

function sandboxPayload(plan: SellerPlanId, amount: number): string {
  return `CBX:${plan}:${amount.toFixed(2)}:${Date.now()}`
}

export function hasMercadoPago(): boolean {
  return Boolean(process.env.MP_ACCESS_TOKEN)
}

export async function createPixCharge(input: {
  plan: SellerPlanId
  email: string
  name: string
}): Promise<PixCharge> {
  const plan = getSellerPlan(input.plan)
  if (!plan) throw new Error('Plano inválido')

  const expires = new Date(Date.now() + 30 * 60 * 1000)

  if (!hasMercadoPago()) {
    const payload = sandboxPayload(input.plan, plan.price)
    return {
      provider: 'sandbox',
      providerPaymentId: `sandbox-${crypto.randomUUID()}`,
      pixCopyPaste: payload,
      pixQrBase64: null,
      pixExpiresAt: expires,
      amount: plan.price,
    }
  }

  const res = await fetch(`${MP_API}/v1/payments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      transaction_amount: plan.price,
      description: `CBX ${plan.name} — mensalidade 30 dias`,
      payment_method_id: 'pix',
      date_of_expiration: expires.toISOString(),
      payer: {
        email: input.email,
        first_name: input.name.split(' ')[0],
      },
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('Mercado Pago Pix error', data)
    throw new Error(data.message || 'Falha ao gerar Pix')
  }

  const tx = data.point_of_interaction?.transaction_data
  return {
    provider: 'mercadopago',
    providerPaymentId: String(data.id),
    pixCopyPaste: tx?.qr_code || '',
    pixQrBase64: tx?.qr_code_base64 || null,
    pixExpiresAt: data.date_of_expiration ? new Date(data.date_of_expiration) : expires,
    amount: plan.price,
  }
}

export async function fetchMercadoPagoPayment(id: string): Promise<{
  id: string
  status: string
} | null> {
  if (!hasMercadoPago()) return null
  const res = await fetch(`${MP_API}/v1/payments/${id}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  })
  if (!res.ok) return null
  const data = await res.json()
  return { id: String(data.id), status: data.status }
}
