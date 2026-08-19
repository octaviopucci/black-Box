import { brand } from '@/data/site'

export default function Footer() {
  return (
    <footer className="border-t border-forest/8 px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-lg text-forest">{brand.short}</p>
          <p className="mt-1 max-w-sm text-sm text-smoke">
            Depilação a laser e estética · {brand.address.city}/{brand.address.state}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href={brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sage hover:text-forest"
          >
            Instagram
          </a>
          <a href={brand.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-smoke hover:text-forest">
            Localização
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-smoke/80">
        Conteúdo construído a partir do Instagram oficial e informações públicas verificáveis. Sem
        números, depoimentos ou serviços inventados.
      </p>
    </footer>
  )
}
