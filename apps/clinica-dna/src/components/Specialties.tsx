import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { specialties, whatsappUrl } from '../data/site'
import { Reveal, SectionHeading } from './Reveal'

export function Specialties() {
  return (
    <section id="especialidades" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Especialidades"
            title="Cuidado integrado para cada fase da vida"
            subtitle="Da pediatria à odontologia — uma clínica pensada para conectar saúde, confiança e proximidade em Capão Bonito."
          />
          <Reveal delay={0.15}>
            <a
              href={whatsappUrl('Olá! Quero saber mais sobre as especialidades da Clínica DNA.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-aqua-deep transition hover:text-navy"
            >
              Falar com a equipe
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {specialties.map((item, i) => (
            <Reveal key={item.id} delay={0.06 * i} className="h-full">
              <Link
                to={`/especialidade/${item.id}`}
                data-cursor="hover"
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-snow ring-1 ring-line transition duration-500 ease-silk hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-silk group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/55 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-snow/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy backdrop-blur">
                    {item.short}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-3xl font-semibold tracking-tight text-navy">
                      {item.title}
                    </h3>
                    <motion.span
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aqua-mist text-navy transition group-hover:bg-navy group-hover:text-snow"
                      whileHover={{ rotate: 45 }}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </motion.span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{item.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
