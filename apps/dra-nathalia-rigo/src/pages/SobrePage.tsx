import { Link } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { brand, media, objections } from '@/data/site'
import { asset } from '@/lib/asset'
import { usePageMeta } from '@/lib/usePageMeta'

export default function SobrePage() {
  usePageMeta(
    'Sobre · Dra. Nathalia Rigo',
    'Enfermeira esteta em Sorocaba. 12 anos de experiência. Realçar sua beleza com resultados naturais e sofisticados.',
  )

  return (
    <main>
      <div className="relative min-h-[50vh] overflow-hidden bg-ink">
        <img
          src={asset(media.profissional)}
          alt="Dra. Nathalia Rigo"
          className="absolute inset-0 h-full w-full object-cover object-[center_18%] opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
        <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-8 md:px-8">
          <p className="text-[11px] uppercase tracking-mark text-gold-light/85">⚜ Sobre</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-tight text-paper">
            Dra. Nathalia Rigo
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-20">
      <p className="mt-2 text-sm uppercase tracking-mark text-mute">
        {brand.profession} · {brand.experienceYears} anos · {brand.city}
      </p>

      <div className="gold-line my-10" />

      <blockquote className="display text-2xl leading-snug">
        ⚜ {brand.bioLines[0]} ⚜
      </blockquote>
      <p className="mt-8 leading-relaxed text-mute">
        Este site espelha o que está publicado no Instagram @{brand.instagramHandle}: estética
        avançada, criolipólise em Sorocaba, atendimento com base em enfermagem e a promessa de
        resultados naturais e sofisticados — sem inventar currículo, preços ou depoimentos.
      </p>

      <dl className="mt-16 divide-y divide-ink/10">
        {objections.map((item) => (
          <div key={item.q} className="py-8">
            <dt className="display text-xl font-semibold">{item.q}</dt>
            <dd className="mt-3 leading-relaxed text-mute">{item.a}</dd>
          </div>
        ))}
      </dl>

      <Link
        to="/contato"
        className="mt-6 inline-flex text-[11px] uppercase tracking-mark text-gold underline underline-offset-4"
      >
        Agendar pelo Instagram
      </Link>
      </div>
      <Footer />
    </main>
  )
}
