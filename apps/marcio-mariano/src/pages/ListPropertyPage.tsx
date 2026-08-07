import { useState, type FormEvent } from 'react'
import { SiteShell } from '../components/SiteShell'
import { PageHero } from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { whatsappUrl } from '../data/site'

export function ListPropertyPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    city: 'Capão Bonito',
    intent: 'vender',
    type: 'Residencial',
    details: '',
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const message = [
      'Olá! Quero anunciar meu imóvel com a Márcio Mariano.',
      `Nome: ${form.name}`,
      `Telefone: ${form.phone}`,
      `Cidade: ${form.city}`,
      `Intenção: ${form.intent}`,
      `Tipo: ${form.type}`,
      `Detalhes: ${form.details}`,
    ].join('\n')
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <SiteShell solidNav>
      <PageHero
        eyebrow="Anunciar"
        title="Coloque seu imóvel nas mãos de quem vende e aluga na região"
        description="Preencha os dados essenciais. Encaminhamos sua solicitação direto para o WhatsApp da equipe."
      />

      <section className="mx-auto grid w-full max-w-shell gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="section-label">Como funciona</p>
          <ol className="mt-6 space-y-5">
            {[
              'Você envia as informações básicas do imóvel.',
              'A equipe avalia o enquadramento e a estratégia de divulgação.',
              'Seguimos com fotos, anúncio e atendimento aos interessados.',
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-gold text-sm font-bold text-blue-deep">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-mute sm:text-base">{step}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.06}>
          <form onSubmit={submit} className="border border-line bg-snow p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-1">
                <span className="mb-1.5 block font-medium">Nome</span>
                <input
                  required
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">WhatsApp</span>
                <input
                  required
                  className="input-field"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Cidade</span>
                <input
                  className="input-field"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Quero</span>
                <select
                  className="input-field"
                  value={form.intent}
                  onChange={(e) => setForm({ ...form, intent: e.target.value })}
                >
                  <option value="vender">Vender</option>
                  <option value="alugar">Alugar</option>
                  <option value="administrar">Administrar</option>
                </select>
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium">Tipo do imóvel</span>
                <select
                  className="input-field"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {['Residencial', 'Comercial', 'Terreno', 'Chácara', 'Sítio', 'Fazenda'].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="mb-1.5 block font-medium">Detalhes</span>
                <textarea
                  required
                  rows={5}
                  className="input-field resize-y"
                  placeholder="Bairro, metragem, quartos, valor pretendido..."
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                />
              </label>
            </div>
            <button type="submit" className="btn-blue mt-6 w-full">
              Enviar pelo WhatsApp
            </button>
          </form>
        </Reveal>
      </section>
    </SiteShell>
  )
}
