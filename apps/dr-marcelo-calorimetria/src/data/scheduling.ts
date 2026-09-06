/**
 * Configuração do fluxo de agendamento — edite apenas este arquivo.
 */

/** URL do Calendly ou Google Appointment Schedule (página de agendamento) */
export const CALENDLY_URL = 'COLOCAR_URL_DO_CALENDLY_AQUI'

/** Chave PIX ou código Copia e Cola completo */
export const PIX_KEY = 'COLOCAR_CHAVE_PIX_AQUI'

/** Valor do sinal (texto livre, ex.: "R$ 150,00") */
export const PIX_AMOUNT = 'COLOCAR_VALOR_AQUI'

/** Número WhatsApp com DDI e DDD, apenas dígitos (ex.: 5514999999999) */
export const WHATSAPP_NUMBER = 'COLOCAR_NUMERO_AQUI'

/**
 * Imagem do QR Code PIX — caminho em /public (ex.: pix-qrcode.png)
 * ou URL absoluta. Deixe o placeholder até ter a imagem.
 */
export const QR_CODE_IMAGE = 'COLOCAR_IMAGEM_DO_QR_CODE_AQUI'

export const WHATSAPP_RECEIPT_MESSAGE =
  'Olá! Acabei de realizar o pagamento do sinal da minha avaliação com o Dr. Marcelo Prado. Segue o comprovante.'

const PLACEHOLDER = 'COLOCAR'

export function isSchedulingConfigured(value: string) {
  return Boolean(value && !value.includes(PLACEHOLDER))
}

export function calendlyEmbedUrl(): string | null {
  if (!isSchedulingConfigured(CALENDLY_URL)) return null
  try {
    const url = new URL(CALENDLY_URL.startsWith('http') ? CALENDLY_URL : `https://${CALENDLY_URL}`)
    url.searchParams.set('embed_type', 'Inline')
    url.searchParams.set('hide_gdpr_banner', '1')
    if (!url.searchParams.has('embed')) url.searchParams.set('embed', 'true')
    return url.toString()
  } catch {
    return null
  }
}

export function whatsappReceiptUrl() {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(WHATSAPP_RECEIPT_MESSAGE)}`
}

export function qrCodeImageSrc(asset: (path: string) => string): string | null {
  if (!isSchedulingConfigured(QR_CODE_IMAGE)) return null
  if (QR_CODE_IMAGE.startsWith('http://') || QR_CODE_IMAGE.startsWith('https://')) {
    return QR_CODE_IMAGE
  }
  return asset(QR_CODE_IMAGE)
}
