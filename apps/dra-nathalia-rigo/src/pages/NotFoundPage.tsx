import { Link } from 'react-router-dom'
import { brand } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function NotFoundPage() {
  usePageMeta('Página não encontrada', '')

  return (
    <main className="mx-auto max-w-xl px-5 py-32 text-center md:px-8">
      <p className="text-3xl text-gold" aria-hidden>
        ⚜
      </p>
      <h1 className="display mt-6 text-5xl font-semibold">Página não encontrada</h1>
      <p className="mt-4 text-mute">Volte ao início ou fale no Instagram.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link to="/" className="text-[11px] uppercase tracking-mark text-gold underline underline-offset-4">
          Início
        </Link>
        <a
          href={brand.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] uppercase tracking-mark text-mute underline underline-offset-4"
        >
          @{brand.instagramHandle}
        </a>
      </div>
    </main>
  )
}
