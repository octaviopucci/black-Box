export const LANDING_WHATSAPP_URL =
  process.env.NEXT_PUBLIC_NA_MESA_WHATSAPP ?? "https://wa.me/55XXXXXXXXXXX";

export const HOW_IT_WORKS_STEPS = [
  "Cliente escaneia o QR",
  "Cardápio abre no celular",
  "Cliente monta o pedido",
  "Pedido entra no NA MESA",
  "Cozinha recebe a comanda",
  "Salão acompanha a mesa",
] as const;

export const MESA_FEATURES = [
  "Pedidos pelo QR",
  "Garçom pelo celular",
  "Comanda para a cozinha",
  "Consumo por mesa",
  "Pedido de conta",
  "Taxa de serviço",
  "Divisão da conta",
  "Ajustes",
] as const;

export type ComparisonRow = {
  label: string;
  others: string;
  naMesa: string;
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Pedido na mesa", others: "Cliente pede pelo QR, conforme a solução", naMesa: "Cliente pede pelo QR" },
  { label: "Comanda / cozinha", others: "Depende da configuração e do plano", naMesa: "Integrada ao fluxo do pedido" },
  { label: "Garçom", others: "Disponível conforme solução/plano", naMesa: "Já faz parte do Essencial" },
  { label: "Mesas e consumo", others: "Conforme a solução", naMesa: "Sim" },
  { label: "Conta", others: "Recursos variam por plano", naMesa: "Conta, taxa, divisão e ajustes" },
  { label: "Plano de entrada", others: "Pode começar no cardápio e exigir upgrade", naMesa: "Essencial já é operação de salão" },
  { label: "Preço", others: "Varia conforme recursos", naMesa: "R$997/ano · ≈ R$83/mês" },
  { label: "Kit físico", others: "Pode não estar incluso", naMesa: "Incluso no anual" },
  { label: "Implantação", others: "Pode ser remota ou self-service", naMesa: "Feita com você" },
  { label: "Atendimento", others: "Estrutura de plataforma", naMesa: "WhatsApp + acompanhamento próximo" },
  { label: "Foco", others: "Plataforma ampla", naMesa: "Salão primeiro" },
];

export type PlanId = "essencial" | "premium" | "custom";

export type Plan = {
  id: PlanId;
  name: string;
  annualPrice: string;
  monthlyPrice?: string;
  quarterlyPrice?: string;
  implantNote?: string;
  annualHighlight?: string;
  features: string[];
  cta: string;
  recommended?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "essencial",
    name: "Essencial",
    annualPrice: "R$ 997/ano",
    monthlyPrice: "R$ 97/mês + R$ 100 impl.",
    quarterlyPrice: "R$ 247/trim. + R$ 100 impl.",
    implantNote: "Mensal e trimestral: 1 peça do kit. Anual: kit completo + implantação inclusa.",
    annualHighlight: "≈ R$83/mês · até 10x no cartão",
    features: [
      "Até 10 mesas",
      "1 garçom",
      "3 usuários",
      "1 casa",
      "Até 3 telas cozinha",
      "Produtos ilimitados",
      "Kit físico no anual",
      "Implantação no anual",
    ],
    cta: "Quero colocar o NA MESA na minha casa",
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    annualPrice: "R$ 1.997/ano",
    monthlyPrice: "R$ 197/mês + R$ 147 impl.",
    quarterlyPrice: "R$ 497/trim. + R$ 147 impl.",
    implantNote: "Kit, implantação, mais capacidade e até 3 casas.",
    features: [
      "Até 3 casas",
      "Relatórios",
      "Mais mesas e garçons",
      "Expansão da operação",
      "Kit e implantação inclusos no anual",
    ],
    cta: "Quero colocar o NA MESA na minha casa",
  },
  {
    id: "custom",
    name: "Custom",
    annualPrice: "A partir de R$ 2.997/ano",
    monthlyPrice: "R$ 297/mês",
    quarterlyPrice: "R$ 797/trim.",
    implantNote: "Implantação a partir de R$ 597.",
    features: [
      "Operação sob medida",
      "Mesas, garçons e casas conforme necessidade",
      "Suporte dedicado",
      "Integrações avançadas",
    ],
    cta: "Falar com a gente",
  },
];

