import { Link } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { brand, highlights, procedures } from '@/data/site'

export default function HomePage() {
  return (
    <main>
      <Hero />

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <p className="text-[11px] uppercase tracking-mark text-gold">Procedimentos</p>
        <h2 className="display mt-3 max-w-xl text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-tight">
          O que o Instagram publica
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {procedures.map((item) => (
            <Link
              key={item.slug}
              to={`/procedimentos/${item.slug}`}
              className="group border border-ink/10 bg-paper p-8 transition hover:border-gold/40 hover:shadow-soft"
            >
              <p className="text-[10px] uppercase tracking-mark text-gold">{item.area}</p>
              <h3 className="display mt-3 text-3xl font-semibold group-hover:text-gold">{item.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-mute">{item.lead}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-paper py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-4 md:px-8">
          {highlights.map((item) => (
            <div key={item.label}>
              <p className="display text-3xl font-semibold text-gold">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-mark text-gold">Consultório</p>
            <h2 className="display mt-3 text-4xl font-semibold">Parque São Bento</h2>
            <p className="mt-4 leading-relaxed text-mute">
              {brand.address.street}, {brand.address.complement}
              <br />
              {brand.address.district} · {brand.city}
            </p>
            <p className="mt-3 text-sm text-mute">{brand.hoursNote}</p>
            <Link
              to="/contato"
              className="mt-8 inline-flex text-[11px] uppercase tracking-mark text-gold underline underline-offset-4"
            >
              Ver contato e agendar
            </Link>
          </div>
          <div className="border border-gold/20 bg-cream p-10 text-center">
            <p className="text-4xl text-gold" aria-hidden>
              ⚜
            </p>
            <p className="display mt-4 text-2xl">{brand.bioLines[0]}</p>
            <a
              href={brand.instagramDm}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex bg-ink px-6 py-3 text-[11px] uppercase tracking-mark text-paper"
            >
              {brand.cta}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
