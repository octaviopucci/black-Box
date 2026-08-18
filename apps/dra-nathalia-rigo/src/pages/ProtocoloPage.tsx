import { Link, Navigate, useParams } from 'react-router-dom'
import { Colophon } from '@/components/Colophon'
import { chambers } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function ProtocoloPage() {
  const { slug } = useParams()
  const chamber = chambers.find((item) => item.slug === slug)

  usePageMeta(
    chamber ? `${chamber.name} · Dra. Nathalia Rigo` : 'Protocolo',
    chamber?.body ?? '',
  )

  if (!chamber) return <Navigate to="/protocolos" replace />

  return (
    <main className="bg-ink text-ice">
      <section className="relative min-h-[72vh] overflow-hidden">
        <img src={chamber.image} alt={chamber.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/25" />
        <div className="relative z-10 flex min-h-[72vh] flex-col justify-end px-5 pb-16 pt-32 md:px-12">
          <p className="text-[11px] uppercase tracking-mark text-ice/70">
            {chamber.field} · {chamber.reading}
          </p>
          <h1 className="display mt-4 max-w-[12ch] text-[clamp(3.2rem,10vw,8rem)] leading-[0.86] tracking-[-0.04em]">
            {chamber.name}
          </h1>
        </div>
      </section>

      <article className="px-5 py-20 md:px-12">
        <p className="display max-w-3xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.15]">{chamber.lead}</p>
        <p className="mt-8 max-w-measure text-lg leading-relaxed text-ice/75">{chamber.body}</p>
        <p className="mt-6 max-w-measure text-lg leading-relaxed text-sage">{chamber.after}</p>
        <div className="mt-14 flex flex-wrap gap-8 text-[11px] uppercase tracking-mark">
          <Link to="/avaliacao" className="underline decoration-sage underline-offset-4">
            Pedir avaliação
          </Link>
          <Link to="/protocolos" className="text-ice/60">
            Todos os protocolos
          </Link>
        </div>
      </article>
      <Colophon />
    </main>
  )
}
