import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { bookingUrl, carePaths, site } from '../data/site'

export function Threshold() {
  const [name, setName] = useState('')
  const [path, setPath] = useState(carePaths[0]?.title ?? 'Modulação')
  const [note, setNote] = useState('')
  const [city, setCity] = useState('Capão Bonito')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const message = [
      'Olá! Vim pelo site do Dr. Marcelo Prado.',
      name ? `Nome: ${name}` : null,
      `Cuidado: ${path}`,
      `Preferência: ${city}`,
      note ? `Mensagem: ${note}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const ig = site.instagram
    // Primary conversion is Linktree; open with prepared context via Instagram DM is limited,
    // so we hand off to Linktree and copy intent into query-friendly note via WhatsApp-less flow.
    window.open(bookingUrl(), '_blank', 'noopener,noreferrer')
    if (navigator.clipboard && message) {
      void navigator.clipboard.writeText(message).catch(() => undefined)
    }
    void ig
  }

  return (
    <section id="limiar" className="relative scroll-mt-24 overflow-hidden bg-void py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
        <div className="h-[min(90vw,520px)] w-[min(90vw,520px)] rounded-full border border-signal/20" />
        <div className="absolute h-[min(60vw,340px)] w-[min(60vw,340px)] rounded-full border border-champagne/15" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 md:pl-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-signal/70">
              O limiar
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,5.5vw,3.8rem)] font-semibold leading-[1.02] tracking-tight text-paper">
              Onde a calibração começa
            </h2>
            <p className="mt-5 text-base leading-relaxed text-paper/60">
              Sem formulários frios. Preencha o essencial — e siga para agendar com elegância.
            </p>

            <ul className="mt-10 space-y-5 text-sm text-paper/65">
              {site.locations.map((loc) => (
                <li key={loc.city}>
                  <span className="block text-[11px] uppercase tracking-[0.28em] text-signal/60">
                    {loc.city}
                  </span>
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block transition hover:text-signal"
                  >
                    {loc.address}
                  </a>
                </li>
              ))}
              <li>
                <span className="block text-[11px] uppercase tracking-[0.28em] text-signal/60">
                  On-line
                </span>
                <p className="mt-1">Teleconsulta em todo o Brasil</p>
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
                Cuidado
              </label>
              <select
                id="path"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="mt-2 w-full border-b border-paper/15 bg-transparent py-3 text-paper outline-none focus:border-signal"
              >
                {carePaths.map((c) => (
                  <option key={c.id} className="bg-deep" value={c.title}>
                    {c.title}
                  </option>
                ))}
                <option className="bg-deep" value="Ainda não sei">
                  Ainda não sei
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="city" className="text-[11px] uppercase tracking-[0.22em] text-mute">
                Modalidade
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-2 w-full border-b border-paper/15 bg-transparent py-3 text-paper outline-none focus:border-signal"
              >
                <option className="bg-deep">Capão Bonito</option>
                <option className="bg-deep">Itapeva</option>
                <option className="bg-deep">On-line</option>
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
                placeholder="O que o seu corpo está pedindo?"
              />
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-void transition hover:bg-mist"
            >
              Continuar para agendar
            </button>
            <p className="text-xs text-mute">
              Abrimos o Linktree. Se o navegador permitir, copiamos sua mensagem para colar no
              atendimento.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