/** PROVISIONAL_TESTIMONIAL — temporário até depoimentos reais */
export type Testimonial = {
  name: string;
  role: string;
  city: string;
  quote: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Roberto Silva",
    role: "Dono · Bar do Roberto",
    city: "Belo Horizonte, MG",
    quote:
      "O rush da sexta parou de virar telefone sem fio. Cliente pede pelo QR, a cozinha vê na hora e meu garçom cuida do salão, não do bloco.",
    initials: "RS",
  },
  {
    name: "Fernanda Costa",
    role: "Sócia · Casa da Carne Costa",
    city: "Curitiba, PR",
    quote:
      "Implantação foi de porta a porta. Placas na mesa, cardápio no celular e a equipe entendeu rápido. Menos mesa parada esperando alguém anotar.",
    initials: "FC",
  },
  {
    name: "Marcos Pereira",
    role: "Proprietário · Restaurante da Vila",
    city: "São Paulo, SP",
    quote:
      "Conta e divisão deixaram de ser briga no fim da noite. Organizou o salão sem tirar o atendimento humano da mesa.",
    initials: "MP",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Meu QR atual só mostra cardápio. Preciso trocar tudo?",
    answer:
      "Se o QR só abre cardápio, o pedido ainda depende de alguém anotar. O NA MESA coloca o pedido dentro da operação: cozinha recebe, salão acompanha e a conta fecha no mesmo fluxo. A gente monta o kit e configura com você.",
  },
  {
    question: "Meus garçons vão perder função?",
    answer:
      "Não. O NA MESA tira do garçom o que não precisa depender dele: anotar, repassar, corrigir. Ele continua no salão, pode lançar pelo celular e cuidar da experiência.",
  },
  {
    question: "Preciso de caixa ou PDV separado?",
    answer:
      "O NA MESA cobre a operação de mesa: pedido, comanda, consumo, pedido de conta, taxa e divisão. Se você já tem caixa, conversamos na implantação sobre o encaixe.",
  },
  {
    question: "O cliente consegue pedir sozinho?",
    answer:
      "Sim. Escaneia o QR, monta o pedido no celular e envia. Garçom também pode lançar pelo celular. Cliente e garçom usam o mesmo fluxo.",
  },
  {
    question: "Como a cozinha recebe?",
    answer:
      "O pedido entra no sistema e aparece na tela da cozinha (KDS) ou conforme a configuração da casa. Sem interpretar letra de bloco.",
  },
  {
    question: "Dá para dividir a conta?",
    answer:
      "Sim. Divisão por pessoa, itens selecionados, taxa de serviço e ajustes entram no fechamento da mesa.",
  },
  {
    question: "Funciona para delivery?",
    answer:
      "O foco do NA MESA é salão: mesa, comanda, cozinha e fechamento. Delivery como operação principal não é o foco.",
  },
  {
    question: "O cliente precisa baixar app?",
    answer:
      "Não. O cardápio abre no navegador do celular, pelo QR da mesa. Sem instalação.",
  },
  {
    question: "Como começa?",
    answer:
      "Fale conosco pelo WhatsApp. A gente entende sua casa, escolhe o plano, faz a implantação e acompanha o começo da operação.",
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

export const PROOF_SLOTS = [
  { id: "guest", step: "01", title: "Cliente", desc: "Escaneia, escolhe e envia" },
  { id: "admin", step: "02", title: "Operação", desc: "Pedido no painel" },
  { id: "kds", step: "03", title: "Cozinha", desc: "Comanda na tela" },
  { id: "waiter", step: "04", title: "Salão", desc: "Garçom no celular" },
  { id: "closing", step: "05", title: "Fechamento", desc: "Conta e divisão" },
] as const;
