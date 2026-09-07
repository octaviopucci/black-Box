import { useState } from 'react'
import { projects, type ProjectCase } from '../../data/projects'
import { Reveal } from '../ui/Reveal'
import { SectionHeader } from '../ui/SectionHeader'
import { Button } from '../ui/Button'
import { ProjectModal } from '../project/ProjectModal'

function ProjectVisual({ project }: { project: ProjectCase }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#0c0c0e]">
      <div className="absolute inset-0 bb-grid-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent" />
      <div className="absolute inset-0 p-5 sm:p-7">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
            <span>Projeto / {project.number}</span>
            <span>{project.year}</span>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-silver">
              {project.category}
            </p>
            <p className="mt-3 font-display text-2xl uppercase tracking-tight text-paper sm:text-3xl">
              {project.title}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mute"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Portfolio() {
  const [active, setActive] = useState<ProjectCase | null>(null)

  return (
    <section id="projetos" className="bb-section border-t border-white/10">
      <div className="bb-container">
        <Reveal>
          <SectionHeader
            title="Projetos selecionados"
            subtitle="Alguns sistemas que demonstram o que podemos construir."
            eyebrow="Portfólio"
          />
        </Reveal>

        <div className="mt-14 space-y-16 lg:space-y-24">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={0.05 * (i % 2)}>
              <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                <div className={i % 2 === 1 ? 'lg:order-2' : undefined}>
                  <button
                    type="button"
                    className="group block w-full text-left transition duration-500 hover:opacity-95"
                    onClick={() => setActive(project)}
                    aria-label={`Abrir estudo de caso: ${project.title}`}
                  >
                    <div className="overflow-hidden transition duration-500 group-hover:brightness-110">
                      <ProjectVisual project={project} />
                    </div>
                  </button>
                </div>

                <div className={i % 2 === 1 ? 'lg:order-1 lg:text-right' : undefined}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                    {project.number} · {project.category}
                  </p>
                  <h3 className="mt-4 font-display text-3xl uppercase tracking-tight text-paper sm:text-4xl">
                    {project.title}
                  </h3>
                  <p
                    className={`mt-5 text-base leading-relaxed text-mute ${
                      i % 2 === 1 ? 'lg:ml-auto' : ''
                    } max-w-md`}
                  >
                    {project.summary}
                  </p>
                  <div
                    className={`mt-5 flex flex-wrap gap-2 ${i % 2 === 1 ? 'lg:justify-end' : ''}`}
                  >
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[11px] uppercase tracking-[0.16em] text-silver"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className={`mt-8 ${i % 2 === 1 ? 'lg:flex lg:justify-end' : ''}`}>
                    <Button variant="secondary" arrow onClick={() => setActive(project)}>
                      Ver projeto
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  )
}
