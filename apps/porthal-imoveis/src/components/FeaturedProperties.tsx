import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { saleProperties } from '../data/properties'
import { PropertyCard } from './PropertyCard'
import { Reveal } from './Reveal'

const PAGE = 9

export function FeaturedProperties({ filterIds }: { filterIds: string[] | null }) {
  const [visible, setVisible] = useState(PAGE)

  const list = useMemo(() => {
    if (filterIds === null) return saleProperties
    const set = new Set(filterIds)
    return saleProperties.filter((p) => set.has(p.id))
  }, [filterIds])

  const shown = list.slice(0, visible)

  return (
    <section id="comprar" className="container-page scroll-mt-28 py-20 sm:py-28">
      <Reveal>
        <div className="flex flex-col justify-between gap-6 border-b border-line pb-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">Comprar</p>
            <h2 className="display-title mt-3 text-ink">Imóveis à venda</h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-mute">
              Valores à vista em destaque. Cada oportunidade com curadoria local, fotos reais e
              informações claras para decidir com confiança.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <p className="text-sm text-mute">
              {list.length} {list.length === 1 ? 'imóvel' : 'imóveis'}
            </p>
            <Link
              to="/imoveis?tx=sale"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition hover:text-brand-deep"
            >
              Ver catálogo completo
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
                Carregar mais ({list.length - visible} restantes)
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-12 text-center text-mute">Nenhum imóvel à venda com esses filtros.</p>
      )}
    </section>
  )
}
