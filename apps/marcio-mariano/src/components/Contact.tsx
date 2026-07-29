import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowUpRight, Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { Reveal, SectionHeading } from './Reveal'

export function Contact() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState('Comprar')
  const [message, setMessage] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const text = [
      'Olá! Contato pelo site Márcio Mariano.',
      `Nome: ${name || '—'}`,
      `Telefone: ${phone || '—'}`,
      `Interesse: ${interest}`,
      message ? `Mensagem: ${message}` : null,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contato" className="border-t border-line/70 bg-white/50">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1fr_1.05fr] sm:px-8 sm:py-28">
        <div>
          <SectionHeading
            eyebrow="Contato"
            title="Vamos encontrar o seu próximo imóvel"
            subtitle="Fale com o plantão de vendas ou com a equipe de locação. Resposta rápida no WhatsApp."
          />

          <div className="mt-10 space-y-6">
            <Info
              icon={<MapPin className="h-5 w-5" />}
              title="Escritório"
              body={
                <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-brand">
                  {site.address}
                </a>
              }
            />
            <Info
              icon={<Clock3 className="h-5 w-5" />}
              title="Horário"
              body={
                <>
                  {site.hours.weekdays}
                  <br />
                  {site.hours.saturday}
                </>
              }
            />
            <Info
              icon={<Mail className="h-5 w-5" />}
              title="E-mail"
              body={
                <a href={`mailto:${site.email}`} className="hover:text-brand">
                  {site.email}
                </a>
              }
            />
            <Info
              icon={<Phone className="h-5 w-5" />}
              title="Telefones"
              body={
                <ul className="space-y-1.5">
                  {site.phones.map((p) => (
                    <li key={p.label}>
                      <a href={p.href} className="font-medium text-navy hover:text-brand">
                        {p.label}
                      </a>
                      <span className="ml-2 text-xs uppercase tracking-[0.14em] text-mute">
                        {p.role}
                      </span>
                    </li>
                  ))}
                </ul>
              }
            />
          </div>
        </div>

        <Reveal>
          <form
            onSubmit={onSubmit}
            className="border border-line bg-chalk/70 p-6 shadow-soft sm:p-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">
              Atendimento prioritário
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-navy">Deixe sua mensagem</h3>
            <p className="mt-2 text-sm text-mute">
              Enviamos direto para o WhatsApp da equipe — sem formulários que somem no vazio.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Field label="Nome">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                  placeholder="Seu nome"
                />
              </Field>
              <Field label="Telefone / WhatsApp">
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field"
                  placeholder="(15) 9xxxx-xxxx"
                />
              </Field>
              <Field label="Interesse" className="sm:col-span-2">
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="field"
                >
                  <option>Comprar</option>
                  <option>Alugar</option>
                  <option>Vender meu imóvel</option>
                  <option>Administração</option>
                  <option>Avaliação</option>
                </select>
              </Field>
              <Field label="Mensagem" className="sm:col-span-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="field resize-y"
                  placeholder="Conte o que você procura…"
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand sm:w-auto"
            >
              Enviar no WhatsApp
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </Reveal>
      </div>

      <style>{`
        .field {
          width: 100%;
          border: 1px solid #d5cfc3;
          background: rgba(255,255,255,0.75);
          padding: 0.75rem 0.9rem;
          font-size: 0.925rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .field:focus { border-color: #0c4a8c; }
      `}</style>
    </section>
  )
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
        {label}
      </span>
      {children}
    </label>
  )
}

function Info({
  icon,
  title,
  body,
}: {
  icon: ReactNode
  title: string
  body: ReactNode
}) {
  return (
    <Reveal className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-line bg-white text-brand">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-mute">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-navy">{body}</div>
      </div>
    </Reveal>
  )
}
