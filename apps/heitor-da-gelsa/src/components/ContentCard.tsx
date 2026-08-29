import { Link } from 'react-router-dom'
import type { Article } from '@/data/site'
import { Reveal } from './Reveal'

interface ContentCardProps {
  article: Article
}

export function ContentCard({ article }: ContentCardProps) {
  return (
    <Reveal>
      <article className="group flex h-full flex-col overflow-hidden border border-green/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green">{article.category}</p>
            {article.isPlaceholder && (
              <span className="rounded-sm bg-graphite/10 px-2 py-0.5 text-[0.6rem] font-bold uppercase text-graphite/60">
                Placeholder
              </span>
            )}
          </div>
          <h3 className="mt-2 font-display text-xl font-black leading-tight text-green-deep">{article.title}</h3>
          <p className="mt-2 text-xs text-graphite/55">
            {article.date} · {article.readTime}
          </p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite/75">{article.summary}</p>
          <Link
            to={`/conteudos/${article.slug}`}
            className="mt-4 inline-flex text-sm font-bold uppercase tracking-wide text-green hover:text-green-dark"
          >
            Ler conteúdo →
          </Link>
        </div>
      </article>
    </Reveal>
  )
}
