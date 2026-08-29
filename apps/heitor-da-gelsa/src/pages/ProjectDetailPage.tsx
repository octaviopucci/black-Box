import { Link, useParams } from 'react-router-dom'
import { getProjectBySlug, projects } from '@/data/projects'
import { ProjectCard } from '@/components/ProjectCard'
import { siteConfig } from '@/data/site'
import { NotFoundPage } from './NotFoundPage'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) return <NotFoundPage />

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 2)

  return (
    <article className="pt-24">
      <div className="relative aspect-[21/9] max-h-[480px] overflow-hidden bg-green-deep">
        <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-deep/80 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {project.isPlaceholder && (
          <span className="mb-4 inline-block rounded-sm bg-graphite px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Conteúdo placeholder — aguardando dados do cliente
          </span>
        )}

        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green">{project.category}</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight text-green-deep">
          {project.title}
        </h1>
        <p className="mt-3 text-graphite/60">
          {project.date} · {project.location}
        </p>

        <div className="mt-4 inline-block rounded-sm bg-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-dark">
          {project.status}
        </div>

        <p className="mt-8 text-lg font-semibold text-graphite">{project.summary}</p>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-graphite/80">
          <p>{project.description}</p>
        </div>

        {project.gallery.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-black text-green-deep">Galeria</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {project.gallery.map((img) => (
                <img key={img} src={img} alt="" className="aspect-video w-full rounded-sm object-cover" loading="lazy" />
              ))}
            </div>
          </section>
        )}

        {project.updates.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-black text-green-deep">Atualizações</h2>
            <ul className="mt-4 space-y-4">
              {project.updates.map((update, i) => (
                <li key={i} className="border-l-4 border-yellow pl-4">
                  <p className="text-sm font-bold text-green">{update.date}</p>
                  <p className="mt-1 text-graphite/80">{update.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.relatedLinks.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-black text-green-deep">Links relacionados</h2>
            <ul className="mt-4 space-y-2">
              {project.relatedLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-green hover:text-green-dark">
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md bg-yellow px-6 py-3 text-sm font-bold text-green-dark transition-colors hover:bg-yellow-gold"
          >
            Fale com Heitor
          </a>
          <Link to="/#contato" className="inline-flex items-center font-bold text-green hover:text-green-dark">
            ← Voltar para contato
          </Link>
        </div>
      </div>

      <section className="bg-[#f6faf8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-black text-green-deep">Veja outros projetos</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {others.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
