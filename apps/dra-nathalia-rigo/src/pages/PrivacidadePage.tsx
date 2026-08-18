import { Footer } from '@/components/Footer'
import { privacyPoints } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function PrivacidadePage() {
  usePageMeta('Privacidade · Dra. Nathalia Rigo', 'Política de privacidade do site.')

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 md:px-8 md:py-24">
      <h1 className="display text-4xl font-semibold">Privacidade</h1>
      <ul className="mt-10 space-y-4 leading-relaxed text-mute">
        {privacyPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <Footer />
    </main>
  )
}
