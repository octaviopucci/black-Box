import { projects } from '@/data/projects'
import { ProjectCard } from './ProjectCard'
import { Reveal } from './Reveal'

export function Projects() {
  return (
    <section id="projetos" className="bg-[#f6faf8] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">Projetos e ações</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight text-green-deep">
            Projetos e ações
          </h2>
          <p className="mt-4 max-w-2xl text-base text-graphite/75">
            Conheça iniciativas, demandas e ações acompanhadas ao longo da atuação pública.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
