import { useDeferredValue, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Clock3, Search, Sparkles } from 'lucide-react'
import { services, type Service } from '../data/site'

const hotTerms = ['imposto de renda', 'assinatura', 'mei', 'inss', 'enem', 'bolsa família']

function matches(service: Service, q: string) {
  const needle = q.trim().toLowerCase()
  if (!needle) return false
  return (
    service.title.toLowerCase().includes(needle) ||
    service.description.toLowerCase().includes(needle) ||
    service.category.toLowerCase().includes(needle) ||
    service.keywords.some((k) => k.includes(needle) || needle.includes(k))
  )
}

export function ServiceSearch({
  onSelect,
  selectedId,
}: {
  onSelect: (service: Service) => void
  selectedId: string | null
}) {
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)

  const results = useMemo(() => {
    if (!deferred.trim()) return services.filter((s) => s.popular).slice(0, 6)
    return services.filter((s) => matches(s, deferred)).slice(0, 8)
  }, [deferred])

  const showingPopular = !deferred.trim()

  return (
    <section id="busca" className="relative scroll-mt-28 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gov">Serviços para você</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-5xl">
            O que você precisa resolver hoje?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-mute sm:text-lg">
            A mesma lógica do portal oficial — com busca mais direta e resultados prontos para
            concluir.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, delay: 0.08 }}
          className="mt-10"
        >
          <label className="relative block">
            <span className="sr-only">Buscar serviço no gov.br</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gov" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite aqui o que você procura..."
              className="w-full rounded border-2 border-gov bg-white py-4 pl-12 pr-5 text-base text-ink shadow-gov outline-none transition placeholder:text-mute/70 focus:border-gov-light focus:ring-4 focus:ring-gov-soft sm:py-5 sm:text-lg"
            />
          </label>

          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-mute">
              Termos mais buscados
            </p>
            <div className="flex flex-wrap gap-2">
              {hotTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded border border-line bg-white px-3 py-1.5 text-xs font-semibold text-gov transition hover:border-gov hover:bg-gov-mist"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-mute">
          <Sparkles className="h-4 w-4 text-gov" />
          {showingPopular ? 'Mais acessados' : `${results.length} resultado(s)`}
        </div>

        <div className="mt-4 grid gap-2">
          <AnimatePresence mode="popLayout">
            {results.map((service, i) => {
              const active = selectedId === service.id
              return (
                <motion.button
                  key={service.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  onClick={() => onSelect(service)}
                  className={`group flex w-full items-start justify-between gap-4 border-l-4 px-4 py-4 text-left transition sm:items-center sm:px-5 ${
                    active
                      ? 'border-l-flag-yellow bg-gov text-white shadow-gov'
                      : 'border-l-gov/30 bg-white hover:border-l-gov hover:bg-gov-mist'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-[0.16em] ${
                          active ? 'text-flag-yellow' : 'text-gov'
                        }`}
                      >
                        {service.category}
                      </span>
                      {service.digital && (
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            active ? 'bg-white/15 text-white' : 'bg-gov-soft text-gov-deep'
                          }`}
                        >
                          Digital
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-lg font-extrabold tracking-tight sm:text-xl">
                      {service.title}
                    </p>
                    <p className={`mt-1 text-sm leading-relaxed ${active ? 'text-white/80' : 'text-mute'}`}>
                      {service.description}
                    </p>
                  </div>
                  <div
                    className={`flex shrink-0 flex-col items-end gap-2 ${active ? 'text-white/85' : 'text-mute'}`}
                  >
                    <span className="inline-flex items-center gap-1 text-xs font-semibold">
                      <Clock3 className="h-3.5 w-3.5" />
                      {service.time}
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 ${active ? 'text-flag-yellow' : 'text-gov group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}
                    />
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>

          {!results.length && (
            <p className="border border-dashed border-line bg-white px-5 py-8 text-center text-mute">
              Nenhum serviço encontrado. Tente outro termo ou escolha um perfil abaixo.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
