import { useEffect, useState } from 'react'
import { X, Copy, Check, MessageCircle } from 'lucide-react'
import { asset } from '../../data/site'
import {
  CALENDLY_URL,
  PIX_AMOUNT,
  PIX_KEY,
  WHATSAPP_NUMBER,
  calendlyEmbedUrl,
  isSchedulingConfigured,
  qrCodeImageSrc,
  whatsappReceiptUrl,
} from '../../data/scheduling'
import { useScheduling } from '../../context/SchedulingContext'

type Step = 'calendar' | 'pix'

export function SchedulingModal() {
  const { isOpen, closeScheduling } = useScheduling()
  const [step, setStep] = useState<Step>('calendar')
  const [copied, setCopied] = useState(false)

  const embedUrl = calendlyEmbedUrl()
  const qrSrc = qrCodeImageSrc(asset)

  useEffect(() => {
    if (!isOpen) {
      setStep('calendar')
      setCopied(false)
      return
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeScheduling()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeScheduling])

  if (!isOpen) return null

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* fallback silencioso */
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scheduling-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
        aria-label="Fechar agendamento"
        onClick={closeScheduling}
      />

      <div className="relative flex max-h-[94svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-paper shadow-lift sm:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            {step === 'calendar' ? (
              <>
                <p className="eyebrow !mb-2">Agendamento</p>
                <h2 id="scheduling-title" className="font-display text-xl text-ink sm:text-2xl">
                  Agende sua avaliação
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Escolha o melhor dia e horário para seu atendimento.
                </p>
              </>
            ) : (
              <>
                <p className="eyebrow !mb-2">Pagamento</p>
                <h2 id="scheduling-title" className="font-display text-xl text-ink sm:text-2xl">
                  Quase tudo pronto!
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mute">
                  Para confirmar seu horário, realize o pagamento do sinal via PIX.
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={closeScheduling}
            className="shrink-0 rounded-full p-2 text-mute transition hover:bg-paper-soft hover:text-ink"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          {step === 'calendar' ? (
            <div className="space-y-5">
              <div className="w-full overflow-hidden rounded-sm border border-line bg-snow">
                {embedUrl ? (
                  <iframe
                    title="Agendamento online"
                    src={embedUrl}
                    className="block w-full border-0"
                    style={{ minHeight: '620px', height: '70svh', maxHeight: '720px' }}
                  />
                ) : (
                  <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
                      Calendário externo
                    </p>
                    <p className="max-w-sm text-sm leading-relaxed text-mute">
                      Configure <code className="text-ink">CALENDLY_URL</code> em{' '}
                      <code className="text-ink">src/data/scheduling.ts</code>
                    </p>
                    <p className="font-mono text-xs text-mute/70">{CALENDLY_URL}</p>
                  </div>
                )}
              </div>

              <button type="button" onClick={() => setStep('pix')} className="cta-solid w-full justify-center py-4">
                Já agendei — continuar para o PIX
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-sm border border-line bg-snow px-5 py-4 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">Valor do sinal</p>
                <p className="mt-2 font-display text-3xl text-ink">{PIX_AMOUNT}</p>
              </div>

              {qrSrc ? (
                <div className="mx-auto flex max-w-[240px] justify-center rounded-sm border border-line bg-snow p-4">
                  <img src={qrSrc} alt="QR Code PIX" className="block h-auto w-full max-w-[200px]" />
                </div>
              ) : (
                <div className="mx-auto flex max-w-[240px] flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-line bg-paper-soft px-4 py-10 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">QR Code PIX</p>
                  <p className="text-xs leading-relaxed text-mute">
                    Configure <code className="text-ink">QR_CODE_IMAGE</code> em{' '}
                    <code className="text-ink">src/data/scheduling.ts</code>
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="pix-copy" className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                  PIX Copia e Cola
                </label>
                <textarea
                  id="pix-copy"
                  readOnly
                  value={PIX_KEY}
                  rows={3}
                  className="mt-2 w-full resize-none rounded-sm border border-line bg-snow px-3 py-3 font-mono text-xs leading-relaxed text-ink"
                />
                <button
                  type="button"
                  onClick={copyPix}
                  className="cta-ghost-dark mt-3 w-full justify-center py-3.5 uppercase tracking-wide"
                >
                  {copied ? <Check className="h-4 w-4 text-teal" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'PIX copiado' : 'Copiar PIX'}
                </button>
              </div>

              <a
                href={isSchedulingConfigured(WHATSAPP_NUMBER) ? whatsappReceiptUrl() : '#'}
                target="_blank"
                rel="noreferrer"
                className={`cta-solid w-full justify-center py-4 uppercase tracking-wide ${!isSchedulingConfigured(WHATSAPP_NUMBER) ? 'pointer-events-none opacity-50' : ''}`}
                onClick={(e) => {
                  if (!isSchedulingConfigured(WHATSAPP_NUMBER)) e.preventDefault()
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Enviar comprovante pelo WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setStep('calendar')}
                className="w-full py-2 text-center text-sm text-mute transition hover:text-ink"
              >
                ← Voltar ao calendário
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
