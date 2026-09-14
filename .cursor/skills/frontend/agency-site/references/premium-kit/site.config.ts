export const siteConfig = {
  name: "Marca",
  domain: "https://example.com",
  description:
    "Descrição curta para SEO — substitua pelo produto/serviço real.",

  contact: {
    whatsapp: "5500000000000",
    whatsappDisplay: "(00) 00000-0000",
    phone: "0800 000 0000",
    email: "contato@example.com",
    address: "Rua Exemplo, 100 — Cidade, UF",
  },

  nav: [
    { label: "Planos", href: "#planos" },
    { label: "Benefícios", href: "#beneficios" },
    { label: "Sobre", href: "#sobre" },
    { label: "FAQ", href: "#faq" },
  ],

  hero: {
    eyebrow: "Marca · Nicho",
    headline: "Sua vida acontece rápido. Sua [serviço] também deveria.",
    subheadline:
      "Trabalhe, estude e conecte todos os seus dispositivos com uma solução preparada para acompanhar o seu ritmo.",
    ctaPrimary: { label: "Ver planos", href: "#planos" },
    ctaSecondary: {
      label: "Falar no WhatsApp",
      href: "https://wa.me/5500000000000",
    },
    badges: ["Qualidade", "Suporte próximo", "Sem fidelidade", "Instalação rápida"],
  },

  lifestyle: {
    headlines: [
      "Home office sem quedas",
      "Rotina conectada o dia inteiro",
      "Performance quando você precisa",
    ],
    subline: "Tecnologia que acompanha cada momento do seu dia.",
  },

  features: {
    eyebrow: "Por quê escolher",
    title: "Tecnologia para conectar.",
    titleMuted: "Atendimento para aproximar.",
    items: [
      {
        title: "Qualidade consistente",
        description: "Infraestrutura preparada para sua rotina digital.",
      },
      {
        title: "Atendimento próximo",
        description: "Quando precisar de ajuda, a equipe está aqui.",
      },
      {
        title: "Planos flexíveis",
        description: "Escolha o que combina com o seu perfil.",
      },
      {
        title: "Evolução contínua",
        description: "Rede preparada para novas necessidades.",
      },
    ],
  },

  statement: {
    brand: "Marca",
    line: "Sua conexão para tudo o que importa.",
  },

  about: {
    eyebrow: "Desde 2020",
    title: "Tempo de casa não se improvisa.",
    body: "Nascemos na região e seguimos atendendo as mesmas ruas. Conhecemos cliente pelo nome e respondemos por cada entrega.",
    stat: { value: "5", unit: "anos", label: "de mercado na região" },
    pills: [
      "Mais investe na região",
      "Mais emprega",
      "Mais apoia a comunidade",
    ],
  },

  pricing: {
    eyebrow: "Planos",
    title: "Escolha o plano ideal.",
    plans: [
      {
        name: "Essencial",
        price: "R$ 99",
        period: "/mês",
        description: "Para quem precisa do básico bem feito.",
        features: ["Feature A", "Feature B", "Suporte"],
        highlighted: false,
        cta: "Contratar",
      },
      {
        name: "Completo",
        price: "R$ 149",
        period: "/mês",
        badge: "Recomendado",
        description: "O equilíbrio ideal para a maioria.",
        features: ["Tudo do Essencial", "Feature C", "Feature D", "Prioridade"],
        highlighted: true,
        cta: "Contratar agora",
      },
      {
        name: "Premium",
        price: "R$ 299",
        period: "/mês",
        description: "Máximo desempenho para exigentes.",
        features: ["Tudo do Completo", "Feature E", "Feature F"],
        highlighted: false,
        cta: "Contratar",
      },
    ],
  },

  benefits: {
    eyebrow: "Incluso",
    title: "Você contrata um serviço.",
    titleMuted: "E leva muito mais que isso.",
    items: [
      { title: "+200 cursos", description: "Com certificado ao concluir." },
      { title: "Suporte dedicado", description: "Canal direto com a equipe." },
      { title: "App próprio", description: "Tudo na palma da mão." },
      { title: "Instalação", description: "Agendamento rápido." },
      { title: "Garantia", description: "Compromisso com qualidade." },
      { title: "Sem fidelidade", description: "Flexibilidade real." },
    ],
  },

  support: {
    eyebrow: "Resolva sem complicação",
    title: "Tudo o que você precisa, mais perto de você.",
    links: [
      { title: "Central", description: "Conta e serviços.", href: "#" },
      { title: "Suporte", description: "Ajuda quando precisar.", href: "#" },
      { title: "Documentos", description: "Contratos e faturas.", href: "#" },
    ],
  },

  faq: {
    eyebrow: "Dúvidas",
    title: "Algumas respostas antes mesmo de você perguntar.",
    items: [
      {
        q: "Como funciona a contratação?",
        a: "Entre em contato, escolha o plano e agendamos a instalação ou onboarding.",
      },
      {
        q: "Qual o prazo?",
        a: "Varia conforme demanda e região. Informamos na contratação.",
      },
      {
        q: "Preciso de fidelidade?",
        a: "Consulte condições do plano escolhido — priorizamos flexibilidade.",
      },
      {
        q: "Como falo com o suporte?",
        a: "WhatsApp, telefone ou central online — links no rodapé.",
      },
    ],
  },

  testimonials: {
    eyebrow: "Quem usa, conta",
    title: "Confiança se conquista todos os dias.",
    items: [
      { quote: "Ótimo atendimento e estabilidade.", author: "Cliente" },
      { quote: "Resolveu minha rotina de trabalho.", author: "Cliente" },
      { quote: "Equipe sempre disponível.", author: "Cliente" },
    ],
  },

  footerCta: {
    title: "Pronto para mudar a forma como você se conecta?",
    ctaPrimary: { label: "Ver planos", href: "#planos" },
    ctaSecondary: {
      label: "WhatsApp",
      href: "https://wa.me/5500000000000",
    },
  },
} as const

export type SiteConfig = typeof siteConfig
