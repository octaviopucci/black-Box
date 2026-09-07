import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import { StatusDot } from '../ui/StatusDot'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Message = {
  id: string
  role: 'user' | 'system'
  content: string
  architecture?: string[]
  opportunity?: string
}

function analyzePrompt(input: string): Omit<Message, 'id' | 'role'> {
  const text = input.toLowerCase()

  if (
    text.includes('lead') ||
    text.includes('não respond') ||
    text.includes('nao respond') ||
    text.includes('recupera')
  ) {
    return {
      content:
        'Oportunidade identificada. Sua operação pode recuperar valor escondido na base com um sistema de reativação inteligente.',
      opportunity: 'Sistema de Recuperação de Leads',
      architecture: [
        'Segmentação dos leads',
        'Análise de comportamento',
        'Personalização com IA',
        'WhatsApp automático',
        'Registro no CRM',
        'Follow-up inteligente',
      ],
    }
  }

  if (text.includes('vendas') || text.includes('comercial') || text.includes('crm')) {
    return {
      content:
        'Oportunidade identificada. Um motor comercial com IA pode qualificar e encaminhar oportunidades automaticamente.',
      opportunity: 'Engenharia de Vendas com IA',
      architecture: [
        'Captura de leads',
        'Análise por IA',
        'Qualificação automática',
        'Integração com CRM',
        'Roteamento para a equipe',
        'Acompanhamento contínuo',
      ],
    }
  }

  if (
    text.includes('dashboard') ||
    text.includes('painel') ||
    text.includes('indicador') ||
    text.includes('interno')
  ) {
    return {
      content:
        'Oportunidade identificada. Um painel operacional sob medida centraliza dados e acelera decisões.',
      opportunity: 'Painel Operacional',
      architecture: [
        'Integração de fontes de dados',
        'APIs e banco de dados',
        'Processamento e regras',
        'Dashboard em tempo real',
        'Alertas operacionais',
        'Ações acionáveis',
      ],
    }
  }

  if (
    text.includes('site') ||
    text.includes('landing') ||
    text.includes('convers') ||
    text.includes('tráfego') ||
    text.includes('trafego')
  ) {
    return {
      content:
        'Oportunidade identificada. Uma experiência de conversão bem construída transforma tráfego em oportunidades reais.',
      opportunity: 'Máquina de Conversão',
      architecture: [
        'Diagnóstico da oferta',
        'Arquitetura da experiência',
        'Landing Page de alta conversão',
        'Captura e qualificação',
        'Integração comercial',
        'Otimização contínua',
      ],
    }
  }

  if (text.includes('automat') || text.includes('whatsapp') || text.includes('integra')) {
    return {
      content:
        'Oportunidade identificada. Automação e integrações podem conectar ferramentas e reduzir trabalho manual.',
      opportunity: 'Camada de Automação Inteligente',
      architecture: [
        'Mapeamento de processos',
        'Conexão entre ferramentas',
        'Workflows inteligentes',
        'APIs e webhooks',
        'Disparos automáticos',
        'Monitoramento e evolução',
      ],
    }
  }

  return {
    content:
      'Oportunidade identificada. Com base no que você descreveu, a Black Box enxerga um sistema sob medida conectando IA, automação e interfaces.',
    opportunity: 'Sistema Digital Sob Medida',
    architecture: [
      'Entendimento do problema',
      'Arquitetura da solução',
      'Camada de IA quando fizer sentido',
      'Automações e integrações',
      'Interface e operação',
      'Evolução contínua',
    ],
  }
}

export function AiChat() {
  const reduced = useReducedMotion()
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content:
        'Sistema online. Descreva o que você quer automatizar, construir ou melhorar. Exemplo: “Tenho muitos leads que não respondem.”',
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

    await new Promise((r) => setTimeout(r, reduced ? 120 : 900))
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
          <p className="bb-eyebrow mb-5">Black Box AI</p>
          <h2 className="bb-display text-4xl sm:text-5xl lg:text-6xl">Converse com a Black Box</h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
            Conte o que você gostaria de construir. A Black Box encontra caminhos.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bb-panel relative mt-12 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-paper">
                  Black Box AI
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                  Sistema / Online
                </p>
              </div>
              <StatusDot label="Online" />
            </div>

            <div
              ref={listRef}
              className="max-h-[28rem] space-y-4 overflow-y-auto px-5 py-6 sm:px-6"
              aria-live="polite"
            >
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={message.role === 'user' ? 'ml-auto max-w-[90%] sm:max-w-[75%]' : 'max-w-[95%] sm:max-w-[85%]'}
                  >
                    <div
                      className={
                        message.role === 'user'
                          ? 'border border-white/20 bg-white/[0.06] px-4 py-3 text-sm text-paper'
                          : 'border border-white/10 bg-black/25 px-4 py-4'
                      }
                    >
                      {message.role === 'system' && message.opportunity ? (
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-status">
                          Oportunidade identificada
                        </p>
                      ) : null}
                      {message.opportunity ? (
                        <p className="mb-3 font-display text-xl uppercase tracking-tight text-paper">
                          {message.opportunity}
                        </p>
                      ) : null}
                      <p className="text-sm leading-relaxed text-silver">{message.content}</p>
                      {message.architecture ? (
                        <div className="mt-5 border-t border-white/10 pt-4">
                          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                            Arquitetura sugerida
                          </p>
                          <ul className="space-y-2">
                            {message.architecture.map((step) => (
                              <li
                                key={step}
                                className="font-mono text-[11px] uppercase tracking-[0.14em] text-silver"
                              >
                                → {step}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-5">
                            <Button href="#contato" arrow variant="secondary">
                              Quero construir isso
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {busy ? (
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                  Analisando<span className="bb-cursor-blink">_</span>
                </p>
              ) : null}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={onSubmit}
              className="border-t border-white/10 p-4 sm:p-5"
            >
              <label htmlFor="bb-ai-input" className="sr-only">
                O que você gostaria de automatizar, construir ou melhorar?
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="bb-ai-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="O que você gostaria de automatizar, construir ou melhorar?"
                  className="w-full border border-white/15 bg-black/30 px-4 py-3 text-sm text-paper outline-none transition placeholder:text-mute focus:border-paper/40"
                  autoComplete="off"
                />
                <Button type="submit" disabled={!canSend} className="shrink-0 disabled:opacity-40">
                  Enviar
                </Button>
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
                Exemplo: Tenho muitos leads que não respondem.
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
