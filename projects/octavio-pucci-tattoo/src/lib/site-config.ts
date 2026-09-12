export const siteConfig = {
  businessName: "Octávio Pucci Tattoo Infinity",
  shortName: "Octávio Pucci",
  tagline: "Realismo · Fine line · Cover-ups em Capão Bonito",
  city: "Capão Bonito",
  state: "SP",
  instagram: "https://www.instagram.com/octaviopuccitattoo",
  instagramHandle: "@octaviopuccitattoo",
  heroPromise:
    "Cover-ups que outro tatuador recusou — com 12 anos de experiência e orçamento fechado antes de marcar.",
  address: "Capão Bonito, SP",
  appointmentNote:
    "Atendimento com hora marcada. Endereço confirmado no WhatsApp depois do orçamento.",
  hours: "Ter–Sáb · com hora marcada",
  mapQuery: "Capão Bonito, São Paulo, Brasil",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118123.456!2d-48.345!3d-24.008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c9a8b8c8c8c8c9%3A0x0!2sCap%C3%A3o%20Bonito%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr",
} as const;

export const stats = [
  { value: "12+", label: "anos tatuando" },
  { value: "P&B", label: "realismo preto e cinza" },
  { value: "Cover", label: "ups inacreditáveis" },
] as const;

export type Service = {
  id: string;
  name: string;
  price: string;
  description: string;
};

export const services: Service[] = [
  {
    id: "realismo-pb",
    name: "Realismo preto e cinza",
    price: "Orçamento personalizado",
    description:
      "Retratos, sombras profundas e detalhe fino. Cada peça é desenhada pro seu corpo — tamanho e encaixe combinados antes da sessão.",
  },
  {
    id: "fineline",
    name: "Fine line",
    price: "Orçamento personalizado",
    description:
      "Linhas finas, letras, símbolos delicados. Ideal pra complemento ou primeira tattoo — sempre com projeto exclusivo.",
  },
  {
    id: "cover-up",
    name: "Coberturas e reformas",
    price: "Orçamento personalizado",
    description:
      "Especialidade da casa. Manda foto da tattoo antiga pelo WhatsApp — digo se dá, quantas sessões e quanto custa, sem enrolação.",
  },
];

export const steps = [
  {
    number: "01",
    title: "Manda sua ideia",
    description:
      "WhatsApp com referência, local do corpo e tamanho aproximado. Se for cover-up, manda foto do que quer cobrir.",
  },
  {
    number: "02",
    title: "Orçamento personalizado",
    description:
      "Valor fechado pro seu projeto — não por hora surpresa. Só marcamos data depois que você aprovar tudo.",
  },
  {
    number: "03",
    title: "Sessão + cuidados",
    description:
      "Desenho ajustado no dia. Saia com orientação de cicatrização e contato direto se precisar de algo depois.",
  },
] as const;

export const testimonials = [
  {
    name: "Mariana S.",
    text: "Fine line no pulso — linha perfeita, zero borrão. Explicou o cuidado depois e respondeu dúvida no WhatsApp no dia seguinte.",
    detail: "Fine line · pulso",
  },
  {
    name: "Rafael T.",
    text: "Dois estúdios disseram que meu cover-up não dava. Octávio cobriu tudo em duas sessões. Parece que nunca existiu a tattoo velha.",
    detail: "Cover-up · antebraço",
  },
  {
    name: "Camila L.",
    text: "Retrato em preto e cinza da minha avó. Chorei quando vi pronto. Orçamento fechado antes, sem taxa escondida no final.",
    detail: "Realismo P&B · costas",
  },
] as const;

export const faqItems = [
  {
    question: "Quanto custa?",
    answer:
      "Cada projeto é diferente. Manda referência no WhatsApp que eu monto orçamento personalizado — valor fechado antes de marcar.",
  },
  {
    question: "Cover-up dá mesmo?",
    answer:
      "Depende do que você tem e do que quer. Manda foto que eu digo na hora se dá, quantas sessões e quanto fica.",
  },
  {
    question: "Como marco horário?",
    answer:
      "Atendimento só com hora marcada. Depois do orçamento aprovado, combino dia e passo o endereço certinho.",
  },
] as const;
