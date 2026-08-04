'use client'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQ = [
  {
    q: 'Como publicar um anúncio no CBX?',
    a: 'Toque em "Publicar" no menu inferior, adicione fotos do produto, preencha as informações e escolha um plano. Seu anúncio ficará visível para compradores de Capão Bonito em poucos minutos.',
  },
  {
    q: 'O CBX cobra comissão sobre vendas?',
    a: 'Não. O CBX é um marketplace de classificados — você negocia diretamente com o comprador. Cobramos apenas pelos planos opcionais de destaque e visibilidade.',
  },
  {
    q: 'Como funciona o chat com compradores?',
    a: 'Quando alguém tem interesse no seu anúncio, pode iniciar uma conversa pelo chat interno do CBX. Você recebe notificações em tempo real.',
  },
  {
    q: 'Posso impulsionar meu anúncio?',
    a: 'Sim! Em "Meus anúncios", selecione o anúncio e toque em "Impulsionar". Oferecemos opções de destaque por 3, 7 ou 15 dias.',
  },
  {
    q: 'Como verifico minha conta?',
    a: 'Verifique seu telefone nas configurações do perfil. Para o selo de vendedor verificado, assine o plano Premium ou Empresarial.',
  },
  {
    q: 'O CBX entrega produtos?',
    a: 'A entrega é combinada entre comprador e vendedor. Muitos vendedores oferecem retirada local ou entrega na região de Capão Bonito.',
  },
]

export default function AjudaPage() {
  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Central de ajuda"
          subtitle="Perguntas frequentes sobre o CBX"
        />
        <Accordion type="single" collapsible className="rounded-xl border border-border/60 bg-card px-4">
          {FAQ.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </PageShell>
  )
}
