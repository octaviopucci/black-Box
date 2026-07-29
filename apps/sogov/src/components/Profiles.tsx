import { motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  CarFront,
  GraduationCap,
  HeartHandshake,
  PersonStanding,
  Store,
} from 'lucide-react'
import { profiles, services, type Service } from '../data/site'

const icons = {
  trabalhador: BriefcaseBusiness,
  empreendedor: Store,
  aposentado: PersonStanding,
  motorista: CarFront,
  estudante: GraduationCap,
  familia: HeartHandshake,
} as const

export function Profiles({
  activeId,
  onSelectProfile,
  onSelectService,
}: {
  activeId: string | null
  onSelectProfile: (id: string) => void
  onSelectService: (service: Service) => void
}) {
  const active = profiles.find((p) => p.id === activeId) ?? profiles[0]
  const related = services.filter((s) => active.serviceIds.includes(s.id))

  return (
    <section id="perfis" className="scroll-mt-28 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gov">
            Serviços digitais por perfil
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
            Comece pelo seu perfil
          </h2>
          <p className="mt-3 text-base leading-relaxed text-mute sm:text-lg">
            Como no portal oficial — com atalhos mais claros e uma seleção imediata do que costuma
            resolver a sua rotina.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile, i) => {
            const selected = profile.id === active.id
            const Icon = icons[profile.id as keyof typeof icons] ?? PersonStanding
            return (
              <motion.button
                key={profile.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                onClick={() => onSelectProfile(profile.id)}
                className={`flex items-start gap-4 rounded border-2 px-5 py-5 text-left transition ${
                  selected
                    ? 'border-gov bg-gov text-white shadow-gov'
                    : 'border-line bg-white hover:border-gov'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded ${
                    selected ? 'bg-white/15 text-flag-yellow' : 'bg-gov-mist text-gov'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-lg font-extrabold tracking-tight">{profile.name}</span>
                  <span className={`mt-1 block text-sm leading-relaxed ${selected ? 'text-white/75' : 'text-mute'}`}>
                    {profile.blurb}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-10 border-t-4 border-gov/20 pt-8"
        >
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-gov">
            Sugestões para {active.name}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {related.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelectService(service)}
                className="rounded border border-line bg-white px-4 py-3 text-left text-sm font-bold text-ink transition hover:border-gov hover:bg-gov-mist hover:text-gov sm:text-base"
              >
                {service.title}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
