export const LANDING_WHATSAPP_URL =
  process.env.NEXT_PUBLIC_NA_MESA_WHATSAPP ?? "https://wa.me/55XXXXXXXXXXX";

export const PROBLEM_BULLETS = [
  {
    title: "Mesa parada.",
    text: "Garçom atrasado, pedido no papel, cozinha sem saber a ordem. Mesa não vira.",
  },
  {
    title: "Conta que vira briga.",
    text: "Separar por pessoa no caderno dá erro e atrasa a saída.",
  },
  {
    title: "Ferramenta errada.",
    text: "App de cardápio ou delivery não resolve o dia a dia do salão.",
  },
] as const;

export const HOW_IT_WORKS_STEPS = [
  "Cliente pede no celular (QR na mesa ou com o garçom).",
  "Pedido chega na tela da cozinha — certo, na hora.",
  "Conta separada se quiser: por pessoa ou o que sobrou.",
  "A casa libera a mesa. Controle fica com você.",
] as const;

export const WHAT_YOU_GET = [
  {
    title: "Kit",
    text: "Placas e QR prontos pra mesa. Não é só um link no WhatsApp.",
  },
  {
    title: "Sistema",
    text: "Pedido, tela da cozinha, conta e liberação da mesa — o fluxo do salão.",
  },
  {
    title: "A gente perto",
    text: "Montamos com você, treinamos a equipe e ficamos no começo. Sem ticket frio.",
  },
] as const;

export type PlanId = "essencial" | "premium" | "custom";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  priceNote?: string;
  daily: string;
  features: string[];
  cta: string;
  recommended?: boolean;
  primaryCta?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "essencial",
    name: "Essencial",
    price: "R$ 997",
    daily: "~R$ 2,73 por dia",
    features: [
      "10 mesas — se precisar de mais, soma R$70 no ano",
      "1 garçom — extra R$50",
      "3 pessoas de staff",
      "1 casa",
      "3 telas da cozinha",
      "Produtos sem limite",
    ],
    cta: "Quero o Essencial",
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 1.997",
    daily: "~R$ 5,47 por dia",
    features: [
      "35 mesas — extra R$50 cada",
      "10 garçons — extra R$30",
      "15 staff",
      "Até 3 casas — casa a mais R$397 no ano",
      "8 telas da cozinha",
      "Relatórios e integrações",
    ],
    cta: "Quero o Premium",
    recommended: true,
    primaryCta: true,
  },
  {
    id: "custom",
    name: "Custom",
    price: "a partir de R$ 2.997",
    priceNote: "no ano",
    daily: "Pra operação maior",
    features: [
      "Mesas, garçons e staff sem teto",
      "Casas e telas sob medida",
      "Prioridade e suporte dedicado",
    ],
    cta: "Falar com a gente",
  },
];

export const FAQ_ITEMS = [
  {
    question: "O que é comanda digital na mesa?",
    answer:
      "É o cliente (ou o garçom) pedindo pelo celular na mesa, sem papel. No NA MESA o pedido vai pra tela da cozinha, a conta pode ser separada e a casa libera a mesa.",
  },
  {
    question: "Precisa de QR na mesa?",
    answer:
      "O QR na mesa abre o pedido no celular. Mas não é só cardápio. Tem garçom, tela da cozinha, conta separada e a casa no controle do fechamento.",
  },
  {
    question: "O garçom continua?",
    answer:
      "Sim. No Essencial já entra 1 garçom. No Premium cabem mais. O digital organiza o pedido e a conta — o salão continua com gente.",
  },
  {
    question: "Funciona com impressora e tela da cozinha?",
    answer:
      "Sim. O pedido chega na tela da cozinha (ou bar) e dá pra amarrar impressão conforme a montagem da casa. O importante é o pedido certo chegar.",
  },
  {
    question: "Quanto tempo pra colocar pra rodar?",
    answer:
      "Em geral é rápido: kit, mesas, telas, um treino curto com a equipe e a gente acompanha o começo. O prazo depende do tamanho do salão.",
  },
] as const;

export const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};
