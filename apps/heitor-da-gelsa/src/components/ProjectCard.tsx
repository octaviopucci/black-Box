import { Link } from 'react-router-dom'
import type { Project } from '@/data/site'
import { Reveal } from './Reveal'

interface ProjectCardProps {
  project: Project
}

const statusColors: Record<Project['status'], string> = {
  'CONCLUÍDO': 'bg-green text-white',
  'EM ANDAMENTO': 'bg-yellow text-green-dark',
  'EM ACOMPANHAMENTO': 'bg-blue-support text-white',
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Reveal>
      <article className="group flex h-full flex-col overflow-hidden border border-green/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {project.isPlaceholder && (
            <span className="absolute left-3 top-3 rounded-sm bg-graphite/80 px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white">
              Placeholder
            </span>
          )}
          <span
            className={`absolute bottom-3 left-3 rounded-sm px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${statusColors[project.status]}`}
          >
            {project.status}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green">{project.category}</p>
          <h3 className="mt-2 font-display text-xl font-black leading-tight text-green-deep">{project.title}</h3>
          <p className="mt-2 text-sm text-graphite/60">
            {project.date} · {project.location}
          </p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite/75">{project.summary}</p>
          <Link
            to={`/projetos/${project.slug}`}
            className="mt-5 inline-flex items-center text-sm font-bold uppercase tracking-wide text-green hover:text-green-dark"
          >
            Ver detalhes →
          </Link>
        </div>
      </article>
    </Reveal>
  )
}
