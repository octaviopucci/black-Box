import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { whatsappUrl } from '../../data/site'

type Message = {
  id: string
  role: 'user' | 'system'
  content: string
  steps?: string[]
  opportunity?: string
}

function analyzePrompt(input: string): Omit<Message, 'id' | 'role'> {
  const text = input.toLowerCase()

  if (
    text.includes('lead') ||
    text.includes('não respond') ||
    text.includes('nao respond') ||
    text.includes('recupera') ||
    text.includes('sumiu') ||
    text.includes('parou')
  ) {
    return {
      content:
        'Isso é mais comum do que parece — e dá para resolver. Dá para reativar quem parou de responder com mensagens certas, no timing certo, sem sua equipe correr atrás manualmente.',
      opportunity: 'Recuperação de clientes e leads',
      steps: [
        'Identificamos quem parou de interagir',
        'Segmentamos por perfil e interesse',
        'Enviamos mensagens personalizadas (WhatsApp, e-mail)',
        'Registramos tudo no CRM',
        'Devolvemos o contato quente para o comercial',
      ],
    }
  }

  if (
    text.includes('vendas') ||
    text.includes('comercial') ||
    text.includes('crm') ||
    text.includes('vender')
  ) {
    return {
      content:
        'Seu comercial provavelmente perde tempo com lead frio. Dá para qualificar automaticamente e mandar só o que vale a pena para quem fecha.',
      opportunity: 'Motor comercial inteligente',
      steps: [
        'Captamos e organizamos os leads',
        'A IA analisa interesse e urgência',
        'Priorizamos quem tem mais chance de comprar',
        'Integramos com seu CRM',
        'Sua equipe recebe o contato pronto para fechar',
      ],
    }
  }

  if (
    text.includes('dashboard') ||
    text.includes('painel') ||
    text.includes('indicador') ||
    text.includes('planilha') ||
    text.includes('interno')
  ) {
    return {
      content:
        'Quando a informação está espalhada, a decisão demora. Um painel sob medida centraliza tudo o que importa — num lugar só, atualizado.',
      opportunity: 'Painel de gestão',
      steps: [
        'Conectamos suas fontes de dados',
        'Organizamos indicadores que importam',
        'Montamos telas claras para cada perfil',
        'Alertas quando algo precisa de atenção',
        'Sua equipe decide mais rápido',
      ],
    }
  }

  if (
    text.includes('site') ||
    text.includes('landing') ||
    text.includes('convers') ||
    text.includes('tráfego') ||
    text.includes('trafego') ||
    text.includes('página') ||
    text.includes('pagina')
  ) {
    return {
      content:
        'Tráfego sem conversão é dinheiro jogado fora. Uma página bem construída explica sua oferta com clareza e transforma visita em conversa comercial.',
      opportunity: 'Site ou página que converte',
      steps: [
        'Entendemos sua oferta e público',
        'Criamos narrativa clara e objetiva',
        'Desenhamos a experiência de conversão',
        'Conectamos com WhatsApp ou CRM',
        'Medimos e melhoramos continuamente',
      ],
    }
  }

  if (
    text.includes('automat') ||
    text.includes('whatsapp') ||
    text.includes('integra') ||
    text.includes('manual') ||
    text.includes('repetit')
  ) {
    return {
      content:
        'Tarefa repetitiva é candidata perfeita à automação. Conectamos suas ferramentas para elas conversarem sozinhas — e sua equipe ganha tempo.',
      opportunity: 'Automação da operação',
      steps: [
        'Mapeamos o que hoje é feito na mão',
        'Conectamos WhatsApp, CRM, e-mail e planilhas',
        'Criamos fluxos automáticos',
        'Testamos com sua equipe',
        'A operação roda sozinha no dia a dia',
      ],
    }
  }

  return {
    content:
      'Pelo que você descreveu, faz sentido construir algo sob medida — combinando automação, IA e uma interface simples de usar. A gente desenha a solução certa para o seu caso.',
    opportunity: 'Solução digital sob medida',
    steps: [
      'Conversamos para entender o desafio',
      'Definimos o que construir e o resultado esperado',
      'Desenvolvemos e testamos com você',
      'Colocamos no ar e treinamos a equipe',
      'Acompanhamos e melhoramos juntos',
    ],
  }
}

