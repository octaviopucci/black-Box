/** Gera payload EMV (copia-e-cola) de Pix — QR estático com valor e txid. Grátis: dinheiro vai direto na sua chave. */

function tlv(id: string, value: string): string {
  const len = String(value.length).padStart(2, '0')
  return `${id}${len}${value}`
}

/** CRC16-CCITT-FALSE (polinômio 0x1021), padrão Bacen para BR Code. */
export function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = ((crc << 1) ^ 0x1021) & 0xffff
      else crc = (crc << 1) & 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function sanitizeMerchant(name: string, max: number): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .slice(0, max)
    .toUpperCase() || 'RECEBEDOR'
}

export interface BrCodeInput {
  pixKey: string
  amountCents: number
  merchantName: string
  merchantCity: string
  txid: string
  description?: string
}

export function buildPixBrCode(input: BrCodeInput): string {
  if (!input.pixKey.trim()) throw new Error('Chave Pix obrigatória')
  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new Error('amountCents inválido')
  }
  const txid = input.txid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 25)
  if (txid.length < 1) throw new Error('txid inválido')

  const amount = (input.amountCents / 100).toFixed(2)

  const gui = tlv('00', 'br.gov.bcb.pix')
  const key = tlv('01', input.pixKey.trim())
  const desc = input.description
    ? tlv('02', sanitizeMerchant(input.description, 50).toLowerCase().slice(0, 50) || 'pix')
    : ''
  const merchantAccount = tlv('26', `${gui}${key}${desc}`)

  const additional = tlv('62', tlv('05', txid))

  const partial =
    tlv('00', '01') +
    tlv('01', '11') + // estático
    merchantAccount +
    tlv('52', '0000') +
    tlv('53', '986') +
    tlv('54', amount) +
    tlv('58', 'BR') +
    tlv('59', sanitizeMerchant(input.merchantName, 25)) +
    tlv('60', sanitizeMerchant(input.merchantCity, 15)) +
    additional +
    '6304'

  return partial + crc16(partial)
}
