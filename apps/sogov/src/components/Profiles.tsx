import { motion } from 'framer-motion'
import { profiles, services, type Service } from '../data/site'

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
    <section id="perfis" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Comece pelo seu perfil
          </h2>
          <p className="mt-3 text-base leading-relaxed text-mute sm:text-lg">
            Em vez de dezenas de categorias, um atalho humano: quem você é e o que costuma precisar.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile, i) => {
            const selected = profile.id === active.id
            return (
              <motion.button
                key={profile.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => onSelectProfile(profile.id)}
                className={`rounded-2xl border px-5 py-5 text-left transition ${
                  selected
                    ? 'border-brand bg-brand text-white shadow-soft'
                    : 'border-line bg-white/70 hover:border-brand/40'
                }`}
              >
                <p className="font-display text-xl font-semibold tracking-tight">{profile.name}</p>
                <p className={`mt-2 text-sm leading-relaxed ${selected ? 'text-white/75' : 'text-mute'}`}>
                  {profile.blurb}
                </p>
              </motion.button>
            )
          })}
        </div>

        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 border-t border-line pt-8"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand/70">
            Sugestões para {active.name}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {related.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => onSelectService(service)}
                className="rounded-full border border-line bg-white px-5 py-3 text-left text-sm font-semibold text-ink transition hover:border-brand hover:text-brand sm:text-base"
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
