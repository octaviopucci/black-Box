import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-sans text-3xl font-extrabold tracking-[-0.04em]">PORTHAL</p>
          <p className="mt-2 max-w-sm text-sm text-mute">
            {site.legalName}
            <br />
            CNPJ {site.cnpj}
          </p>
        </div>
        <p className="text-sm text-mute">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  )
}
