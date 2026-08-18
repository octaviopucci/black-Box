import { useMotionValueEvent, useScroll } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Chapter } from '@/components/Chapter'
import { Colophon } from '@/components/Colophon'
import { Limiar } from '@/components/Limiar'
import { setMercury } from '@/components/Atelier'
import { brand, chambers, media } from '@/data/site'
import { useCalmMotion } from '@/lib/useCalmMotion'

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const reduce = useCalmMotion()

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (reduce) return
    setMercury(12 + value * 78)
  })

  return (
    <main>
      <Limiar />

      <section className="bg-ice px-5 py-24 md:px-12 md:py-32">
        <p className="text-[11px] uppercase tracking-mark text-mute">Três temperaturas</p>
        <h2 className="display mt-4 max-w-[16ch] text-[clamp(2.4rem,7vw,5.4rem)] leading-[0.92] tracking-[-0.04em]">
          Frio, volume e luz. Nada mais.
        </h2>
        <p className="mt-6 max-w-measure text-lg leading-relaxed text-mute">
          O espaço da Dra. Nathalia Rigo publica três protocolos: criolipólise, preenchimento labial
          e epilação a laser. O resto se decide na avaliação — não num catálogo.
        </p>
      </section>

      {chambers.map((chamber, index) => (
        <Chapter key={chamber.slug} chamber={chamber} index={index} inverted={index === 2} />
      ))}

      <section className="bg-fog px-5 py-28 md:px-12">
        <p className="text-[11px] uppercase tracking-mark text-mute">A profissional</p>
        <h2 className="display mt-4 max-w-[18ch] text-[clamp(2.2rem,6vw,4.6rem)] leading-[0.94] tracking-[-0.03em]">
          Enfermeira primeiro. Estética depois.
        </h2>
        <p className="mt-8 max-w-measure text-lg leading-relaxed">
          Doze anos de enfermagem. A Dra. Nathalia Rigo atende estética avançada em Sorocaba com a
          mesma ordem que a profissão pede: escuta, anamnese, indicação, registro. O Instagram fala
          em resultados naturais e sofisticados — o consultório precisa caber nessa frase.
        </p>
        <Link
          to="/nathalia"
          className="mt-10 inline-flex text-[11px] uppercase tracking-mark underline decoration-cryo underline-offset-4"
        >
          Ler sobre a Nathalia
        </Link>
      </section>

      <section className="relative min-h-[80vh] overflow-hidden bg-ink text-ice">
        <img
          src={media.room}
          alt="Sala de atendimento quieta, com luz do dia e linho sobre a maca."
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative z-10 flex min-h-[80vh] flex-col justify-end px-5 py-16 md:px-12">
          <p className="text-[11px] uppercase tracking-mark text-ice/70">O espaço</p>
          <h2 className="display mt-4 max-w-[14ch] text-[clamp(2.4rem,7vw,5rem)] leading-[0.92]">
            Parque São Bento.
          </h2>
          <p className="mt-6 max-w-md text-lg text-ice/85">
            {brand.address.street}, {brand.address.complement}. {brand.hoursNote}
          </p>
          <Link
            to="/espaco"
            className="mt-8 text-[11px] uppercase tracking-mark underline decoration-sage underline-offset-4"
          >
            Como chegar
          </Link>
        </div>
      </section>

      <section className="bg-ice px-5 py-28 md:px-12">
        <h2 className="display max-w-[16ch] text-[clamp(2.4rem,6vw,4.8rem)] leading-[0.94] tracking-[-0.03em]">
          A primeira conversa cabe num direct.
        </h2>
        <p className="mt-6 max-w-measure text-lg leading-relaxed text-mute">
          Sem número público verificado neste site. O caminho publicado é o Instagram{' '}
          <span className="text-ink">@{brand.instagramHandle}</span>. A avaliação digital monta a
          mensagem; você cola no recado.
        </p>
        <Link
          to="/avaliacao"
          className="mt-10 inline-flex bg-ink px-6 py-4 text-[11px] uppercase tracking-mark text-ice"
        >
          Montar a mensagem
        </Link>
      </section>

      <Colophon />
    </main>
  )
}
