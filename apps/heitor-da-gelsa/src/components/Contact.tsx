import { type FormEvent, useState } from 'react'
import { AtSign, Mail, MessageCircle } from 'lucide-react'
import { siteConfig } from '@/data/site'
import { Button } from './Button'
import { Reveal } from './Reveal'
import { SectionHeader } from './SectionHeader'

export function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contato" className="section-shell relative overflow-hidden bg-green-deep text-white">
      <div className="absolute inset-0 bg-contactMesh" aria-hidden />
      <div className="absolute inset-0 bg-grain opacity-[0.05]" aria-hidden />

      <div className="section-container relative">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:items-start">
          <div>
            <SectionHeader
              eyebrow="Contato"
              title="Tem uma demanda ou quer entrar em contato?"
              description="Canais abertos para moradores de Capão Bonito — WhatsApp e Instagram são os principais."
              theme="dark"
            />

            <Reveal delay={0.1}>
              <div className="mt-8 space-y-3">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-sm border border-white/10 bg-white/[0.06] px-5 py-4 transition hover:border-yellow/40 hover:bg-white/[0.1]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-yellow text-green-deep">
                    <MessageCircle size={20} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">WhatsApp</span>
                    <span className="font-semibold">{siteConfig.whatsappDisplay}</span>
                  </span>
                </a>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-sm border border-white/10 bg-white/[0.06] px-5 py-4 transition hover:border-yellow/40 hover:bg-white/[0.1]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10 text-white">
                    <AtSign size={20} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Instagram</span>
                    <span className="font-semibold">@{siteConfig.handle}</span>
                  </span>
                </a>
                <div className="flex items-center gap-4 rounded-sm border border-white/10 bg-white/[0.04] px-5 py-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10 text-white/70">
                    <Mail size={20} aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">E-mail</span>
                    <span className="text-white/80">{siteConfig.email}</span>
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <Button
                href={`https://wa.me/${siteConfig.whatsapp}`}
                variant="primary"
                external
                className="mt-8 w-full sm:w-auto"
              >
                Chamar no WhatsApp
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <form
              onSubmit={handleSubmit}
              className="rounded-sm border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md sm:p-8"
            >
              <p className="eyebrow text-yellow">Formulário</p>
              <p className="mt-2 text-sm text-white/65">Registre sua mensagem — integração de envio pode ser configurada depois.</p>

              {sent ? (
                <p className="py-10 text-center text-lg font-semibold text-yellow">
                  Mensagem registrada localmente. Configure integração de envio para produção.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/60">Nome</span>
                      <input
                        required
                        type="text"
                        name="nome"
                        className="w-full rounded-sm border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 focus:border-yellow focus:outline-none"
                        placeholder="Seu nome"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/60">E-mail</span>
                      <input
                        required
                        type="email"
                        name="email"
                        className="w-full rounded-sm border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 focus:border-yellow focus:outline-none"
                        placeholder="seu@email.com"
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/60">WhatsApp</span>
                      <input
                        type="tel"
                        name="whatsapp"
                        className="w-full rounded-sm border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 focus:border-yellow focus:outline-none"
                        placeholder="(15) 99999-9999"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/60">Bairro</span>
                      <input
                        type="text"
                        name="bairro"
                        className="w-full rounded-sm border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 focus:border-yellow focus:outline-none"
                        placeholder="Seu bairro"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/60">Assunto</span>
                    <input
                      required
                      type="text"
                      name="assunto"
                      className="w-full rounded-sm border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 focus:border-yellow focus:outline-none"
                      placeholder="Assunto da mensagem"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-white/60">Mensagem</span>
                    <textarea
                      required
                      name="mensagem"
                      rows={5}
                      className="w-full resize-y rounded-sm border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/35 focus:border-yellow focus:outline-none"
                      placeholder="Escreva sua mensagem"
                    />
                  </label>
                  <Button type="submit" variant="primary" className="w-full">
                    Enviar mensagem
                  </Button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function SocialLinks() {
  return null
}
