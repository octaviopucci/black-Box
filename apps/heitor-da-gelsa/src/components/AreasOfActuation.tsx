import { HeartPulse, Eye, MapPin, Users, type LucideIcon } from 'lucide-react'
import { areasOfActuation } from '@/data/areas'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

const iconMap: Record<string, LucideIcon> = {
  'heart-pulse': HeartPulse,
  'map-pin': MapPin,
  users: Users,
  eye: Eye,
}

export function AreasOfActuation() {
  return (
    <section id="atuacao" className="section-shell relative overflow-hidden bg-white bg-sectionMesh">
      <div className="section-container">
        <SectionHeader
          eyebrow="Atuação"
          title="Uma atuação que pode ser acompanhada."
          description="Quatro frentes de presença pública documentadas nas redes e neste site."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {areasOfActuation.map((area, i) => {
            const Icon = iconMap[area.icon] ?? MapPin
            return (
              <Reveal key={area.id} delay={i * 0.05}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-green/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green/25 hover:shadow-card-hover sm:p-7">
                  <div className="absolute left-0 top-0 h-full w-1 bg-yellow/0 transition-colors group-hover:bg-yellow" aria-hidden />
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-green/10 text-green transition-colors group-hover:bg-green group-hover:text-white">
                    <Icon size={22} aria-hidden />
                  </div>
                  <h3 className="font-display text-xl font-black tracking-tight text-green-deep">{area.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">{area.description}</p>
                  <a
                    href="/#registros"
                    className="mt-6 inline-flex items-center text-sm font-bold uppercase tracking-wide text-green transition-colors hover:text-green-dark"
                  >
                    Ver registros
                    <span className="ml-2 h-0.5 w-6 bg-yellow transition-all group-hover:w-10" aria-hidden />
                  </a>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
