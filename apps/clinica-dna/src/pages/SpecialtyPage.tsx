import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { specialties, whatsappUrl } from '../data/site'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { Reveal } from '../components/Reveal'
import { NotFoundPage } from './NotFoundPage'

export function SpecialtyPage() {
  const { id } = useParams()
  const specialty = specialties.find((s) => s.id === id)

  if (!specialty) return <NotFoundPage />

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <Reveal>
            <Link
              to="/#especialidades"
              className="inline-flex items-center gap-2 text-sm font-medium text-mute transition hover:text-navy"
            >
              <ArrowLeft className="h-4 w-4" />
              Especialidades
            </Link>
          </Reveal>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className="lg:col-span-6">
              <div className="overflow-hidden rounded-[2rem]">
                <img
                  src={specialty.image}
                  alt={specialty.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </Reveal>

            <div className="lg:col-span-6">
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-aqua-deep">
                  {specialty.short}
                </p>
                <h1 className="mt-3 font-display text-[clamp(2.6rem,6vw,4.4rem)] font-semibold leading-[0.98] tracking-tight text-navy">
                  {specialty.title}
                </h1>
                <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">
                  {specialty.description}
                </p>
              </Reveal>

              <Reveal delay={0.1} className="mt-8">
                <ul className="space-y-3">
                  {specialty.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-snow/80 px-4 py-3 text-sm text-navy"
                    >
                      <span className="h-2 w-2 rounded-full bg-aqua" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.18} className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl(
                    `Olá! Vim pelo site da Clínica DNA e gostaria de agendar ${specialty.title}.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-snow transition hover:bg-abyss"
                >
                  Agendar {specialty.title}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <Link
                  to="/#contato"
                  className="inline-flex rounded-full border border-line px-6 py-3.5 text-sm font-medium text-navy transition hover:border-aqua"
                >
                  Outras dúvidas
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
