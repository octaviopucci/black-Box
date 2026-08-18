import { Link } from 'react-router-dom'
import { brand } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper px-5 py-14 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-2xl text-gold" aria-hidden>
            ⚜
          </p>
          <p className="display mt-3 text-3xl font-semibold">Dra. Nathalia Rigo</p>
          <p className="mt-2 text-sm text-mute">
            {brand.address.street}, {brand.address.complement}
            <br />
            {brand.address.district} · {brand.city}–{brand.address.state}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-mark text-mute">
          <li>
            <a href={brand.instagramUrl} target="_blank" rel="noreferrer">
              @{brand.instagramHandle}
            </a>
          </li>
          <li>
            <Link to="/contato">Contato</Link>
          </li>
          <li>
            <Link to="/privacidade">Privacidade</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
