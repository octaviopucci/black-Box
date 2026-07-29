import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import type { Service } from '../data/site'

const steps = [
  {
    id: 1,
    title: 'Identifique',
    copy: 'Busca ou perfil — o sistema entende a intenção sem labirinto de menus.',
  },
  {
    id: 2,
    title: 'Confirme',
    copy: 'Dados essenciais pré-preenchidos com sua conta gov.br. Você só revisa.',
  },
  {
    id: 3,
    title: 'Conclua',
    copy: 'Protocolo digital, comprovante e próximo passo claros — em minutos.',
  },
]

export function Journey({ service }: { service: Service | null }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setStep(0)
    setDone(false)
  }, [service?.id])

  const activeService = service

  return (
    <section id="jornada" className="scroll-mt-24 border-y border-line/80 bg-ink px-5 py-20 text-white sm:px-8 sm:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
        >
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Três passos. Sem burocracia visual.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
            A interface guia a jornada completa. Escolha um serviço na busca ou nos perfis e simule
            o fluxo premium abaixo.
          </p>

          <ol className="mt-10 space-y-6">
            {steps.map((item, i) => (
              <li key={item.id} className="flex gap-4">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    step >= i ? 'bg-brass text-ink' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {step > i || done ? <Check className="h-4 w-4" /> : item.id}
                </span>
                <div>
                  <p className="font-display text-xl font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8"
        >
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brass/20 blur-3xl" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brass-soft">
            Simulador interativo
          </p>
          <AnimatePresence mode="wait">
            {!activeService ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6"
              >
                <p className="font-display text-2xl font-semibold tracking-tight">
                  Selecione um serviço para começar
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  Use a busca, os essenciais ou um perfil. A jornada aparece aqui em tempo real.
                </p>
                <a
                  href="#busca"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand"
                >
                  Ir para a busca
                  <ChevronRight className="h-4 w-4" />
                </a>
              </motion.div>
            ) : done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6"
              >
                <p className="font-display text-2xl font-semibold tracking-tight text-brass-soft">
                  Serviço concluído
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  <strong className="text-white">{activeService.title}</strong> finalizado com
                  protocolo digital. Tempo estimado: {activeService.time}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false)
                    setStep(0)
                  }}
                  className="mt-8 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Simular de novo
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeService.id}-${step}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Passo {step + 1} de 3 · {activeService.category}
                </p>
                <p className="mt-3 font-display text-2xl font-semibold tracking-tight">
                  {activeService.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {step === 0 &&
                    'Confirmamos que este é o serviço certo com base na sua busca. Você pode alterar a qualquer momento.'}
                  {step === 1 &&
                    'Conta gov.br autenticada. Revisamos CPF, endereço e preferências de notificação antes de enviar.'}
                  {step === 2 &&
                    `Pronto para concluir. Estimativa de ${activeService.time} — comprovante e protocolo na hora.`}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                    >
                      Voltar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (step < 2) setStep((s) => s + 1)
                      else setDone(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-brass px-5 py-3 text-sm font-semibold text-ink transition hover:bg-brass-soft"
                  >
                    {step < 2 ? 'Continuar' : 'Concluir serviço'}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
