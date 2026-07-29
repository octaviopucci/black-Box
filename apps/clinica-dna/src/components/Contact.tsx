import { useState, type FormEvent } from 'react'
import { Clock, MapPin, Phone } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { Reveal, SectionHeading } from './Reveal'

export function Contact() {
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('Pediatria')
  const [note, setNote] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const message = [
      `Olá! Vim pelo site da Clínica DNA.`,
      name ? `Meu nome: ${name}` : null,
      `Especialidade de interesse: ${specialty}`,
      note ? `Detalhes: ${note}` : null,
      `Gostaria de agendar um atendimento.`,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contato" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-abyss text-snow shadow-lift lg:grid lg:grid-cols-12">
          <div className="relative p-8 sm:p-10 lg:col-span-5 lg:p-12">
            <div className="absolute inset-0 bg-helix opacity-30" />
            <div className="relative">
              <SectionHeading
                light
                eyebrow="Contato"
                title="Vamos cuidar de você"
                subtitle="Agende em minutos pelo WhatsApp ou envie sua mensagem — respondemos com atenção."
              />

              <ul className="mt-10 space-y-5">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-aqua" />
                  <div>
                    <p className="text-sm font-semibold">Endereço</p>
                    <a
                      href={site.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-sm text-snow/65 transition hover:text-aqua-soft"
                    >
                      {site.address}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-aqua" />
                  <div>
                    <p className="text-sm font-semibold">Horários</p>
                    <p className="mt-1 text-sm text-snow/65">{site.hours.weekdays}</p>
                    <p className="text-sm text-snow/65">{site.hours.weekend}</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-aqua" />
                  <div>
                    <p className="text-sm font-semibold">WhatsApp</p>
                    <a
                      href={site.phones[0].href}
                      className="mt-1 block text-sm text-snow/65 transition hover:text-aqua-soft"
                    >
                      {site.phones[0].label}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-snow p-8 text-ink sm:p-10 lg:col-span-7 lg:p-12">
            <Reveal>
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.2em] text-mute">
                    Nome
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Como podemos te chamar?"
                    className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3.5 text-sm outline-none transition focus:border-aqua-deep focus:ring-2 focus:ring-aqua/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="specialty"
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-mute"
                  >
                    Especialidade
                  </label>
                  <select
                    id="specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-line bg-paper px-4 py-3.5 text-sm outline-none transition focus:border-aqua-deep focus:ring-2 focus:ring-aqua/30"
                  >
                    <option>Pediatria</option>
                    <option>Clínica médica</option>
                    <option>Neurologia</option>
                    <option>Odontologia</option>
                    <option>Procedimentos & vacinas</option>
                    <option>Outro / não sei ainda</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="note" className="text-xs font-semibold uppercase tracking-[0.2em] text-mute">
                    Mensagem
                  </label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    placeholder="Conte brevemente o que você precisa"
                    className="mt-2 w-full resize-none rounded-2xl border border-line bg-paper px-4 py-3.5 text-sm outline-none transition focus:border-aqua-deep focus:ring-2 focus:ring-aqua/30"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-snow transition hover:bg-abyss sm:w-auto"
                >
                  Enviar no WhatsApp
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
