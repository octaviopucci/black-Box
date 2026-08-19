import { Link } from 'react-router-dom'
import { brand } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'
import Shell from '@/components/Shell'

export default function NotFoundPage() {
  usePageMeta(`Página não encontrada · ${brand.short}`)

  return (
    <Shell>
      <div className="flex min-h-dvh flex-col items-start justify-center px-5 md:px-10">
        <p className="text-[0.68rem] font-medium uppercase tracking-mark text-mute">404</p>
        <h1 className="mt-4 font-display text-4xl text-ink">Página não encontrada</h1>
        <Link
          to="/"
          className="mt-8 border-b border-ink/30 pb-1 text-[0.75rem] font-medium uppercase tracking-mark text-ink"
        >
          Voltar
        </Link>
      </div>
    </Shell>
  )
}
