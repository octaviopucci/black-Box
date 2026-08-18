import { Link, Navigate, useParams } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { brand, procedures } from '@/data/site'
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
    <main className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      <p className="text-[11px] uppercase tracking-mark text-gold">{item.area}</p>
      <h1 className="display mt-4 text-[clamp(2.8rem,7vw,4.5rem)] font-semibold leading-tight">
        {item.name}
      </h1>
      <p className="display mt-8 text-2xl leading-snug text-ink/90">{item.lead}</p>
      <p className="mt-6 leading-relaxed text-mute">{item.body}</p>

      <div className="mt-12 flex flex-wrap gap-6 text-[11px] uppercase tracking-mark">
        <a
          href={brand.instagramDm}
          target="_blank"
          rel="noreferrer"
          className="bg-gold px-6 py-3 text-paper"
        >
          {brand.cta}
        </a>
        <Link to="/procedimentos" className="text-mute underline underline-offset-4">
          Todos os procedimentos
        </Link>
      </div>
      <Footer />
    </main>
  )
}
