import { brand, media } from '@/data/site'
import { Colophon } from '@/components/Colophon'
import { usePageMeta } from '@/lib/usePageMeta'

export default function EspacoPage() {
  usePageMeta(
    'O espaço · Parque São Bento, Sorocaba',
    'Dra. Nathalia Rigo atende na Rua Izidro Roque da Silva Telo, 35, piso superior, Parque São Bento, Sorocaba.',
  )

  return (
    <main className="bg-fog">
      <section className="relative min-h-[70vh] overflow-hidden bg-ink text-ice">
        <img
          src={media.room}
          alt="Ambiente de atendimento com maca, linho e luz do dia."
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="relative z-10 flex min-h-[70vh] flex-col justify-end px-5 pb-16 pt-32 md:px-12">
          <p className="text-[11px] uppercase tracking-mark text-ice/70">O espaço</p>
          <h1 className="display mt-4 max-w-[12ch] text-[clamp(3rem,9vw,7rem)] leading-[0.88]">
            Piso superior, Parque São Bento.
          </h1>
        </div>
      </section>

      <section className="px-5 py-20 md:px-12">
        <p className="display max-w-xl text-[clamp(1.8rem,4vw,3rem)] leading-[1.12]">
          {brand.address.street}
          <span className="block text-cryo">{brand.address.complement}</span>
          {brand.address.district} · {brand.city}–{brand.address.state}
        </p>
        <p className="mt-8 max-w-measure leading-relaxed text-mute">{brand.hoursNote}</p>
        <p className="mt-4 max-w-measure text-sm text-mute">
          A fotografia desta página é direção de arte do ateliê digital — um interior calmo, não
          um retrato documental da sala. O endereço, sim, é o publicado.
        </p>
        <a
          href={brand.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex text-[11px] uppercase tracking-mark underline decoration-cryo underline-offset-4"
        >
          Abrir no mapa
        </a>
      </section>
      <Colophon />
    </main>
  )
}
