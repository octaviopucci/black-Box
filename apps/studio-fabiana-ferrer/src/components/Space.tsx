import { motion } from 'framer-motion'
import { spaceNote } from '@/data/site'
import Reveal from './Reveal'

export default function Space() {
  return (
    <section id="espaco" className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem]">
            <img
              src={`${import.meta.env.BASE_URL}media/1.jpg`}
              alt="Inauguração do novo espaço do Studio Fabiana Ferrer em Sorocaba"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-forest/50 to-transparent" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-[0.72rem] font-semibold uppercase tracking-mark text-sage">O espaço</p>
          <h2 className="mt-3 font-display text-3xl font-medium text-forest md:text-4xl">
            {spaceNote.headline}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-smoke">{spaceNote.body}</p>

          <motion.div
            className="mt-8 rounded-[1.5rem] border border-leaf/25 bg-paper/70 p-6 backdrop-blur"
            whileHover={{ borderColor: 'rgba(116,198,157,0.5)' }}
          >
            <p className="font-display text-lg text-forest">
              Gratidão resume o momento da inauguração.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-smoke">
              Posts publicados em janeiro de 2025 mencionam equipe, parceiros, clientes e amigos —
              reforçando um ambiente de relação próxima, não apenas transacional.
            </p>
          </motion.div>
        </Reveal>
      </div>
    </section>
  )
}
