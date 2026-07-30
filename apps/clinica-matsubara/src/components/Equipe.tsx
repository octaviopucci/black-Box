import { asset, team } from '../data/site'
import { Reveal } from './Reveal'

export function Equipe() {
  return (
    <section id="equipe" className="relative overflow-hidden bg-cream-soft py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">
              <span className="h-px w-8 bg-wine/40" />
              Presença
            </p>
            <h2 className="display-title mt-4 text-[clamp(2.4rem,5.5vw,4.2rem)]">
              Rostos que sustentam o cuidado.
            </h2>
            <p className="mt-5 text-mute">
              Uma equipe multidisciplinar com odontologia, estética e saúde emocional —
              preparada para cuidar da sua versão com excelência e acolhimento.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src={asset('team/founders.jpg')}
                alt="Equipe Clínica Matsubara — profissionais em uniforme bege"
                className="aspect-[5/4] w-full object-cover object-[center_20%]"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wine-deep/90 to-transparent p-6 text-cream sm:p-8">
                <p className="font-script text-3xl text-rose-soft">Dra. Carina Torresilha</p>
                <p className="mt-1 text-sm text-cream/75">Fundadora · Odontologia e Estética</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={0.06 * i}>
              <article className="flex h-full flex-col justify-between rounded-[1.75rem] border border-wine/10 bg-cream p-6">
                {'image' in member && member.image ? (
                  <img
                    src={asset(member.image)}
                    alt={member.name}
                    className="mb-5 aspect-square w-full rounded-[1.25rem] object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <div className="mb-5 flex aspect-[5/3] items-end rounded-[1.25rem] bg-wine/90 p-5">
                    <BrandInitials name={member.name} />
                  </div>
                )}
                <div>
                  <h3 className="font-display text-2xl font-semibold text-ink">{member.name}</h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-wine">
                    {member.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{member.note}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function BrandInitials({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter((w) => !['Dra.', 'Dr.', 'e', '·'].includes(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <span className="font-display text-4xl font-semibold tracking-tight text-rose-soft">
      {initials || 'CM'}
    </span>
  )
}
