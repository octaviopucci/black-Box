import { motion } from 'framer-motion'
import { ShieldCheck, Smartphone } from 'lucide-react'
import { trustStats } from '../data/site'

export function Trust() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Clareza gera confiança
          </h2>
          <p className="mt-3 text-base leading-relaxed text-mute sm:text-lg">
            O premium no setor público não é luxo — é redução de atrito, linguagem humana e
            segurança perceptível em cada tela.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 border-t border-line pt-10 sm:grid-cols-3">
          {trustStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
            >
              <p className="font-display text-4xl font-bold tracking-tight text-brand sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-mute">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-brand" />
            <div>
              <p className="font-display text-xl font-semibold text-ink">Identidade única</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Login gov.br como âncora. Menos senhas, mais continuidade entre órgãos e apps.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Smartphone className="mt-1 h-6 w-6 shrink-0 text-brand" />
            <div>
              <p className="font-display text-xl font-semibold text-ink">Mobile first real</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">
                Jornadas pensadas para o polegar: busca grande, decisões claras, zero poluição
                visual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
