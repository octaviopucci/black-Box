import { Check } from 'lucide-react'
import { courses, whatsappUrl } from '../../data/site'
import { v2Asset, v2CourseMedia } from '../data/site'
import { Carousel } from './Carousel'
import { Reveal } from './Reveal'

export function Courses() {
  return (
    <section id="cursos" className="section-pad overflow-hidden">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow">Cursos profissionais</p>
          <h2 className="display-title mt-3 text-4xl sm:text-5xl">Planos de formação</h2>
        </div>
      </Reveal>

      <Carousel>
        {courses.map((course) => (
          <article
            key={course.id}
            data-card
            className="relative w-[86vw] max-w-[520px] shrink-0 snap-start overflow-hidden rounded-md border border-ink/10 bg-surface-lift px-7 py-10 shadow-sm sm:px-10"
          >
            <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-gold-deep">
              {course.kicker}
              <br />
              {course.title}
            </p>
            <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-start">
              <p className="shrink-0 font-display text-4xl font-bold text-ink">{course.price}</p>
              <ul className="space-y-2.5">
                {course.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-xs text-ink-mute">{course.includes}</p>
            <a
              href={whatsappUrl(
                `Olá! Vim pelo site e quero me inscrever no curso ${course.kicker} ${course.title}.`,
              )}
              className="mt-8 inline-flex border border-gold px-5 py-3 text-xs font-display font-bold uppercase tracking-[0.16em] text-ink transition hover:bg-gold hover:text-white"
            >
              Quero me inscrever
            </a>
          </article>
        ))}
      </Carousel>

      <Reveal delay={0.08}>
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2">
          {v2CourseMedia.map((item) => (
            <figure key={item.file} className="overflow-hidden rounded-md border border-ink/10 bg-surface-lift">
              <img
                src={v2Asset(item.file)}
                alt={item.alt}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <figcaption className="px-4 py-3 text-sm text-ink-soft">{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
