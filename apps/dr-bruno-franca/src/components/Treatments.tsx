import { treatments } from '@/data/site'
import { Reveal } from '@/components/Reveal'

export function Treatments() {
  return (
    <section id="tratamentos" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="eyebrow mb-6">Tratamentos</p>
          <h2 className="display-title max-w-[16ch] text-[clamp(2rem,4.5vw,3.5rem)] text-paper">
            Planejamento individualizado para cada sorriso
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {treatments.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08}>
              <article className="group">
                <div className="relative mb-6 aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 ease-clinic group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80" />
                </div>
                <h3 className="font-brand text-2xl font-semibold text-paper md:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-paper/60 md:text-base">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