export function AiChat() {
  const reduced = useReducedMotion()
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content:
        'Oi! Conta em uma frase o que você quer resolver no seu negócio. Exemplo: “Tenho muitos leads que não respondem.”',
    },
  ])

  const canSend = useMemo(() => input.trim().length > 3 && !busy, [input, busy])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' })
  }, [messages, busy, reduced])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSend) return

    const prompt = input.trim()
    setInput('')
    setBusy(true)
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content: prompt }])

    await new Promise((r) => setTimeout(r, reduced ? 120 : 1100))
    const analysis = analyzePrompt(prompt)
    setMessages((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        role: 'system',
        ...analysis,
      },
    ])
    setBusy(false)
  }

  return (
    <section id="ia" className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader
            eyebrow="Assistente"
            title="Conte seu desafio — a gente mostra o caminho"
            subtitle="Descreva o problema em linguagem simples. Em segundos você vê que tipo de solução a Black Box pode construir para você."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bb-panel relative mt-12 overflow-hidden">
            <div className="border-b border-white/10 bg-white/[0.02] px-5 py-4 sm:px-6">
              <p className="text-sm font-medium text-paper">Assistente Black Box</p>
              <p className="mt-1 text-xs text-mute">Resposta simulada · Para projeto real, fale conosco no WhatsApp</p>
            </div>

            <div className="max-h-[28rem] space-y-4 overflow-y-auto px-5 py-6 sm:px-6" aria-live="polite">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35 }}
                    className={
                      message.role === 'user'
                        ? 'ml-auto max-w-[90%] sm:max-w-[75%]'
                        : 'max-w-[95%] sm:max-w-[85%]'
                    }
                  >
                    <div
                      className={
                        message.role === 'user'
                          ? 'rounded-sm border border-white/20 bg-white/[0.08] px-4 py-3 text-sm text-paper'
                          : 'rounded-sm border border-white/10 bg-black/20 px-4 py-4'
                      }
                    >
                      {message.opportunity ? (
                        <>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-status">
                            Sugestão para você
                          </p>
                          <p className="mb-3 font-display text-lg uppercase tracking-tight text-paper">
                            {message.opportunity}
                          </p>
                        </>
                      ) : null}
                      <p className="text-sm leading-relaxed text-silver">{message.content}</p>
                      {message.steps ? (
                        <div className="mt-5 border-t border-white/10 pt-4">
                          <p className="mb-3 text-xs font-medium text-mute">Como resolveríamos:</p>
                          <ol className="space-y-2">
                            {message.steps.map((step, i) => (
                              <li key={step} className="flex gap-3 text-sm text-silver">
                                <span className="font-mono text-xs text-mute">{i + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                          <div className="mt-5">
                            <Button href={whatsappUrl()} arrow variant="secondary" target="_blank" rel="noreferrer">
                              Quero conversar sobre isso
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {busy ? (
                <motion.p
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-sm text-mute"
                >
                  Pensando na melhor solução…
                </motion.p>
              ) : null}
              <div ref={endRef} />
            </div>

            <form onSubmit={onSubmit} className="border-t border-white/10 p-4 sm:p-5">
              <label htmlFor="bb-ai-input" className="sr-only">
                Descreva seu desafio
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="bb-ai-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ex.: Perco muitos leads porque ninguém responde no WhatsApp…"
                  className="w-full rounded-sm border border-white/15 bg-black/30 px-4 py-3 text-sm text-paper outline-none transition placeholder:text-mute focus:border-paper/40"
                  autoComplete="off"
                />
                <Button type="submit" disabled={!canSend} className="shrink-0 disabled:opacity-40">
                  Enviar
                </Button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
