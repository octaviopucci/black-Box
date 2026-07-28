import { motion } from 'framer-motion'
import { ArrowUpRight, Box, Shield } from 'lucide-react'
import { projects, type ProjectStatus } from './data/projects'

const statusLabel: Record<ProjectStatus, string> = {
  ativo: 'Ativo',
  demo: 'Demo',
  manutencao: 'Manutenção',
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(42,42,46,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(42,42,46,0.35)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-signal/50 bg-panel">
            <Box className="h-5 w-5 text-signal" />
          </div>
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight text-sand">BLACK BOX</p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-sand/40">Client hosting</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 text-xs text-sand/50 sm:flex">
          <Shield className="h-3.5 w-3.5 text-signal" />
          Ambiente seguro de demonstração
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-10 sm:pt-16">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-signal">Portal</p>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-sand sm:text-6xl md:text-7xl">
            BLACK BOX
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-sand/60 sm:text-lg">
            Hospedagem e vitrine de projetos para clientes. Use este ambiente para visualizar,
            validar e, quando fizer sentido, operar sem infraestrutura própria.
          </p>
        </motion.section>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-wide text-sand">Projetos</h2>
            <p className="text-sm text-sand/40">{projects.length} publicado(s)</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project, i) => (
              <motion.a
                key={project.id}
                href={project.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.15 }}
                className="group relative overflow-hidden rounded-2xl border border-line bg-panel/90 p-6 transition hover:border-signal/50"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-signal/10 blur-2xl transition group-hover:bg-signal/20" />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-sand/40">{project.client}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-wide text-sand">
                      {project.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-signal/40 bg-signal/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-signal">
                    {statusLabel[project.status]}
                  </span>
                </div>
                <p className="relative mt-3 text-sm leading-relaxed text-sand/55">{project.description}</p>
                <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-line px-2 py-1 text-[11px] text-sand/45"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-signal">
                    Abrir
                    <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <footer className="mt-20 border-t border-line pt-6 text-sm text-sand/35">
          © {new Date().getFullYear()} Black Box · Hospedagem de projetos para clientes
        </footer>
      </main>
    </div>
  )
}
