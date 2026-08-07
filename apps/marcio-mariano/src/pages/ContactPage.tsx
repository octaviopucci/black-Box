import { useState, type FormEvent } from 'react'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'
import { SiteShell } from '../components/SiteShell'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { site, whatsappUrl } from '../data/site'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', subject: 'Atendimento geral', message: '' })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const message = [
      'Olá! Contato pelo site Márcio Mariano.',
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      `Assunto: ${form.subject}`,
      form.message,
    ].join('\n')
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <SiteShell solidNav>
      <PageHero
        eyebrow="Contato"
        title="Estamos prontos para melhor atendê-los"
        description="Plantão de vendas, equipe de locação e escritório no Centro de Capão Bonito."
      />

      <section className="mx-auto grid w-full max-w-shell gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.05fr]">
        <div className="space-y-4">
          <Reveal className="border border-line bg-snow p-6">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-blue" />
              <div>
                <p className="font-semibold text-ink">Endereço</p>
                <p className="mt-1 text-sm text-mute">{site.address.full}</p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-semibold text-blue"
                >
                  Abrir no Google Maps
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.04} className="border border-line bg-snow p-6">
            <div className="flex gap-3">
              <Clock className="h-5 w-5 text-blue" />
              <div>
                <p className="font-semibold text-ink">Horário</p>
                <p className="mt-1 text-sm text-mute">{site.hours.weekdays}</p>
                <p className="text-sm text-mute">{site.hours.saturday}</p>
                <p className="mt-2 text-sm text-mute">{site.hours.plantao}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="border border-line bg-snow p-6">
            <div className="flex gap-3">
              <Phone className="h-5 w-5 text-blue" />
              <div className="w-full">
                <p className="font-semibold text-ink">Telefones</p>
                <ul className="mt-3 space-y-3">
                  {site.phones.map((phone) => (
                    <li key={phone.label} className="text-sm">
                      <a href={phone.href} className="font-medium text-ink hover:text-blue">
                        {phone.label}
                      </a>
                      <span className="mt-0.5 block text-mute">{phone.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="border border-line bg-snow p-6">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-blue" />
              <div>
                <p className="font-semibold text-ink">E-mail</p>
                <a href={`mailto:${site.email}`} className="mt-1 block text-sm text-blue">
                  {site.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <form onSubmit={submit} className="border border-line bg-snow p-6 sm:p-8">
            <p className="font-display text-2xl font-semibold text-ink">Envie uma mensagem</p>
            <p className="mt-2 text-sm text-mute">
              O formulário abre uma conversa no WhatsApp com os dados preenchidos.
            </p>
            <div className="mt-6 grid gap-4">
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Nome</span>
                <input
                  required
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Telefone</span>
                <input
                  required
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Assunto</span>
                <select
                  className="input-field"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option>Atendimento geral</option>
                  <option>Quero comprar</option>
                  <option>Quero alugar</option>
                  <option>Quero anunciar</option>
                  <option>Avaliação</option>
                  <option>Administração</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Mensagem</span>
                <textarea
                  required
                  rows={5}
                  className="input-field resize-y"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </label>
            </div>
            <button type="submit" className="btn-blue mt-6 w-full">
              Continuar no WhatsApp
            </button>
          </form>
        </Reveal>
      </section>
    </SiteShell>
  )
}
