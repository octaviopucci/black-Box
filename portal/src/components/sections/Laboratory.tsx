import { labItems } from '../../data/content'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { StatusDot } from '../ui/StatusDot'

const statusTone: Record<(typeof labItems)[number]['status'], string> = {
  EXPERIMENTAL: 'text-silver',
  PROTÓTIPO: 'text-paper',
  'EM TESTES': 'text-status',
  'P&D': 'text-mute',
}

export function Laboratory() {
  return (
    <section id="laboratorio" className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader
            title="Laboratório Black Box"
            subtitle="Experimentos, protótipos e ideias que estamos transformando em tecnologia."
            eyebrow="Inovação"
          />
        </Reveal>

        <div className="relative mt-14 overflow-hidden border border-white/10 bg-[#09090b]">
          <div className="bb-noise opacity-[0.06]" />
          <div className="pointer-events-none absolute inset-0 bb-grid-bg opacity-30" />
          <div className="relative divide-y divide-white/10">
            <div className="flex items-center justify-between px-5 py-4 sm:px-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                Ambiente / Laboratório
              </p>
              <StatusDot label="Ativo" />
            </div>
            {labItems.map((item, i) => (
              <Reveal key={item.title} delay={0.04 * i}>
                <article className="grid gap-3 px-5 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:px-7">
                  <h3 className="font-display text-xl uppercase tracking-tight text-paper sm:text-2xl">
                    {item.title}
                  </h3>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-[0.2em] ${statusTone[item.status]}`}
                  >
                    Status: {item.status}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
