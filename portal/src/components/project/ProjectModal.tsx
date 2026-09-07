import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ProjectCase } from '../../data/projects'
import { Button } from '../ui/Button'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Props = {
  project: ProjectCase | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: Props) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            aria-label="Fechar estudo de caso"
            onClick={onClose}
          />

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[92svh] w-full overflow-y-auto border border-white/10 bg-[#0a0a0b] sm:max-w-3xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a0a0b]/95 px-5 py-4 backdrop-blur sm:px-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                Estudo de caso
              </p>
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver transition hover:text-paper"
              >
                Fechar ✕
              </button>
            </div>

            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                <span>Projeto {project.number}</span>
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>

              <h2
                id="project-modal-title"
                className="mt-5 font-display text-3xl uppercase tracking-tight text-paper sm:text-5xl"
              >
                {project.title}
              </h2>

              <section className="mt-10">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                  O problema
                </h3>
                <p className="mt-3 text-base leading-relaxed text-silver">{project.problem}</p>
              </section>

              <section className="mt-9">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                  A solução
                </h3>
                <p className="mt-3 text-base leading-relaxed text-silver">{project.solution}</p>
              </section>

              <section className="mt-9">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                  Como funciona
                </h3>
                <ol className="mt-5 space-y-0 border border-white/10 bg-white/[0.02] p-5">
                  {project.flow.map((step, i) => (
                    <li key={step} className="font-mono text-[12px] uppercase tracking-[0.16em]">
                      <span className="text-paper">{step}</span>
                      {i < project.flow.length - 1 ? (
                        <span className="my-2 block text-mute" aria-hidden="true">
                          ↓
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mt-9">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                  Tecnologias
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-silver"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-9">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.22em] text-mute">
                  Impacto
                </h3>
                <ul className="mt-4 space-y-3">
                  {project.impact.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-silver">
                      <span className="mt-1 text-mute" aria-hidden="true">
                        →
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="mt-10">
                <Button href="#contato" arrow onClick={onClose}>
                  Quero construir algo assim
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
