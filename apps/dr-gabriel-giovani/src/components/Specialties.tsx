import { site } from '@/data/site'

export function Specialties() {
  return (
    <section id="especialidades" className="bg-paper px-6 py-24 md:px-10 md:py-32 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal">Áreas de atuação</p>
        <h2 className="mt-4 max-w-lg font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em]">
          Especialidades
        </h2>

        <div className="mt-16 grid gap-0 border-t border-line md:grid-cols-3">
          {site.specialties.map((spec, i) => (
            <article
              key={spec.id}
              className={`border-b border-line py-10 md:border-b-0 md:py-12 ${i < site.specialties.length - 1 ? 'md:border-r' : ''}`}
            >
              <span className="font-display text-4xl font-light text-teal/30">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 font-display text-xl font-medium md:text-2xl">{spec.name}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute md:text-base">{spec.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
