import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { brand, media, procedures } from '@/data/site'
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

export function ProceduresSection() {
  return (
    <section id="procedimentos" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-mark text-gold">Procedimentos</p>
          <h2 className="display mt-4 max-w-2xl text-[clamp(2.4rem,5.5vw,4.5rem)] font-semibold leading-[0.95]">
            Estética avançada, publicada no Instagram
          </h2>
          <p className="mt-5 max-w-measure text-base leading-relaxed text-mute">
            Criolipólise, preenchimento labial e epilação a laser — os três eixos do perfil @
            {brand.instagramHandle}. Fotos de procedimentos e resultados no feed oficial.
          </p>
        </Reveal>

        <div className="mt-16 divide-y divide-ink/10 border-y border-ink/10">
          {procedures.map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.06}>
              <article className="grid gap-6 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-end md:gap-16 md:py-14">
                <div>
                  <p className="text-[10px] uppercase tracking-mark text-gold">{item.area}</p>
                  <h3 className="display mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight">
                    {item.name}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">{item.lead}</p>
                </div>
                <div>
                  <p className="text-base leading-relaxed text-ink/85">{item.body}</p>
                  <p className="mt-4 text-[11px] uppercase tracking-mark text-mute">{item.note}</p>
                  <Link
                    to={`/procedimentos/${item.slug}`}
                    className="mt-6 inline-flex text-[11px] uppercase tracking-mark text-gold underline underline-offset-[6px] transition hover:text-ink"
                  >
                    Saiba mais
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function InstagramFeedSection() {
  return (
    <section className="border-t border-ink/10 bg-cream py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-mark text-gold">Instagram</p>
          <h2 className="display mt-4 max-w-xl text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-tight">
            Fotos reais de procedimentos
          </h2>
          <p className="mt-4 max-w-measure text-sm leading-relaxed text-mute">
            Resultados, bastidores e novidades publicados por @{brand.instagramHandle} — a mesma
            referência visual do consultório.
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
            className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/20 md:bg-gradient-to-r md:from-transparent md:to-ink/30" />
        </Reveal>

        <div className="flex flex-col justify-center px-5 py-16 md:px-12 md:py-24 lg:px-16">
          <Reveal>
            <p className="text-[11px] uppercase tracking-mark text-gold-light/80">Profissional</p>
            <h2 className="display mt-4 text-[clamp(2.4rem,4.5vw,3.8rem)] font-semibold leading-[0.95]">
              Enfermagem com 12 anos de experiência
            </h2>
            <p className="mt-6 max-w-measure text-base leading-relaxed text-paper/72">
              {brand.profession}. Em estética avançada, o cuidado começa na avaliação — anamnese,
              indicação e protocolo antes de qualquer procedimento.
            </p>
            <p className="mt-4 max-w-measure text-base leading-relaxed text-paper/72">
              ⚜ {brand.bioLines[0]}
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
        alt="Consultório de estética avançada no Parque São Bento, Sorocaba"
        className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/50" />
      <div className="grain absolute inset-0 opacity-25" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-24 md:min-h-[85vh] md:px-8 md:pb-20">
        <Reveal>
          <p className="text-[11px] uppercase tracking-mark text-gold-light/85">Espaço</p>
          <h2 className="display mt-4 max-w-2xl text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.95]">
            Parque São Bento, piso superior
          </h2>
          <p className="mt-5 max-w-measure text-base leading-relaxed text-paper/75">
            {brand.address.street}, {brand.address.complement}
            <br />
            {brand.address.district} · {brand.city}–{brand.address.state}
          </p>
          <p className="mt-3 text-sm text-paper/55">{brand.hoursNote}</p>
          <a
            href={brand.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex text-[11px] uppercase tracking-mark text-gold-light underline underline-offset-[6px]"
          >
            Ver no mapa
          </a>
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
            {brand.cta}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mute">
            Pelo Instagram @{brand.instagramHandle}. Toque na bio ou envie direct — é o canal
            publicado pela profissional.
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
            <Link
              to="/contato"
              className="inline-flex border border-ink/15 px-8 py-4 text-[11px] uppercase tracking-mark text-ink transition hover:border-gold hover:text-gold"
            >
              Endereço e horários
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
