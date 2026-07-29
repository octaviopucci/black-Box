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
    <section id="busca" className="relative scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            O que você precisa resolver hoje?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-mute sm:text-lg">
            Digite em linguagem natural. A busca prioriza conclusão — não menus.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="mt-10"
        >
          <label className="relative block">
            <span className="sr-only">Buscar serviço</span>
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: consultar imposto de renda, abrir MEI, CNH digital…"
              className="w-full rounded-full border border-line bg-white/90 py-5 pl-14 pr-6 text-base text-ink shadow-soft outline-none ring-brand/30 transition placeholder:text-mute/70 focus:border-brand focus:ring-4"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            {hotTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-medium text-mute transition hover:border-brand/40 hover:text-brand"
              >
                {term}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="mt-8 flex items-center gap-2 text-sm text-mute">
          <Sparkles className="h-4 w-4 text-brass" />
          {showingPopular ? 'Mais acessados agora' : `${results.length} resultado(s)`}
        </div>

        <div className="mt-4 grid gap-3">
          <AnimatePresence mode="popLayout">
            {results.map((service, i) => {
              const active = selectedId === service.id
              return (
                <motion.button
                  key={service.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                  onClick={() => onSelect(service)}
                  className={`group flex w-full items-start justify-between gap-4 rounded-2xl border px-5 py-4 text-left transition sm:items-center sm:px-6 ${
                    active
                      ? 'border-brand bg-brand text-white shadow-soft'
                      : 'border-line bg-white/80 hover:border-brand/35 hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          active ? 'text-brass-soft' : 'text-brand/70'
                        }`}
                      >
                        {service.category}
                      </span>
                      {service.digital && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            active ? 'bg-white/15 text-white' : 'bg-brand-mist text-brand'
                          }`}
                        >
                          100% digital
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 font-display text-lg font-semibold tracking-tight sm:text-xl">
                      {service.title}
                    </p>
                    <p className={`mt-1 text-sm leading-relaxed ${active ? 'text-white/75' : 'text-mute'}`}>
                      {service.description}
                    </p>
                  </div>
                  <div
                    className={`flex shrink-0 flex-col items-end gap-2 ${active ? 'text-white/80' : 'text-mute'}`}
                  >
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Clock3 className="h-3.5 w-3.5" />
                      {service.time}
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 transition ${active ? 'text-brass-soft' : 'text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}
                    />
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>

          {!results.length && (
            <p className="rounded-2xl border border-dashed border-line bg-white/50 px-5 py-8 text-center text-mute">
              Nenhum serviço encontrado. Tente outro termo ou escolha um perfil abaixo.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
