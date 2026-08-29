import { Link, useParams } from 'react-router-dom'
import { getArticleBySlug, articles } from '@/data/articles'
import { ContentCard } from '@/components/ContentCard'
import { NotFoundPage } from './NotFoundPage'

export function ContentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? getArticleBySlug(slug) : undefined

  if (!article) return <NotFoundPage />

  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 2)

  return (
    <article className="pt-28 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link to="/conteudos" className="text-sm font-semibold text-green hover:text-green-dark">
          ← Voltar aos conteúdos
        </Link>

        {article.isPlaceholder && (
          <span className="mt-6 inline-block rounded-sm bg-graphite px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Conteúdo placeholder — aguardando dados do cliente
          </span>
        )}

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-green">{article.category}</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] font-black leading-tight text-green-deep">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-graphite/60">
          {article.date} · {article.readTime}
          {article.source && ` · Fonte: ${article.source}`}
        </p>

        <img
          src={article.image}
          alt={article.title}
          className="mt-8 aspect-video w-full rounded-sm object-cover"
        />

        <div className="prose prose-lg mt-8 max-w-none space-y-4 text-base leading-relaxed text-graphite/85">
          {article.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 bg-[#f6faf8] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-black text-green-deep">Conteúdos relacionados</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {related.map((a) => (
                <ContentCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
