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

    window.open(bookingUrl(), '_blank', 'noopener,noreferrer')
    if (navigator.clipboard && message) {
      void navigator.clipboard.writeText(message).catch(() => undefined)
    }
  }

  return (
    <section id="limiar" className="relative scroll-mt-24 overflow-hidden bg-void py-32 sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 70% 40%, rgba(111,184,185,0.12), transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 md:pl-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="section-kicker">O limiar</p>
            <h2 className="section-title mt-4 text-[clamp(2.5rem,5.5vw,4rem)]">
              Onde a calibração começa
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-paper/60">
              Sem formulários frios. O essencial — e o caminho para agendar com elegância.
            </p>

            <div className="mt-12 space-y-8 border-t border-paper/10 pt-8">
              {site.locations.map((loc) => (
                <div key={loc.city}>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-signal/65">{loc.city}</p>
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-sm text-paper/70 transition hover:text-signal"
                  >
                    {loc.address}
                  </a>
                </div>
              ))}
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-signal/65">On-line</p>
                <p className="mt-2 text-sm text-paper/70">Teleconsulta em todo o Brasil</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-signal/65">Registro</p>
                <p className="mt-2 text-sm text-paper/70">{site.crm}</p>
              </div>
            </div>
          </div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 border border-paper/10 bg-deep/40 p-8 backdrop-blur-md sm:p-10 lg:col-span-7"
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
                className="field-line"
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
                className="field-line"
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
                className="field-line"
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
                className="field-line resize-none"
                placeholder="O que o seu corpo está pedindo?"
              />
            </div>
            <button type="submit" className="cta-primary mt-2">
              Continuar para agendar
            </button>
            <p className="text-xs leading-relaxed text-mute">
              Abrimos o Linktree. Se o navegador permitir, copiamos sua mensagem para colar no
              atendimento.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
