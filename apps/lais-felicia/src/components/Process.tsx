import { asset, process } from '../data/site'
import { Reveal } from './Reveal'

export function Process() {
  return (
    <section id="processo" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <img
              src={asset('practice.jpg')}
              alt="Marcação à mão livre no caderno de exercícios, com régua da marca"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">A experiência</p>
              <h2 className="display-title mt-4 text-4xl sm:text-5xl">
                Do primeiro olhar ao fio no lugar.
              </h2>
            </Reveal>

            <ol className="mt-10 space-y-8">
              {process.map((item, i) => (
                <Reveal key={item.step} delay={i * 0.05}>
                  <li className="grid grid-cols-[auto_1fr] gap-5">
                    <span className="font-display text-3xl text-rose">{item.step}</span>
                    <div>
                      <h3 className="font-display text-2xl">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink/62">{item.text}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
