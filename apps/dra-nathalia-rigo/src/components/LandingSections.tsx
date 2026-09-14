import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  brand,
  feedGallery,
  instagramHighlights,
  media,
  philosophyQuotes,
  procedures,
  results,
} from '@/data/site'
import { asset } from '@/lib/asset'

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function BrandIntroSection() {
  return (
    <section className="border-b border-ink/10 bg-paper py-16 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 md:grid-cols-[1.2fr_0.8fr] md:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-mark text-gold">@{brand.instagramHandle}</p>
          <h2 className="display mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight">
            {brand.businessName}
          </h2>
          <p className="mt-5 max-w-measure text-base leading-relaxed text-mute">
            {brand.bioLines[0]} {brand.bioLegacy}
          </p>
          <p className="mt-3 text-sm text-mute">
            {brand.instagramStats.posts} publicações · {brand.instagramStats.followers} seguidores ·{' '}
            {brand.bioLines[1]}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <img
            src={asset(media.logo)}
            alt="Nathalia Rigo Estética & Saúde"
            className="w-full object-cover"
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  )
}

export function ProceduresSection() {
  return (
    <section id="procedimentos" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="space-y-24">
          {procedures.map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.04}>
              <article
                className={`grid gap-8 md:grid-cols-2 md:items-center md:gap-14 ${
                  index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-mark text-gold">{item.area}</p>
                  <h3 className="display mt-3 text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-tight">
                    {item.name}
                  </h3>
                  <p className="display mt-4 text-xl leading-snug text-ink/90">{item.lead}</p>
                  <p className="mt-5 text-base leading-relaxed text-mute">{item.body}</p>
                  <p className="mt-4 text-[11px] uppercase tracking-mark text-mute">{item.caption}</p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      to={`/procedimentos/${item.slug}`}
                      className="text-[11px] uppercase tracking-mark text-gold underline underline-offset-[6px]"
                    >
                      Saiba mais
                    </Link>
                    {!item.image && (
                      <a
                        href={brand.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] uppercase tracking-mark text-mute underline underline-offset-[6px]"
                      >
                        Ver no Instagram
                      </a>
                    )}
                  </div>
                </div>

                {item.image ? (
                  <div className="overflow-hidden bg-ink/5">
                    <img
                      src={asset(item.image)}
                      alt={`${item.name} — foto publicada no Instagram`}
                      className="aspect-[4/5] w-full object-cover object-center md:aspect-[3/4]"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[280px] flex-col justify-center border border-ink/10 bg-paper px-8 py-10 md:min-h-[360px]">
                    <p className="text-[11px] uppercase tracking-mark text-gold">Feed @dranathaliarigo</p>
                    <p className="display mt-4 text-2xl font-semibold leading-snug">
                      Fotos e vídeos deste procedimento no Instagram
                    </p>
                    <a
                      href={brand.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 inline-flex w-fit bg-ink px-6 py-3 text-[11px] uppercase tracking-mark text-paper"
                    >
                      Abrir perfil
                    </a>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ResultsSection() {
  return (
    <section id="resultados" className="bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-mark text-gold-light/85">Resultados</p>
          <h2 className="display mt-4 max-w-xl text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[0.95]">
            Antes e depois reais
          </h2>
          <p className="mt-5 max-w-measure text-base leading-relaxed text-paper/65">
            Imagens publicadas no feed — naturalidade e expectativa realista, não filtro de revista.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {results.map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.08}>
              <figure>
                <img
                  src={asset(item.image)}
                  alt={item.title}
                  className="aspect-[3/4] w-full object-cover object-center"
                  loading="lazy"
                />
                <figcaption className="mt-5">
                  <p className="display text-2xl font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm text-paper/60">{item.caption}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HighlightsSection() {
  return (
    <section id="destaques" className="border-y border-ink/10 bg-paper py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-mark text-gold">Destaques</p>
          <h2 className="display mt-4 max-w-xl text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-tight">
            Temas do Instagram
          </h2>
          <p className="mt-4 max-w-measure text-sm leading-relaxed text-mute">
            Eixos visíveis no perfil @dranathaliarigo — preenchimentos, resultados, corporal e
            consultório.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {instagramHighlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article>
                <img
                  src={asset(item.image)}
                  alt={item.title}
                  className="aspect-[4/5] w-full object-cover object-center"
                  loading="lazy"
                />
                <h3 className="display mt-5 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16" delay={0.1}>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {philosophyQuotes.map((item) => (
              <blockquote key={item.quote} className="py-8">
                <p className="display text-[clamp(1.4rem,3vw,2rem)] font-medium leading-snug">
                  “{item.quote}”
                </p>
                <cite className="mt-3 block text-[11px] not-italic uppercase tracking-mark text-mute">
                  {item.source}
                </cite>
              </blockquote>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function FeedGallerySection() {
  return (
    <section className="bg-cream py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-mark text-gold">Feed</p>
          <h2 className="display mt-4 max-w-xl text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-tight">
            Galeria do Instagram
          </h2>
          <p className="mt-4 max-w-measure text-sm leading-relaxed text-mute">
            Fotos reais extraídas do perfil — profissional, espaço, procedimentos e resultados.
          </p>
        </Reveal>

        <div className="mt-12 columns-2 gap-4 md:columns-3 md:gap-6">
          {feedGallery.map((item, index) => (
            <Reveal key={item.image} delay={index * 0.03} className="mb-4 break-inside-avoid md:mb-6">
              <figure>
                <img
                  src={asset(item.image)}
                  alt={item.label}
                  className="w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="mt-2 text-[10px] uppercase tracking-mark text-mute">
                  {item.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function InstagramFeedSection() {
  return (
    <section className="bg-cream py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-mark text-gold">Instagram ao vivo</p>
          <h2 className="display mt-4 max-w-xl text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-tight">
            Feed, Reels e novidades
          </h2>
          <p className="mt-4 max-w-measure text-sm leading-relaxed text-mute">
            Preenchimento labial, criolipólise, laser e bastidores — tudo o que ainda não coube em
            foto local continua no perfil oficial.
          </p>
        </Reveal>

        <Reveal className="mt-12" delay={0.08}>
          <div className="mx-auto max-w-md overflow-hidden border border-ink/10 bg-paper">
            <iframe
              title="Instagram Dra. Nathalia Rigo"
              src={`https://www.instagram.com/${brand.instagramHandle}/embed`}
              className="aspect-[4/5] w-full border-0"
              loading="lazy"
            />
          </div>
          <p className="mt-6 text-center">
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] uppercase tracking-mark text-gold underline underline-offset-4"
            >
              Abrir @{brand.instagramHandle}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export function ProfessionalSection() {
  return (
    <section id="profissional" className="bg-ink text-paper">
      <div className="grid md:grid-cols-2">
        <Reveal className="relative min-h-[52vh] md:min-h-[78vh]">
          <img
            src={asset(media.profissional)}
            alt="Dra. Nathalia Rigo, enfermeira esteta em Sorocaba"
            className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/20 md:bg-gradient-to-r md:from-transparent md:to-ink/30" />
        </Reveal>

        <div className="flex flex-col justify-center px-5 py-16 md:px-12 md:py-24 lg:px-16">
          <Reveal>
            <p className="text-[11px] uppercase tracking-mark text-gold-light/80">Profissional</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,4.5vw,3.8rem)] font-semibold leading-[0.95]">
              Enfermeira esteta · COREN {brand.coren}
            </h2>
            <p className="mt-6 max-w-measure text-base leading-relaxed text-paper/72">
              {brand.profession}. {brand.experienceYears} anos de experiência publicados no perfil.
              Avaliação, anamnese e protocolo antes de qualquer procedimento.
            </p>
            <p className="mt-4 max-w-measure text-base leading-relaxed text-paper/72">
              ⚜ {brand.bioLegacy}
            </p>
            <Link
              to="/sobre"
              className="mt-10 inline-flex text-[11px] uppercase tracking-mark text-gold-light underline underline-offset-[6px]"
            >
              História completa
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function SpaceSection() {
  return (
    <section id="espaco" className="relative min-h-[70vh] overflow-hidden bg-ink text-paper md:min-h-[85vh]">
      <img
        src={asset(media.espaco)}
        alt="Consultório Nathalia Rigo Estética & Saúde no Parque São Bento, Sorocaba"
        className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/50" />
      <div className="grain absolute inset-0 opacity-25" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-24 md:min-h-[85vh] md:px-8 md:pb-20">
        <Reveal>
          <p className="text-[11px] uppercase tracking-mark text-gold-light/85">Espaço</p>
          <h2 className="display mt-4 max-w-2xl text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.95]">
            Consultório · Parque São Bento
          </h2>
          <p className="mt-5 max-w-measure text-base leading-relaxed text-paper/75">
            {brand.address.street}, {brand.address.complement}
            <br />
            {brand.address.district} · {brand.city}–{brand.address.state}
          </p>
          <p className="mt-3 text-sm text-paper/55">{brand.hoursNote}</p>
          <div className="mt-8 flex flex-wrap gap-6">
            <a
              href={brand.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] uppercase tracking-mark text-gold-light underline underline-offset-[6px]"
            >
              Ver no mapa
            </a>
            <a
              href={brand.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] uppercase tracking-mark text-paper/55 underline underline-offset-[6px]"
            >
              Facebook
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function ContactSection() {
  return (
    <section id="contato" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-mark text-gold">Agendamento</p>
          <h2 className="display mt-4 text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.95]">
            {brand.ctaAlt}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mute">
            Instagram, WhatsApp ou e-mail — canais publicados nos perfis oficiais da Dra. Nathalia.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={brand.instagramDm}
              target="_blank"
              rel="noreferrer"
              className="inline-flex bg-ink px-8 py-4 text-[11px] font-semibold uppercase tracking-mark text-paper transition hover:bg-gold hover:text-ink"
            >
              {brand.cta}
            </a>
            <a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex border border-ink/15 px-8 py-4 text-[11px] uppercase tracking-mark text-ink transition hover:border-gold hover:text-gold"
            >
              WhatsApp
            </a>
            <Link
              to="/contato"
              className="inline-flex border border-ink/15 px-8 py-4 text-[11px] uppercase tracking-mark text-ink transition hover:border-gold hover:text-gold"
            >
              Todos os contatos
            </Link>
          </div>
          <p className="mt-8 text-sm text-mute">
            <a href={`mailto:${brand.email}`} className="underline underline-offset-4">
              {brand.email}
            </a>
            {' · '}
            {brand.phone}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
