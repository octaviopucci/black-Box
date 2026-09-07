import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { StatusDot } from '../ui/StatusDot'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const systemRows = [
  { label: 'ENGENHARIA DE IA', value: 'ONLINE' },
  { label: 'AUTOMAÇÕES', value: 'ATIVAS' },
  { label: 'WEB APPS', value: '08' },
  { label: 'INTEGRAÇÕES', value: '31' },
  { label: 'SISTEMAS', value: '12' },
]

const meta = [
  'SISTEMA / 001',
  'BLACK BOX / 2026',
  'MODO / CONSTRUÇÃO',
  'NÚCLEO / IA',
]

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden pt-28 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 bb-grid-bg opacity-40" />
      <div className="bb-noise" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-white/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-24 h-80 w-80 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="bb-container relative grid min-h-[calc(100svh-6rem)] items-center gap-12 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bb-eyebrow mb-6"
          >
            Software Factory · Engenharia de IA
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08 }}
            className="bb-display text-[clamp(2.6rem,8vw,6.2rem)]"
          >
            Você imagina.
            <br />
            A Black Box constrói.
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg"
          >
            Engenharia de IA, sistemas web e automações para transformar ideias e problemas reais
            em soluções digitais.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href="#projetos" arrow>
              Ver projetos
            </Button>
            <Button href="#contato" variant="secondary">
              Começar um projeto
            </Button>
          </motion.div>
        </div>

        <motion.aside
          initial={reduced ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.2 }}
          className="bb-panel relative overflow-hidden p-5 sm:p-6"
          aria-label="Interface do sistema central Black Box"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_45%)]" />
          <div className="relative">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-paper">
                  Black Box / Sistema Central
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                  Núcleo operacional
                </p>
              </div>
              <StatusDot />
            </div>

            <ul className="space-y-3 font-mono text-[11px] uppercase tracking-[0.14em]">
              {systemRows.map((row) => (
                <li key={row.label} className="flex items-baseline gap-3 text-silver">
                  <span className="shrink-0 text-mute">{row.label}</span>
                  <span className="min-w-0 flex-1 border-b border-dotted border-white/20" aria-hidden="true" />
                  <span className="shrink-0 text-paper">{row.value}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border border-white/10 bg-black/30 p-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
                Status do sistema
              </p>
              <StatusDot label="Operacional" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {meta.map((item) => (
                <p
                  key={item}
                  className="border border-white/10 bg-white/[0.02] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mute"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
