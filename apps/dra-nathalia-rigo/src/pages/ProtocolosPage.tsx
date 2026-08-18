import { Link } from 'react-router-dom'
import { Colophon } from '@/components/Colophon'
import { chambers } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function ProtocolosPage() {
  usePageMeta(
    'Protocolos · Dra. Nathalia Rigo',
    'Criolipólise, preenchimento labial e epilação a laser com a enfermeira esteta Dra. Nathalia Rigo, em Sorocaba.',
  )

  return (
    <main className="bg-fog pt-28">
      <header className="px-5 md:px-12">
        <p className="text-[11px] uppercase tracking-mark text-mute">Escala</p>
        <h1 className="display mt-4 max-w-[14ch] text-[clamp(3rem,9vw,7rem)] leading-[0.88] tracking-[-0.04em]">
          Três protocolos. Uma avaliação.
        </h1>
      </header>

      <ol className="mt-16">
        {chambers.map((chamber, index) => (
          <li key={chamber.slug} className="border-t border-ink/10">
            <Link
              to={`/protocolos/${chamber.slug}`}
              className="group grid gap-4 px-5 py-10 md:grid-cols-[8rem_1fr_auto] md:items-end md:px-12 md:py-14"
            >
              <span className="display text-3xl text-cryo">{chamber.reading}</span>
              <span>
                <span className="block text-[11px] uppercase tracking-mark text-mute">
                  {String(index + 1).padStart(2, '0')} · {chamber.field}
                </span>
                <span className="display mt-2 block text-[clamp(2rem,5vw,4rem)] leading-[0.92] tracking-[-0.03em] group-hover:text-cryo">
                  {chamber.name}
                </span>
              </span>
              <span className="text-[11px] uppercase tracking-mark text-mute">Abrir</span>
            </Link>
          </li>
        ))}
      </ol>
      <Colophon />
    </main>
  )
}
