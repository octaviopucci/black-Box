import { site } from '../data/site'

function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 42 L32 18 L46 42" stroke="#F1F4F2" strokeWidth="3" strokeLinejoin="round" fill="none" />
      <path d="M24 42 L32 28 L40 42" stroke="#2FA6A0" strokeWidth="3" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink px-6 py-12 text-paper/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <Mark />
          <div>
            <p className="font-display text-sm text-paper">{site.name}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">
              {site.specialty} · {site.crm}
            </p>
          </div>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-paper/45">
          Exame de Calorimetria Indireta. As informações deste site têm caráter educativo e não substituem
          uma avaliação médica individual.
        </p>
      </div>
    </footer>
  )
}
