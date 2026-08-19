import { spaceNote } from '@/data/site'
import Reveal from './Reveal'

export default function Space() {
  return (
    <section id="espaco" className="border-t hairline">
      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-2">
        <Reveal>
          <img
            src={`${import.meta.env.BASE_URL}media/1.jpg`}
            alt="Inauguração do novo espaço do Studio Fabiana Ferrer"
            className="h-full min-h-[20rem] w-full object-cover lg:min-h-[28rem]"
            loading="lazy"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex flex-col justify-center px-5 py-14 md:px-10 md:py-20 lg:px-16">
            <p className="text-[0.68rem] font-medium uppercase tracking-mark text-mute">O espaço</p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.02em] text-ink text-balance">
              {spaceNote.headline}
            </h2>
            <p className="mt-6 max-w-measure text-base leading-relaxed text-mute">{spaceNote.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
