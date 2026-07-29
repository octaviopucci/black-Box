import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { site, whatsappUrl } from '../data/site'

export function Threshold() {
  const [name, setName] = useState('')
  const [path, setPath] = useState('Pediatria')
  const [note, setNote] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const message = [
      'Olá! Vim pelo site da Clínica DNA.',
      name ? `Nome: ${name}` : null,
      `Caminho de cuidado: ${path}`,
      note ? `Mensagem: ${note}` : null,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="limiar" className="relative scroll-mt-24 overflow-hidden bg-void py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <div className="h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full border border-signal/20" />
        <div className="absolute h-[min(60vw,340px)] w-[min(60vw,340px)] rounded-full border border-sand/15" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 md:pl-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-signal/70">
              O limiar
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,3.8rem)] font-semibold leading-[1.02] tracking-tight text-paper">
              Onde o fio encontra você
            </h2>
            <p className="mt-5 text-base leading-relaxed text-paper/60">
              Sem filas digitais. Sem formulários frios. Uma mensagem — e a DNA responde.
            </p>

            <ul className="mt-10 space-y-5 text-sm text-paper/65">
              <li>
                <span className="block text-[11px] uppercase tracking-[0.28em] text-signal/60">
                  Endereço
                </span>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block transition hover:text-signal"
                >
                  {site.address}
                </a>
              </li>
              <li>
                <span className="block text-[11px] uppercase tracking-[0.28em] text-signal/60">
                  Horário
                </span>
                <p className="mt-1">{site.hours}</p>
              </li>
              <li>
                <span className="block text-[11px] uppercase tracking-[0.28em] text-signal/60">
                  WhatsApp
                </span>
                <a href={site.phone.href} className="mt-1 block transition hover:text-signal">
                  {site.phone.label}
                </a>
              </li>
            </ul>
          </div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 rounded-[2rem] bg-deep/80 p-7 ring-1 ring-signal/15 backdrop-blur-md sm:p-9 lg:col-span-7"
          >
            <div>
              <label htmlFor="nome" className="text-[11px] uppercase tracking-[0.22em] text-mute">
                Seu nome
              </label>
              <input
                id="nome"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border-b border-paper/15 bg-transparent py-3 text-paper outline-none transition focus:border-signal"
                placeholder="Como podemos te chamar?"
              />
            </div>
            <div>
              <label htmlFor="path" className="text-[11px] uppercase tracking-[0.22em] text-mute">
                Caminho
              </label>
              <select
                id="path"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="mt-2 w-full border-b border-paper/15 bg-transparent py-3 text-paper outline-none focus:border-signal"
              >
                <option className="bg-deep">Pediatria</option>
                <option className="bg-deep">Clínica médica</option>
                <option className="bg-deep">Neurologia</option>
                <option className="bg-deep">Odontologia</option>
                <option className="bg-deep">Vacinas & procedimentos</option>
                <option className="bg-deep">Ainda não sei</option>
              </select>
            </div>
            <div>
              <label htmlFor="note" className="text-[11px] uppercase tracking-[0.22em] text-mute">
                Mensagem
              </label>
              <textarea
                id="note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2 w-full resize-none border-b border-paper/15 bg-transparent py-3 text-paper outline-none focus:border-signal"
                placeholder="O que você precisa hoje?"
              />
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-void transition hover:bg-mist"
            >
              Continuar no WhatsApp
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
