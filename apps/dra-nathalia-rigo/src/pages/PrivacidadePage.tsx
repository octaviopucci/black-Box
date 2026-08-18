import { Colophon } from '@/components/Colophon'
import { privacyPoints } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function PrivacidadePage() {
  usePageMeta(
    'Privacidade · Dra. Nathalia Rigo',
    'Como este site trata dados: sem cadastro, sem pagamento, conversa apenas no Instagram da profissional.',
  )

  return (
    <main className="bg-fog pt-28">
      <header className="px-5 md:px-12">
        <p className="text-[11px] uppercase tracking-mark text-mute">Privacidade</p>
        <h1 className="display mt-4 max-w-[14ch] text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.9]">
          Poucos dados. Nenhum cadastro.
        </h1>
      </header>
      <ul className="max-w-2xl space-y-6 px-5 py-16 text-lg leading-relaxed text-mute md:px-12">
        {privacyPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <Colophon />
    </main>
  )
}
