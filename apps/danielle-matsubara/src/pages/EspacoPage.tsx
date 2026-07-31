import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Shell } from '../components/Shell'
import { Reveal } from '../components/Reveal'
import { asset, site, whatsappUrl } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

function WalkPanel({
  item,
  index,
}: {
  item: (typeof site.spaceWalk)[number]
  index: number
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const reverse = index % 2 === 1

  return (
    <article
      ref={ref}
      className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
        reverse ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
    >
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-wine">
          0{index + 1} · {item.title}
        </p>
        <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{item.title}</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-mute sm:text-base">{item.line}</p>
      </Reveal>
      <div className="relative overflow-hidden rounded-[1.75rem] shadow-soft">
        <motion.img
          style={{ y }}
          src={asset(item.image)}
          alt={`${item.title} · ${site.clinic}`}
          className="aspect-[5/4] w-full scale-110 object-cover"
          loading="lazy"
        />
      </div>
    </article>
  )
}

export function EspacoPage() {
  usePageMeta(site.seo.espaco.title, site.seo.espaco.description)

  return (
    <Shell>
      <section className="relative min-h-[70svh] overflow-hidden bg-wine-deep text-cream">
        <img
          src={asset('space/fachada.jpg')}
          alt="Fachada da Clínica Matsubara"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-wine-deep/60 to-wine-deep/40" />
        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
          <Reveal immediate>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-rose-soft">
              Espaço
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Entre no físico pelo digital.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream/70 sm:text-base">
              A Matsubara em Capão Bonito não é só endereço. É o ambiente onde a escuta acontece.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 sm:gap-24">
          {site.spaceWalk.map((item, index) => (
            <WalkPanel key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="bg-cream-soft px-5 py-16 sm:px-8 sm:py-20">
        <Reveal className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="display-title text-3xl text-ink sm:text-4xl">Como chegar</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">{site.address}</p>
              <p className="mt-2 text-sm text-mute">{site.hours}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-ghost"
                  data-cursor
                >
                  <MapPin className="h-4 w-4" />
                  Abrir no mapa
                </a>
                <a href={whatsappUrl()} className="cta-wine" data-cursor>
                  Agendar visita
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
            <Link to="/agendar" className="font-display text-2xl text-wine underline-offset-4 hover:underline">
              Ir para agendamento
            </Link>
          </div>
        </Reveal>
      </section>
    </Shell>
  )
}
