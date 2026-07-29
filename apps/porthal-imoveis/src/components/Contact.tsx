import { useState, type FormEvent } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { site, whatsappUrl } from '../data/site'
import { Reveal } from './Reveal'

export function Contact() {
  const [name, setName] = useState('')
  const [interest, setInterest] = useState('Comprar')
  const [note, setNote] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const message = [
      `Olá! Sou ${name || 'interessado(a)'} e vim pelo site da Porthal.`,
      `Interesse: ${interest}.`,
      note ? `Detalhes: ${note}` : '',
    ]
      .filter(Boolean)
      .join(' ')
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contato" className="container-page scroll-mt-28 py-20 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Contato</p>
          <h2 className="display-title mt-3 text-ink">
            Vamos encontrar
            <span className="mt-1 block italic text-brand">o imóvel certo</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mute">
            Fale com a equipe Porthal. Atendimento humano, respostas rápidas e acompanhamento em
            cada etapa — da visita à assinatura.
          </p>

          <div className="mt-10 space-y-5">
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 text-sm text-ink/80 transition hover:text-brand"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {site.address}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 text-sm text-ink/80 transition hover:text-brand"
            >
              <Mail className="h-4 w-4 shrink-0 text-brand" />
              {site.email}
            </a>
            {site.phones.map((phone) => (
              <a
                key={phone.label}
                href={phone.href}
                className="flex items-center gap-3 text-sm text-ink/80 transition hover:text-brand"
              >
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                {phone.label}
                {phone.whatsapp ? (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
                    WhatsApp
                  </span>
                ) : null}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            onSubmit={onSubmit}
            className="border border-line bg-white/70 p-6 shadow-soft backdrop-blur-sm sm:p-8"
          >
            <label className="block">
              <span className="eyebrow mb-1.5 block">Nome</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field bg-paper"
                placeholder="Como podemos te chamar?"
              />
            </label>
            <label className="mt-4 block">
              <span className="eyebrow mb-1.5 block">Interesse</span>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="field bg-paper"
              >
                <option>Comprar</option>
                <option>Alugar</option>
                <option>Vender meu imóvel</option>
                <option>Financiamento</option>
                <option>Outro</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="eyebrow mb-1.5 block">Mensagem</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="field resize-y bg-paper"
                placeholder="Conte o que você procura — cidade, tipo, orçamento..."
              />
            </label>
            <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
              Enviar via WhatsApp
            </button>
            <p className="mt-3 text-xs text-mute">
              Abrimos o WhatsApp com sua mensagem pronta. Sem cadastro, sem espera.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
