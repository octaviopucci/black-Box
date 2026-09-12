import { Link } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { procedures } from '@/data/site'
import { asset } from '@/lib/asset'
import { usePageMeta } from '@/lib/usePageMeta'

export default function ProcedimentosPage() {
  usePageMeta(
    'Procedimentos · Dra. Nathalia Rigo',
    'Preenchimento labial e facial, tratamentos faciais, criolipólise e epilação a laser em Sorocaba.',
  )

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-[11px] uppercase tracking-mark text-gold">⚜ Estética & Saúde</p>
      <h1 className="display mt-4 max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-tight">
        Procedimentos publicados no perfil
      </h1>

      <ol className="mt-14 divide-y divide-ink/10">
        {procedures.map((item, index) => (
          <li key={item.slug}>
            <Link
              to={`/procedimentos/${item.slug}`}
              className="group grid gap-6 py-10 md:grid-cols-[120px_1fr_1.2fr] md:items-center"
            >
              <div className="overflow-hidden bg-ink/5">
                {item.image ? (
                  <img
                    src={asset(item.image)}
                    alt={item.name}
                    className="aspect-square w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-cream text-[10px] uppercase tracking-mark text-mute">
                    Instagram
                  </div>
                )}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-mark text-mute">
                  {String(index + 1).padStart(2, '0')} · {item.area}
                </span>
                <h2 className="display mt-2 text-4xl font-semibold group-hover:text-gold">{item.name}</h2>
              </div>
              <p className="text-sm leading-relaxed text-mute">{item.lead}</p>
            </Link>
          </li>
        ))}
      </ol>
      <Footer />
    </main>
  )
}
