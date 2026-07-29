import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight } from 'lucide-react'
import type { Service } from '../data/site'

const steps = [
  {
    id: 1,
    title: 'Identifique',
    copy: 'Busca ou perfil — o gov.br entende a intenção sem labirinto de menus.',
  },
  {
    id: 2,
    title: 'Confirme',
    copy: 'Dados essenciais com sua conta gov.br. Você só revisa o necessário.',
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
    <section
      id="jornada"
      className="scroll-mt-28 bg-gov-darker px-5 py-20 text-white sm:px-8 sm:py-24"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-flag-yellow">
            Experiência gov.br
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Três passos. Sem burocracia visual.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Mantém a confiança da identidade oficial e reduz atrito até a conclusão do serviço.
          </p>

          <ol className="mt-10 space-y-6">
            {steps.map((item, i) => (
              <li key={item.id} className="flex gap-4">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded text-sm font-extrabold ${
                    step >= i ? 'bg-flag-yellow text-gov-darker' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {step > i || done ? <Check className="h-4 w-4" /> : item.id}
                </span>
                <div>
                  <p className="text-xl font-extrabold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/55">{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="relative overflow-hidden rounded-lg border border-white/15 bg-gov-deep/60 p-6 backdrop-blur-sm sm:p-8"
        >
          <div className="absolute -right-10 -top-10 h-36 w-36 rotate-45 border border-flag-yellow/25" />
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-flag-yellow">
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
                <p className="text-2xl font-extrabold tracking-tight">
                  Selecione um serviço para começar
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Use a busca, os essenciais ou um perfil. A jornada aparece aqui em tempo real.
                </p>
                <a
                  href="#busca"
                  className="mt-8 inline-flex items-center gap-2 rounded bg-flag-yellow px-5 py-3 text-sm font-extrabold text-gov-darker"
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
                <p className="text-2xl font-extrabold tracking-tight text-flag-yellow">
                  Serviço concluído
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  <strong className="text-white">{activeService.title}</strong> finalizado com
                  protocolo digital gov.br. Tempo estimado: {activeService.time}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setDone(false)
                    setStep(0)
                  }}
                  className="mt-8 rounded border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
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
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                  Passo {step + 1} de 3 · {activeService.category}
                </p>
                <p className="mt-3 text-2xl font-extrabold tracking-tight">{activeService.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {step === 0 &&
                    'Confirmamos que este é o serviço certo. Você pode alterar a qualquer momento.'}
                  {step === 1 &&
                    'Conta gov.br autenticada. Revisamos CPF e preferências antes de enviar.'}
                  {step === 2 &&
                    `Pronto para concluir. Estimativa de ${activeService.time} — comprovante e protocolo na hora.`}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="rounded border border-white/30 px-5 py-3 text-sm font-bold text-white/85 transition hover:bg-white/10"
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
                    className="inline-flex items-center gap-2 rounded bg-flag-yellow px-5 py-3 text-sm font-extrabold text-gov-darker transition hover:bg-white"
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
