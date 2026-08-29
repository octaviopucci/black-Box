import { articles } from '@/data/articles'
import { ContentCard } from './ContentCard'
import { Button } from './Button'
import { Reveal } from './Reveal'

export function ContentGrid() {
  const preview = articles.slice(0, 3)

  return (
    <section id="conteudos" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Conteúdos</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight text-green-deep">
            Central editorial
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {preview.map((article) => (
            <ContentCard key={article.slug} article={article} />
          ))}
        </div>

        <div className="mt-10">
          <Button to="/conteudos" variant="secondary">
            Ver todos os conteúdos
          </Button>
        </div>
      </div>
    </section>
  )
}
