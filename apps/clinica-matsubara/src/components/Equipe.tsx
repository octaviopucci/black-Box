import { asset, foundersDuo, team } from '../data/site'
import { Reveal } from './Reveal'

export function Equipe() {
  return (
    <section id="equipe" className="relative overflow-hidden bg-cream-soft py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-8 bg-wine/40" />
            Presença
          </p>
          <h2 className="display-title mt-4 max-w-3xl text-[clamp(2.4rem,5.5vw,4.2rem)]">
            Quem cuida da sua versão.
          </h2>
          <p className="mt-5 max-w-xl text-mute">
            Fundadoras, especialidades e presença real — cada profissional com foto e nome,
            como na clínica.
          </p>
        </Reveal>

        {/* Duo real Instagram — brand wine fade */}
        <Reveal delay={0.08}>
          <figure className="relative mt-12 overflow-hidden rounded-[2rem]">
            <img
              src={asset(foundersDuo.image)}
              alt={foundersDuo.alt}
              className="aspect-[16/10] w-full object-cover object-[center_18%] sm:aspect-[2.2/1]"
              loading="lazy"
            />
            {/* Brand color fade — burgundy/wine */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, rgba(92,26,44,0.88) 0%, rgba(120,36,60,0.55) 38%, rgba(120,36,60,0.12) 62%, transparent 78%), linear-gradient(to top, rgba(92,26,44,0.82) 0%, transparent 45%)',
              }}
            />
            <figcaption className="absolute inset-x-0 bottom-0 z-10 p-6 text-cream sm:p-10">
              <p className="font-script text-[clamp(2.4rem,6vw,3.6rem)] leading-none text-rose-soft">
                {foundersDuo.title}
              </p>
              <p className="mt-2 max-w-md text-sm text-cream/80 sm:text-base">{foundersDuo.line}</p>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-cream/55">
                Dra. Carina Torresilha · Dra. Daniela Matsubara
              </p>
            </figcaption>
          </figure>
        </Reveal>

        {/* Full team with real photos */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={0.05 * i}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-wine/10 bg-cream">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={asset(member.image)}
                    alt={member.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    style={{ objectPosition: member.objectPosition ?? 'center top' }}
                    loading="lazy"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-wine-deep/70 via-transparent to-transparent opacity-90"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                    <h3 className="font-display text-xl font-semibold leading-tight sm:text-2xl">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-soft">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="p-4 text-sm leading-relaxed text-mute">{member.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
