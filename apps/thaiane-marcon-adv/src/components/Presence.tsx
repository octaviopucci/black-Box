import { Reveal } from '@/components/Reveal'
import { site } from '@/data/site'

export function Presence() {
  return (
    <section id="presenca" className="bg-ink px-5 py-24 text-paper md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[0.72rem] font-semibold tracking-mark text-white/55 uppercase">
            Presença
          </p>
          <h2 className="mt-4 max-w-measure font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05]">
            Formação contínua e conexão com a jovem advocacia.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-20">
          {site.presence.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.12}>
              <article
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                  index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">
                    {item.title}
                  </h3>
                  <blockquote className="mt-6 border-l border-accent/60 pl-5 text-lg leading-relaxed text-white/78">
                    “{item.quote}”
                  </blockquote>
                  <ul className="mt-8 flex flex-wrap gap-3">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="text-[0.72rem] font-medium tracking-wide text-white/55 uppercase"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
