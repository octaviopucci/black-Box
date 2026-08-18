import { Link } from 'react-router-dom'
import { media } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function NotFoundPage() {
  usePageMeta('Página não encontrada · Dra. Nathalia Rigo', 'Este endereço não existe neste site.')

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink text-ice">
      <img
        src={media.frost}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-ink/55" />
      <div className="relative z-10 flex min-h-dvh flex-col justify-end px-5 pb-24 md:px-12">
        <p className="text-[11px] uppercase tracking-mark text-ice/70">404</p>
        <h1 className="display mt-4 max-w-[12ch] text-[clamp(3rem,9vw,7rem)] leading-[0.88]">
          Esta página derreteu.
        </h1>
        <p className="mt-6 max-w-md text-lg text-ice/80">A pele, não. Volte ao limiar.</p>
        <Link
          to="/"
          className="mt-10 text-[11px] uppercase tracking-mark underline decoration-sage underline-offset-4"
        >
          Ir ao início
        </Link>
      </div>
    </main>
  )
}
