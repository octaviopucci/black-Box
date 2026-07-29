import { motion } from 'framer-motion'
import { rentProperties } from '../data/properties'
import { whatsappUrl } from '../data/site'
import { PropertyCard } from './PropertyCard'

export function Rentals({ filterIds }: { filterIds: string[] | null }) {
  const list =
    filterIds === null
      ? rentProperties
      : rentProperties.filter((p) => filterIds.includes(p.id))

  return (
    <section id="alugar" className="relative overflow-hidden bg-ink py-20 text-white sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,52,42,0.28),transparent_42%),radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.05),transparent_40%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-soft">
              Alugar
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Imóveis para locação
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/65">
              Casas, pontos comerciais, salas e terrenos para alugar — com atendimento direto da
              equipe Porthal.
            </p>
          </div>
          <a
            href={whatsappUrl('Olá! Tenho interesse em imóveis para alugar.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/5"
          >
            Quero alugar · WhatsApp
          </a>
        </div>

        {list.length === 0 ? (
          <p className="border border-dashed border-white/20 px-6 py-12 text-white/60">
            Nenhum imóvel para alugar com esses filtros.
          </p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.slice(0, 9).map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} variant="rent" />
              ))}
            </div>

            {list.length > 9 ? (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 text-center text-sm text-white/45"
              >
                + {list.length - 9} oportunidades de locação — fale com a Porthal para a lista
                completa.
              </motion.p>
            ) : null}
          </>
        )}
      </div>
    </section>
  )
}
