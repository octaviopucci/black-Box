import { Link } from 'react-router-dom'
import { brand } from '@/data/site'

export function Colophon() {
  return (
    <footer className="border-t border-ink/10 bg-fog px-5 py-16 md:px-12">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display text-3xl leading-none">{brand.short}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
            {brand.profession}. {brand.address.street}, {brand.address.complement} —{' '}
            {brand.address.district}, {brand.city}.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] uppercase tracking-mark text-mute">
          <li>
            <a href={brand.instagramUrl} rel="noreferrer" target="_blank">
              Instagram
            </a>
          </li>
          <li>
            <Link to="/avaliacao">Avaliação</Link>
          </li>
          <li>
            <Link to="/privacidade">Privacidade</Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
