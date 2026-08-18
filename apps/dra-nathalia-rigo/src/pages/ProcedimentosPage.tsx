import { Link } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { procedures } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function ProcedimentosPage() {
  usePageMeta(
    'Procedimentos · Dra. Nathalia Rigo',
    'Criolipólise, preenchimento labial e epilação a laser — estética avançada em Sorocaba.',
  )

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-[11px] uppercase tracking-mark text-gold">⚜ Estética avançada</p>
      <h1 className="display mt-4 max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-tight">
        Procedimentos publicados no perfil
      </h1>

      <ol className="mt-14 divide-y divide-ink/10">
        {procedures.map((item, index) => (
          <li key={item.slug}>
            <Link
              to={`/procedimentos/${item.slug}`}
              className="group flex flex-col gap-2 py-10 md:flex-row md:items-baseline md:justify-between"
            >
              <div>
                <span className="text-[11px] uppercase tracking-mark text-mute">
                  {String(index + 1).padStart(2, '0')} · {item.area}
                </span>
                <h2 className="display mt-2 text-4xl font-semibold group-hover:text-gold">{item.name}</h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-mute">{item.lead}</p>
            </Link>
          </li>
        ))}
      </ol>
      <Footer />
    </main>
  )
}
