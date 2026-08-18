import { asset, courses, site, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Courses() {
  return (
    <section id="cursos" className="bg-ink px-5 py-24 text-paper sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="eyebrow text-rose-soft">Formação</p>
          <h2 className="display-title mt-4 max-w-2xl text-4xl sm:text-5xl">
            Aprender o ofício com quem atende de verdade.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/60">
            Dois caminhos presenciais. Kit, certificado e o método que a Laís usa no studio.
          </p>
        </Reveal>

        <div className="mt-16 space-y-24">
          {courses.map((course, i) => (
            <article
              key={course.id}
              className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14"
            >
              <Reveal className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img
                  src={asset(course.image)}
                  alt={course.imageAlt}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              </Reveal>

              <Reveal delay={0.08} className="lg:col-span-7">
                <p className="text-[11px] uppercase tracking-[0.28em] text-rose-soft">
                  {course.kicker}
                </p>
                <h3 className="mt-3 font-display text-4xl sm:text-5xl">{course.title}</h3>
                <p className="mt-3 font-display text-3xl text-rose-soft">{course.price}</p>
                <p className="mt-1 text-sm text-paper/50">{course.includes}</p>

                {course.days.map((day) => (
                  <div key={day.title} className="mt-8">
                    <p className="text-sm font-medium text-rose-soft">{day.title}</p>
                    <ul className="mt-3 space-y-2">
                      {day.items.map((item) => (
                        <li key={item} className="text-sm leading-relaxed text-paper/70">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-paper/40">
                  Bônus exclusivos
                </p>
                <ul className="mt-3 space-y-2">
                  {course.bonus.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-paper/65">
                      {item}
                    </li>
                  ))}
                </ul>

                <a href={whatsappUrl(site.whatsapp.courseMessage)} className="cta-rose mt-8">
                  Quero o {course.title.toLowerCase()}
                </a>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
