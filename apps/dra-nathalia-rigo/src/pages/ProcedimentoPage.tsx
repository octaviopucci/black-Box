import { Link, Navigate, useParams } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { brand, procedures } from '@/data/site'
import { asset } from '@/lib/asset'
import { usePageMeta } from '@/lib/usePageMeta'

export default function ProcedimentoPage() {
  const { slug } = useParams()
  const item = procedures.find((p) => p.slug === slug)

  usePageMeta(
    item ? `${item.name} · Dra. Nathalia Rigo` : 'Procedimento',
    item?.body ?? '',
  )

  if (!item) return <Navigate to="/procedimentos" replace />

  return (
    <main>
      {item.image ? (
        <div className="relative max-h-[55vh] overflow-hidden bg-ink">
          <img
            src={asset(item.image)}
            alt={item.name}
            className="h-[55vh] w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[11px] uppercase tracking-mark text-gold">{item.area}</p>
        <h1 className="display mt-4 text-[clamp(2.8rem,7vw,4.5rem)] font-semibold leading-tight">
          {item.name}
        </h1>
        <p className="display mt-8 text-2xl leading-snug text-ink/90">{item.lead}</p>
        <p className="mt-6 leading-relaxed text-mute">{item.body}</p>
        <p className="mt-4 text-sm text-mute">{item.caption}</p>

        <div className="mt-12 flex flex-wrap gap-6 text-[11px] uppercase tracking-mark">
          <a
            href={brand.instagramDm}
            target="_blank"
            rel="noreferrer"
            className="bg-gold px-6 py-3 text-paper"
          >
            {brand.cta}
          </a>
          {!item.image && (
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-mute underline underline-offset-4"
            >
              Ver no Instagram
            </a>
          )}
          <Link to="/procedimentos" className="text-mute underline underline-offset-4">
            Todos os procedimentos
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  )
}
