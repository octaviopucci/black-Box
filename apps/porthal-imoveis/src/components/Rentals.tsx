import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { rentProperties } from '../data/properties'
import { PropertyCard } from './PropertyCard'
import { Reveal } from './Reveal'

const PAGE = 6

export function Rentals({ filterIds }: { filterIds: string[] | null }) {
  const [visible, setVisible] = useState(PAGE)

  const list = useMemo(() => {
    if (filterIds === null) return rentProperties
    const set = new Set(filterIds)
    return rentProperties.filter((p) => set.has(p.id))
  }, [filterIds])

  const shown = list.slice(0, visible)

  return (
    <section id="alugar" className="scroll-mt-28 bg-mist/70 py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow">Alugar</p>
              <h2 className="display-title mt-3 text-ink">Imóveis para locação</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-mute">
                Residencial e comercial com atendimento próximo. Encontre o ponto certo para morar
                ou empreender em Capão Bonito e região.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <p className="text-sm text-mute">
                {list.length} {list.length === 1 ? 'opção' : 'opções'}
              </p>
              <Link
                to="/imoveis?tx=rent"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-deep"
              >
                Ver todas as locações
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>

        {shown.length ? (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
            {visible < list.length ? (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE)}
                  className="border border-ink/15 bg-white px-8 py-3.5 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand"
                >
                  Carregar mais
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-12 text-center text-mute">Nenhuma locação encontrada com esses filtros.</p>
        )}
      </div>
    </section>
  )
}
