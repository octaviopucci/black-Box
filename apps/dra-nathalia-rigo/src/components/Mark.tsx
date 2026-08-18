import { Link } from 'react-router-dom'

export function Mark() {
  return (
    <Link
      to="/"
      className="inline-flex items-baseline gap-2 tracking-mark text-[11px] uppercase text-ink"
      aria-label="Dra. Nathalia Rigo — início"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-cryo" aria-hidden />
      <span className="font-medium">Nathalia Rigo</span>
    </Link>
  )
}
