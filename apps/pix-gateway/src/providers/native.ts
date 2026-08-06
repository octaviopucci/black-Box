import QRCode from 'qrcode'
import { customAlphabet } from 'nanoid'
import { buildPixBrCode } from '../utils/brcode.js'
import type {
  CreateChargeInput,
  NativeCredentials,
  NormalizedWebhookEvent,
  PixKeyRecord,
  ProviderCreateResult,
} from '../types.js'

const txidAlphabet = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 20)

export interface NativeChargeContext {
  credentials: NativeCredentials
  pixKey: PixKeyRecord
}

export async function nativeCreateCharge(
  input: CreateChargeInput,
  ctx: NativeChargeContext,
): Promise<ProviderCreateResult> {
  const txid = txidAlphabet()
  const copyPaste = buildPixBrCode({
    pixKey: ctx.pixKey.keyValue,
    amountCents: input.amountCents,
    merchantName: ctx.credentials.merchantName,
    merchantCity: ctx.credentials.merchantCity,
    txid,
    description: input.description,
  })

  let qrCodeBase64: string | null = null
  try {
    const dataUrl = await QRCode.toDataURL(copyPaste, { margin: 1, width: 280 })
    qrCodeBase64 = dataUrl.replace(/^data:image\/png;base64,/, '')
  } catch {
    qrCodeBase64 = null
  }

  const expiresAt = new Date(
    Date.now() + (input.expiresInSeconds ?? 3600) * 1000,
  ).toISOString()

  return {
    providerChargeId: txid,
    txid,
    copyPaste,
    qrCodeBase64,
    expiresAt,
    raw: {
      mode: 'native',
      pixKeyId: ctx.pixKey.id,
      keyType: ctx.pixKey.keyType,
      fee: 0,
    },
  }
}

/**
 * Aceita notificações no formato Bacen (lista pix) e formatos simplificados.
 * Confirmação automática: casa pelo txid do QR.
 */
export function parseNativeWebhook(payload: unknown): NormalizedWebhookEvent[] {
  if (!payload || typeof payload !== 'object') return []

  const body = payload as Record<string, unknown>
  const events: NormalizedWebhookEvent[] = []

  const push = (txid: string, valor?: string, horario?: string, endToEndId?: string) => {
    const clean = txid.replace(/[^a-zA-Z0-9]/g, '')
    if (!clean) return
    events.push({
      eventType: 'PIX_RECEIVED',
      providerChargeId: clean,
      status: 'paid',
      paidAt: horario ?? new Date().toISOString(),
      raw: { txid: clean, valor, endToEndId },
      matchTxid: clean,
    })
  }

  // Formato Bacen: { pix: [ { txid, valor, horario, endToEndId } ] }
  if (Array.isArray(body.pix)) {
    for (const item of body.pix) {
      if (!item || typeof item !== 'object') continue
      const p = item as Record<string, unknown>
      if (typeof p.txid === 'string') {
        push(
          p.txid,
          typeof p.valor === 'string' ? p.valor : undefined,
          typeof p.horario === 'string' ? p.horario : undefined,
          typeof p.endToEndId === 'string' ? p.endToEndId : undefined,
        )
      }
    }
  }

  // Formato simplificado: { txid, valor, paidAt }
  if (typeof body.txid === 'string') {
    push(
      body.txid,
      typeof body.valor === 'string' ? body.valor : undefined,
      typeof body.paidAt === 'string' ? body.paidAt : undefined,
    )
  }

  // Alguns bancos: { data: { txid } }
  if (body.data && typeof body.data === 'object') {
    const data = body.data as Record<string, unknown>
    if (typeof data.txid === 'string') push(data.txid)
  }

  return events
}
