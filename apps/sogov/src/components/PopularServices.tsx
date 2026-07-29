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
    <section id="servicos" className="scroll-mt-24 border-y border-line/80 bg-white/55 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-xl">
            <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Serviços essenciais
            </h2>
            <p className="mt-3 text-base leading-relaxed text-mute sm:text-lg">
              Os caminhos mais usados — sem banners, sem ruído. Só o que importa para concluir.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`self-start text-sm font-semibold transition ${
              activeCategory ? 'text-brand hover:text-brand-deep' : 'text-mute'
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
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'border-brand bg-brand text-white'
                    : 'border-line bg-paper text-mute hover:border-brand/40 hover:text-brand'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((service, i) => (
            <motion.button
              key={service.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.45 }}
              onClick={() => onSelect(service)}
              className="group border-t border-line pt-5 text-left transition hover:border-brand"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/65">
                {service.category}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-ink transition group-hover:text-brand">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{service.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand opacity-0 transition group-hover:opacity-100">
                Iniciar →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
