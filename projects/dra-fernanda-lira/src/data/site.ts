/**
 * Dados verificados: nome, especialidade e Instagram (fonte pública).
 * Campos marcados com [CONFIRMAR] precisam ser preenchidos pela Dra. Fernanda.
 */
export const site = {
  name: "Dra. Fernanda Lira",
  tagline: "Especialista em Limpeza de Pele",
  specialty: "Limpeza de pele profunda e protocolos faciais personalizados",
  instagram: {
    handle: "@drafernandaliraaa",
    url: "https://www.instagram.com/drafernandaliraaa",
  },
  whatsapp: null as null | {
    number: string;
    defaultMessage: string;
  },
  location: {
    city: "[CONFIRMAR — cidade]",
    address: "[CONFIRMAR — endereço do consultório]",
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Protocolos", href: "#protocolos" },
    { label: "Experiência", href: "#experiencia" },
    { label: "Contato", href: "#contato" },
  ],
  hero: {
    eyebrow: "Estética facial · Protocolos premium",
    headline: ["Pele limpa,", "luminosa e", "em equilíbrio."],
    subheadline:
      "Protocolos de limpeza de pele com técnica precisa, ambiente acolhedor e cuidado em cada etapa — do diagnóstico ao pós-procedimento.",
  },
  about: {
    title: "Ciência e delicadeza na mesma sessão",
    paragraphs: [
      "A Dra. Fernanda Lira atua com foco em limpeza de pele profunda, unindo avaliação criteriosa, produtos selecionados e movimentos que respeitam a barreira cutânea.",
      "Cada protocolo é pensado para o seu tipo de pele — oleosa, sensível, mista ou madura — com orientação clara para manutenção em casa.",
    ],
    highlights: [
      "Avaliação facial individualizada",
      "Extração técnica e segura",
      "Finalização calmante e protetora",
    ],
  },
  services: [
    {
      title: "Limpeza de Pele Profunda",
      description:
        "Remoção de impurezas, desobstrução de poros e revitalização com etapas de emoliência, extração e máscara específica.",
      tag: "Assinatura",
    },
    {
      title: "Limpeza + Alta Frequência",
      description:
        "Protocolo completo com ação antisséptica e calmante, indicado para peles com tendência a inflamações.",
      tag: "Protocolo",
    },
    {
      title: "Peeling de Diamante",
      description:
        "Esfoliação mecânica controlada para renovação da superfície, luminosidade e melhor absorção de ativos.",
      tag: "Renovação",
    },
    {
      title: "Hidratação & Revitalização",
      description:
        "Reposição de água e lipídios com máscaras e séruns direcionados ao seu diagnóstico cutâneo.",
      tag: "Cuidado",
    },
  ],
  process: [
    {
      step: "01",
      title: "Diagnóstico",
      description: "Análise da pele, histórico e objetivos antes de qualquer procedimento.",
    },
    {
      step: "02",
      title: "Preparação",
      description: "Higienização, emoliência e abertura controlada dos poros.",
    },
    {
      step: "03",
      title: "Tratamento",
      description: "Extração técnica, ativos e tecnologias conforme o protocolo escolhido.",
    },
    {
      step: "04",
      title: "Finalização",
      description: "Máscara calmante, proteção solar e orientações de home care.",
    },
  ],
  experience: {
    title: "Uma jornada sensorial",
    lines: [
      "Ambiente silencioso.",
      "Toque preciso.",
      "Resultado que você sente ao se olhar no espelho.",
    ],
  },
  faq: [
    {
      q: "Com que frequência devo fazer limpeza de pele?",
      a: "Em média, a cada 30 a 45 dias — variando conforme tipo de pele e rotina. A Dra. Fernanda indica o intervalo ideal na avaliação.",
    },
    {
      q: "A limpeza dói?",
      a: "A extração é feita com técnica e ritmo que respeitam seu conforto. Peles sensíveis recebem adaptações no protocolo.",
    },
    {
      q: "Posso usar maquiagem depois?",
      a: "Recomenda-se evitar maquiagem nas primeiras 12–24 horas, conforme orientação pós-sessão.",
    },
  ],
  legal: {
    note: "Procedimentos estéticos. Resultados variam conforme tipo de pele e hábitos individuais.",
    crm: "[CONFIRMAR — CRM/registro profissional, se aplicável]",
  },
} as const;
