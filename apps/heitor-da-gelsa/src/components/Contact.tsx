import { type FormEvent, useState } from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { siteConfig, socialLinks } from '@/data/site'
import { Button } from './Button'
import { Reveal } from './Reveal'

export function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contato" className="bg-green-dark py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow">Contato</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-black leading-tight">
              Tem uma demanda ou quer entrar em contato?
            </h2>
            <p className="mt-4 text-white/75">Envie sua mensagem, sugestão ou demanda.</p>

            <div className="mt-8 space-y-4">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/90 transition-colors hover:text-yellow"
              >
                <MessageCircle size={20} aria-hidden />
                WhatsApp: {siteConfig.whatsappDisplay}
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-white/90 transition-colors hover:text-yellow"
              >
                Instagram: @{siteConfig.handle}
              </a>
              <p className="flex items-center gap-3 text-white/90">
                <Mail size={20} aria-hidden />
                E-mail: {siteConfig.email}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-sm border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8"
            >
              {sent ? (
                <p className="py-8 text-center text-lg font-semibold text-yellow">
                  Mensagem registrada localmente. Configure integração de envio para produção.
                </p>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-white/70">Nome</span>
                      <input
                        required
                        type="text"
                        name="nome"
                        className="w-full rounded-sm border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
                        placeholder="Seu nome"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-white/70">E-mail</span>
                      <input
                        required
                        type="email"
                        name="email"
                        className="w-full rounded-sm border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
                        placeholder="seu@email.com"
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-white/70">
                        WhatsApp
                      </span>
                      <input
                        type="tel"
                        name="whatsapp"
                        className="w-full rounded-sm border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
                        placeholder="(15) 99999-9999"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-white/70">Bairro</span>
                      <input
                        type="text"
                        name="bairro"
                        className="w-full rounded-sm border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
                        placeholder="Seu bairro"
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-white/70">Assunto</span>
                    <input
                      required
                      type="text"
                      name="assunto"
                      className="w-full rounded-sm border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
                      placeholder="Assunto da mensagem"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-white/70">Mensagem</span>
                    <textarea
                      required
                      name="mensagem"
                      rows={5}
                      className="w-full resize-y rounded-sm border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-yellow focus:outline-none"
                      placeholder="Escreva sua mensagem"
                    />
                  </label>
                  <Button type="submit" variant="primary" className="w-full">
                    Enviar mensagem
                  </Button>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function SocialLinks() {
  return (
    <section className="border-t border-green/10 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-xl font-black text-green-deep">Acompanhe o trabalho</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url.startsWith('http') || link.url.startsWith('https') ? link.url : '#'}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="rounded-sm border border-green/20 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-green transition-colors hover:bg-green hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
