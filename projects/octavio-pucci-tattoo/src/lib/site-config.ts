export const siteConfig = {
  businessName: "Octávio Pucci Tattoo Infinity",
  shortName: "Octávio Pucci",
  tagline: "Tatuagem autoral em Capão Bonito",
  city: "Capão Bonito",
  state: "SP",
  instagram: "https://www.instagram.com/octaviopuccitattoo",
  instagramHandle: "@octaviopuccitattoo",
  heroPromise:
    "Sua ideia vira tatuagem que você vai querer mostrar — sem pressa, sem surpresa no preço.",
  address: "Capão Bonito, SP",
  hours: "Ter–Sáb · 10h às 19h (com hora marcada)",
  mapQuery: "Capão Bonito, São Paulo, Brasil",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118123.456!2d-48.345!3d-24.008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c9a8b8c8c8c8c9%3A0x0!2sCap%C3%A3o%20Bonito%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr",
} as const;

export const stats = [
  { value: "8+", label: "anos tatuando" },
  { value: "500+", label: "clientes atendidos" },
  { value: "5.0", label: "nota no Google" },
] as const;

export type Service = {
  id: string;
  name: string;
  price: string;
  description: string;
};

export const services: Service[] = [
  {
    id: "personalizada",
    name: "Tatuagem personalizada",
    price: "A partir de R$ 350",
    description:
      "Conta sua ideia. Eu desenho exclusivo pro seu corpo — tamanho, encaixe e estilo combinados antes de marcar.",
  },
  {
    id: "realismo-blackwork",
    name: "Realismo & blackwork",
    price: "Orçamento por sessão",
    description:
      "Sombras profundas, preto sólido, retratos e peças grandes. Sessões de 4 a 6 horas, conforme o projeto.",
  },
  {
    id: "fineline",
    name: "Fineline & minimalista",
    price: "A partir de R$ 250",
    description:
      "Linhas finas, letras, símbolos pequenos. Ideal pra primeira tattoo ou complemento delicado.",
  },
  {
    id: "cover-up",
    name: "Cover-up & reforma",
    price: "Orçamento na hora",
    description:
      "Cobrir ou reformar tattoo antiga. Mando foto pelo WhatsApp e digo se dá, quanto custa e quantas sessões.",
  },
  {
    id: "retoque",
    name: "Retoque",
    price: "Grátis em 30 dias",
    description:
      "Passou do prazo de cicatrização e precisa ajustar? Retoque incluso no mês seguinte à sessão.",
  },
];

export const steps = [
  {
    number: "01",
    title: "Manda sua ideia",
    description:
      "WhatsApp com referência, local do corpo e tamanho aproximado. Respondo em até 24h.",
  },
  {
    number: "02",
    title: "Orçamento fechado",
    description:
      "Valor por projeto, não por hora surpresa. Data marcada só depois que você aprovar tudo.",
  },
  {
    number: "03",
    title: "Sessão + cuidados",
    description:
      "Desenho ajustado no dia. Saia com orientação de cicatrização e retoque incluso.",
  },
] as const;

export const testimonials = [
  {
    name: "Mariana S.",
    text: "Fui com medo de doer e saí querendo marcar a próxima. Explicou cada passo, preço fechado antes, zero enrolação.",
    detail: "Fineline no pulso",
  },
  {
    name: "Rafael T.",
    text: "Cover-up que outro estúdio disse que não dava. Octávio mostrou opções, cobriu tudo e ficou natural.",
    detail: "Cover-up no braço",
  },
  {
    name: "Camila L.",
    text: "Marcou sábado porque só consigo folga no fim de semana. Retoque depois de duas semanas, sem custo.",
    detail: "Realismo no antebraço",
  },
] as const;

export const faqItems = [
  {
    question: "Quanto custa?",
    answer:
      "Depende do tamanho, local e detalhe. Manda referência no WhatsApp que eu passo valor fechado antes de marcar.",
  },
  {
    question: "Dói muito?",
    answer:
      "Varia pelo local do corpo. Uso técnica pausada — se precisar parar, paramos. A maioria aguenta bem sessões de 3–4h.",
  },
  {
    question: "Quanto tempo demora?",
    answer:
      "Pequena: uma sessão. Grande ou realismo: pode ser 2–3 sessões. Combinamos tudo antes.",
  },
] as const;
