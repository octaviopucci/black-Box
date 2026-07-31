import { Shell } from '../components/Shell'
import { Reveal } from '../components/Reveal'
import { site } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'

export function PrivacidadePage() {
  usePageMeta(
    `Privacidade | ${site.title}`,
    `Política de privacidade da presença digital da ${site.title} e da ${site.clinic}.`,
  )

  return (
    <Shell>
      <section className="px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
        <Reveal className="mx-auto max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="display-title text-4xl text-ink sm:text-5xl">Privacidade</h1>
          <div className="mt-8 space-y-5 text-sm leading-relaxed text-mute sm:text-base">
            <p>
              Esta página descreve, de forma simples, como tratamos dados quando você navega neste
              site ou entra em contato pelo WhatsApp para agendar atendimento com a {site.title}.
            </p>
            <p>
              Responsável: {site.legalName}, CNPJ {site.cnpj}, {site.address}.
            </p>
            <p>
              Ao enviar mensagem pelo WhatsApp, você compartilha o número e o conteúdo da conversa
              para fins de atendimento, agendamento e acompanhamento clínico administrativo. Não
              vendemos seus dados.
            </p>
            <p>
              Imagens e materiais deste site pertencem à {site.clinic} e à {site.title}. Uso
              indevido não é autorizado.
            </p>
            <p>
              Dúvidas: {site.phone.label} ou {site.instagramHandle}.
            </p>
          </div>
        </Reveal>
      </section>
    </Shell>
  )
}
