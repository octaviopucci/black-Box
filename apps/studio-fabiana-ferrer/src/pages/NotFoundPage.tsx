import { Link } from 'react-router-dom'
import { brand } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'
import Shell from '@/components/Shell'

export default function NotFoundPage() {
  usePageMeta(`Página não encontrada · ${brand.short}`)

  return (
    <Shell>
      <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
        <p className="text-[0.72rem] font-semibold uppercase tracking-mark text-sage">404</p>
        <h1 className="mt-3 font-display text-4xl text-forest">Página não encontrada</h1>
        <Link
          to="/"
          className="mt-8 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-paper"
        >
          Voltar ao início
        </Link>
      </div>
    </Shell>
  )
}
