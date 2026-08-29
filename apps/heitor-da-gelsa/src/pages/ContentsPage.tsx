import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ContentCategory } from '@/data/site'
import { articles } from '@/data/site'
import { ContentCard } from '@/components/ContentCard'
import { Reveal } from '@/components/Reveal'

const filters: ContentCategory[] = [
  'TODOS',
  'SAÚDE',
  'CIDADE',
  'INFRAESTRUTURA',
  'COMUNIDADE',
  'FISCALIZAÇÃO',
  'VÍDEOS',
]

export function ContentsPage() {
  const [active, setActive] = useState<ContentCategory>('TODOS')

  const filtered = useMemo(() => {
    if (active === 'TODOS') return articles
    if (active === 'VÍDEOS') return articles.filter((a) => a.category === 'VÍDEOS')
    return articles.filter((a) => a.category === active)
  }, [active])

  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <Link to="/" className="text-sm font-semibold text-green hover:text-green-dark">
            ← Voltar ao início
          </Link>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,5vw,4rem)] font-black leading-tight text-green-deep">
            Conteúdos
          </h1>
          <p className="mt-4 max-w-2xl text-graphite/75">
            Central editorial com registros, posicionamentos e informações sobre a atuação pública.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActive(filter)}
              className={`rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                active === filter
                  ? 'bg-green text-white'
                  : 'bg-green/10 text-green hover:bg-green/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <ContentCard key={article.slug} article={article} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-graphite/60">Nenhum conteúdo nesta categoria ainda.</p>
        )}
      </div>
    </div>
  )
}
