import {
  Bus,
  Construction,
  Eye,
  HeartPulse,
  MapPin,
  Search,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { areasOfActuation } from '@/data/areas'
import { Reveal } from './Reveal'

const iconMap: Record<string, LucideIcon> = {
  'heart-pulse': HeartPulse,
  construction: Construction,
  search: Search,
  bus: Bus,
  'map-pin': MapPin,
  users: Users,
  eye: Eye,
}

export function AreasOfActuation() {
  return (
    <section id="atuacao" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Atuação</p>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight text-green-deep">
            Uma atuação que pode ser acompanhada.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {areasOfActuation.map((area, i) => {
            const Icon = iconMap[area.icon] ?? MapPin
            return (
              <Reveal key={area.id} delay={i * 0.04}>
                <article className="group flex h-full flex-col border border-green/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-green/10 text-green transition-colors group-hover:bg-green group-hover:text-white">
                    <Icon size={22} aria-hidden />
                  </div>
                  <h3 className="font-display text-xl font-black text-green-deep">{area.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite/75">{area.description}</p>
                  <a
                    href={`/#projetos`}
                    className="mt-5 inline-flex items-center text-sm font-bold uppercase tracking-wide text-green transition-colors hover:text-green-dark"
                  >
                    Saiba mais
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
