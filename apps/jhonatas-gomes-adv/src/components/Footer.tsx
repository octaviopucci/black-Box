import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-soft py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 text-sm text-mute md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {site.legalName}. Todos os direitos reservados.
        </p>
        <p className="max-w-md text-xs leading-relaxed">
          Conteúdo informativo baseado em publicações de @{site.instagram.handle}. Não substitui
          consulta jurídica individualizada.
        </p>
      </div>
    </footer>
  )
}
