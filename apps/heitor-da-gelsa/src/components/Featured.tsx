import { Link } from 'react-router-dom'
import { featuredItems } from '@/data/site'
import { Reveal } from './Reveal'

export function Featured() {
  const main = featuredItems.find((f) => f.featured) ?? featuredItems[0]
  const secondary = featuredItems.filter((f) => !f.featured)

  return (
    <section id="destaques" className="bg-green-deep py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow">Destaques</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight">Em destaque</h2>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.05}>
            <Link
              to={main.link}
              className="group relative block aspect-[4/3] overflow-hidden rounded-sm lg:aspect-auto lg:min-h-[420px]"
            >
              <img
                src={main.image}
                alt={main.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-deep via-green-deep/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow">{main.category}</p>
                <h3 className="mt-2 font-display text-2xl font-black sm:text-3xl">{main.title}</h3>
              </div>
            </Link>
          </Reveal>

          <div className="grid gap-6">
            {secondary.map((item, i) => (
              <Reveal key={item.id} delay={0.1 + i * 0.05}>
                <Link
                  to={item.link}
                  className="group grid grid-cols-[120px_1fr] overflow-hidden rounded-sm border border-white/10 bg-white/5 sm:grid-cols-[160px_1fr]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="p-4 sm:p-5">
                    {item.isPlaceholder && (
                      <span className="mb-2 inline-block text-[0.6rem] font-bold uppercase tracking-wider text-white/50">
                        Placeholder
                      </span>
                    )}
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-yellow">{item.category}</p>
                    <h3 className="mt-2 font-display text-lg font-bold leading-snug">{item.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
