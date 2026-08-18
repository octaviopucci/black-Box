import { Link } from 'react-router-dom'
import { Colophon } from '@/components/Colophon'
import { brand, objections } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'

export default function NathaliaPage() {
  usePageMeta(
    'Nathalia · enfermeira esteta em Sorocaba',
    'Dra. Nathalia Rigo é enfermeira esteta em Sorocaba, com 12 anos de experiência e foco em resultados naturais e sofisticados.',
  )

  return (
    <main className="bg-fog pt-28">
      <header className="px-5 md:px-12">
        <p className="text-[11px] uppercase tracking-mark text-mute">A profissional</p>
        <h1 className="display mt-4 max-w-[16ch] text-[clamp(3rem,9vw,7.2rem)] leading-[0.88] tracking-[-0.04em]">
          A mão que escuta antes de tocar.
        </h1>
        <p className="mt-8 max-w-measure text-lg leading-relaxed text-mute">
          {brand.honorific}, {brand.profession}. {brand.experienceYears} anos de enfermagem. Atende
          estética avançada no {brand.neighborhood}, {brand.city}.
        </p>
      </header>

      <section className="mt-20 px-5 md:px-12">
        <h2 className="display text-4xl tracking-[-0.03em]">O que está publicado</h2>
        <div className="mt-8 max-w-2xl space-y-6 text-lg leading-relaxed">
          <p>
            O Instagram da profissional descreve o trabalho em uma linha:{' '}
            <em>{brand.bioLine}</em> Enfermeira. Doze anos. Sorocaba.
          </p>
          <p>
            Este site não inventa CRM, COREN, pós-graduação, preços nem depoimentos. O que cabe
            aqui é o que é público: a profissão, o tempo de experiência, o bairro, os três
            protocolos e o caminho de conversa.
          </p>
          <p>
            A enfermagem estética, no Brasil, tem marco próprio no Cofen. Consulta, anamnese,
            protocolo e prontuário não são “extras” — são o ofício. É por isso que a avaliação
            vem antes do aparelho, do ácido e da luz.
          </p>
        </div>
      </section>

      <section className="mt-24 px-5 pb-8 md:px-12">
        <h2 className="display text-4xl tracking-[-0.03em]">Perguntas que realmente chegam</h2>
        <dl className="mt-10 max-w-2xl divide-y divide-ink/10">
          {objections.map((item) => (
            <div key={item.q} className="py-8">
              <dt className="display text-2xl">{item.q}</dt>
              <dd className="mt-3 leading-relaxed text-mute">{item.a}</dd>
            </div>
          ))}
        </dl>
        <Link
          to="/avaliacao"
          className="mt-4 inline-flex text-[11px] uppercase tracking-mark underline decoration-cryo underline-offset-4"
        >
          Ir à avaliação
        </Link>
      </section>
      <Colophon />
    </main>
  )
}
