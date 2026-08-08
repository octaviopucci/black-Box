import { Link } from 'react-router-dom'
import { brand } from '@/data/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <img src={brand.logo} alt="BASE" className="mb-3 h-7 w-auto opacity-90" />
          <p className="max-w-md text-sm text-ash">{brand.disclaimer}</p>
        </div>
        <div className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
          <Link to="/arena" className="hover:text-signal">
            Arena
          </Link>
          <Link to="/protocolo" className="hover:text-signal">
            Protocolo
          </Link>
          <a href={brand.cadastroExternal} className="hover:text-signal">
            Cadastro
          </a>
          <a href="https://usebase.vercel.app/termos" className="hover:text-signal">
            Termos
          </a>
          <a href="https://usebase.vercel.app/privacidade" className="hover:text-signal">
            Privacidade
          </a>
        </div>
      </div>
    </footer>
  )
}
