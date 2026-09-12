import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper px-6 py-8 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 text-xs text-mute md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.fullName} · CRO {site.cro}
        </p>
        <p className="text-mute/70">Conteúdo e imagens: {site.instagram.url.replace('https://www.', '@')}</p>
      </div>
    </footer>
  )
}
