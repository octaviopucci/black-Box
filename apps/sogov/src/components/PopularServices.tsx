import { motion } from 'framer-motion'
import { categories, services, type Service } from '../data/site'

export function PopularServices({
  onSelect,
  activeCategory,
  setActiveCategory,
}: {
  onSelect: (service: Service) => void
  activeCategory: string | null
  setActiveCategory: (c: string | null) => void
}) {
  const list = activeCategory
    ? services.filter((s) => s.category === activeCategory)
    : services.filter((s) => s.popular)

  return (
    <section
      id="servicos"
      className="scroll-mt-28 border-y border-line bg-mist px-5 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gov">Navegue por categoria</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
              Serviços essenciais
            </h2>
            <p className="mt-3 text-base leading-relaxed text-mute sm:text-lg">
              Os caminhos mais usados do portal — organizados com a linguagem do cidadão, sem banners
              competindo pela atenção.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`self-start text-sm font-bold transition ${
              activeCategory ? 'text-gov hover:text-gov-deep' : 'text-mute'
            }`}
          >
            {activeCategory ? 'Limpar filtro' : 'Mais acessados'}
          </button>
        </motion.div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const active = activeCategory === cat.name
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(active ? null : cat.name)}
                className={`shrink-0 rounded border px-4 py-2 text-sm font-bold transition ${
                  active
                    ? 'border-gov bg-gov text-white'
                    : 'border-line bg-white text-ink hover:border-gov hover:text-gov'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, i) => (
            <motion.button
              key={service.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              onClick={() => onSelect(service)}
              className="group border-t-4 border-t-gov/25 py-5 text-left transition hover:border-t-gov"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gov">
                {service.category}
              </p>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink transition group-hover:text-gov">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{service.description}</p>
              <span className="mt-4 inline-block text-sm font-bold text-gov opacity-0 transition group-hover:opacity-100">
                Acessar serviço →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
