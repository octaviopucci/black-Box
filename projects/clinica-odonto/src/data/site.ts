export const site = {
  name: "Odonto Studio",
  fullName: "Odonto Studio — Clínica Odontológica",
  tagline: "Odontologia de precisão, com acolhimento real",
  headline: "Seu sorriso merece técnica, tempo e cuidado de verdade.",
  description:
    "Clínica odontológica com atendimento humanizado, tecnologia digital e planos de tratamento claros — do clareamento ao implante.",
  promise: "Escuta antes do procedimento. Resultado que se sustenta.",
  whatsapp: {
    number: "5511999999999",
    message:
      "Olá! Vim pelo site da Odonto Studio e gostaria de agendar uma avaliação.",
    label: "Agendar pelo WhatsApp",
  },
  phone: {
    label: "(11) 99999-9999",
    href: "tel:+5511999999999",
  },
  address: "Av. Paulista, 1000 — Bela Vista — São Paulo/SP",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Av+Paulista+1000+Sao+Paulo",
  hours: "Seg–Sex 8h–19h · Sáb 8h–13h",
  nav: [
    { label: "Tratamentos", href: "#tratamentos" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Dúvidas", href: "#duvidas" },
    { label: "Agendar", href: "#agendar" },
  ],
} as const

export const treatments = [
  {
    id: "implantes",
    title: "Implantes & reabilitação",
    line: "Base sólida para morder, falar e sorrir com naturalidade.",
    detail:
      "Planejamento digital, cirurgia guiada e próteses que respeitam sua anatomia — sem pressa, com acompanhamento em cada etapa.",
  },
  {
    id: "ortodontia",
    title: "Ortodontia & alinhadores",
    line: "Correção discreta, com metas claras desde a primeira consulta.",
    detail:
      "Aparelho fixo ou alinhadores transparentes. Avaliamos hábitos, mordida e expectativa estética antes de indicar o caminho.",
  },
  {
    id: "estetica",
    title: "Estética & clareamento",
    line: "Tom uniforme e contorno harmonioso — sem exageros.",
    detail:
      "Clareamento supervisionado, facetas e harmonização com critério clínico. O objetivo é parecer você, em melhor versão.",
  },
] as const

export const testimonials = [
  {
    text: "Finalmente entendi meu plano de tratamento. Sem jargão, sem pressão — só clareza e cuidado.",
    who: "Mariana R.",
    role: "Ortodontia",
  },
  {
    text: "Ambiente impecável e equipe que explica cada passo. Me senti segura desde a avaliação.",
    who: "Carlos E.",
    role: "Implante",
  },
  {
    text: "Clareamento com resultado natural. Voltaria só pela escuta da Dra. antes de qualquer procedimento.",
    who: "Juliana M.",
    role: "Estética dental",
  },
] as const

export const faq = [
  {
    q: "Como funciona a primeira consulta?",
    a: "Avaliação clínica completa, radiografias quando necessário e conversa sobre objetivos. Você sai com um plano claro — prazos, etapas e investimento — antes de decidir.",
  },
  {
    q: "Vocês aceitam convênio?",
    a: "Trabalhamos com diversos planos odontológicos e também atendimento particular. Confirme cobertura pelo WhatsApp antes de agendar.",
  },
  {
    q: "Quanto tempo dura um tratamento de implante?",
    a: "Depende do caso: pode levar de algumas semanas a poucos meses. O planejamento digital reduz imprevistos e acelera a reabilitação quando indicado.",
  },
  {
    q: "O clareamento danifica os dentes?",
    a: "Feito com supervisão profissional e produtos adequados, o clareamento é seguro. Avaliamos sensibilidade e histórico antes de iniciar.",
  },
] as const

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
