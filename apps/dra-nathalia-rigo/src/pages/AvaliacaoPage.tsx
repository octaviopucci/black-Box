import { DirectSheet } from '@/components/DirectSheet'
import { Colophon } from '@/components/Colophon'
import { brand } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function AvaliacaoPage() {
  usePageMeta(
    'Avaliação · Dra. Nathalia Rigo',
    'Monte a mensagem e fale com a Dra. Nathalia Rigo pelo Instagram para agendar avaliação em Sorocaba.',
  )

  return (
    <main className="bg-ice pt-28">
      <header className="px-5 md:px-12">
        <p className="text-[11px] uppercase tracking-mark text-mute">Consulta de chegada</p>
        <h1 className="display mt-4 max-w-[14ch] text-[clamp(3rem,8vw,6.4rem)] leading-[0.9] tracking-[-0.04em]">
          Diga o que a pele está pedindo.
        </h1>
        <p className="mt-6 max-w-measure text-lg leading-relaxed text-mute">
          Escolha o protocolo e o tom da visita. Copiamos o texto; o Instagram @{brand.instagramHandle}{' '}
          abre em seguida. Não há WhatsApp verificado neste site.
        </p>
      </header>
      <div className="px-5 py-16 md:px-12">
        <DirectSheet />
      </div>
      <Colophon />
    </main>
  )
}
