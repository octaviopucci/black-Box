import { DirectSheet } from '@/components/DirectSheet'
import { Footer } from '@/components/Footer'
import { brand } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function ContatoPage() {
  usePageMeta(
    'Contato · Dra. Nathalia Rigo',
    'Agende pelo Instagram, WhatsApp ou e-mail. Consultório no Parque São Bento, Sorocaba.',
  )

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-mark text-gold">Contato</p>
          <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-tight">
            {brand.ctaAlt}
          </h1>
          <p className="mt-6 leading-relaxed text-mute">
            Canais publicados no Instagram @dranathaliarigo e na página Facebook da profissional.
          </p>

          <div className="mt-10 space-y-6 text-sm">
            <p>
              <span className="text-[11px] uppercase tracking-mark text-gold">Instagram</span>
              <br />
              <a
                href={brand.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-lg text-ink underline decoration-gold/50 underline-offset-4"
              >
                @{brand.instagramHandle}
              </a>
            </p>
            <p>
              <span className="text-[11px] uppercase tracking-mark text-gold">WhatsApp</span>
              <br />
              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="text-lg text-ink underline decoration-gold/50 underline-offset-4"
              >
                {brand.phone}
              </a>
            </p>
            <p>
              <span className="text-[11px] uppercase tracking-mark text-gold">E-mail</span>
              <br />
              <a
                href={`mailto:${brand.email}`}
                className="text-lg text-ink underline decoration-gold/50 underline-offset-4"
              >
                {brand.email}
              </a>
            </p>
            <p>
              <span className="text-[11px] uppercase tracking-mark text-gold">Endereço</span>
              <br />
              {brand.address.street}, {brand.address.complement}
              <br />
              {brand.address.district} · {brand.city}–{brand.address.state}
            </p>
            <p className="text-mute">{brand.hoursNote}</p>
            <a
              href={brand.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-[11px] uppercase tracking-mark text-gold underline underline-offset-4"
            >
              Abrir no mapa
            </a>
          </div>
        </div>

        <DirectSheet />
      </div>
      <Footer />
    </main>
  )
}
