import { brand } from '@/data/site'

export default function Footer() {
  return (
    <footer className="border-t hairline px-5 py-10 md:px-10">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <p className="font-display text-lg text-ink">{brand.short}</p>
        <p className="max-w-sm text-xs leading-relaxed text-mute">
          Conteúdo a partir do Instagram @studiofabianaferrer e fontes públicas verificáveis.
        </p>
      </div>
    </footer>
  )
}
