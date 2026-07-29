export const site = {
  name: 'Harmonie',
  fullName: 'Clínica Harmonie',
  legalName: 'Clínica Médica Harmonie Ltda',
  cnpj: '67.005.069/0001-89',
  tagline: 'Saúde, beleza e bem-estar',
  headline: 'Cuidar da sua saúde, bem-estar e autoestima começa aqui.',
  description:
    'Clínica Harmonie em Itapeva/SP — saúde, beleza e bem-estar com estrutura moderna, profissionais preparados e cuidado integral. Agende pelo WhatsApp.',
  promise: 'Seu cuidado merece atenção, estratégia e resultado.',
  instagram: 'https://www.instagram.com/clinicaharmonie.itapeva',
  instagramHandle: '@clinicaharmonie.itapeva',
  phone: {
    label: '(15) 99742-6491',
    href: 'tel:+5515997426491',
  },
  whatsapp: {
    number: '5515997426491',
    message:
      'Olá! Vim pelo site da Clínica Harmonie e gostaria de agendar um horário.',
  },
  address: 'Rua Flauzino Antunes, 146 — Centro — Itapeva/SP, 18400-220',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Flauzino+Antunes,+146,+Centro,+Itapeva+SP',
  city: 'Itapeva/SP',
  nav: [
    { label: 'Essência', href: '#essencia' },
    { label: 'Cuidados', href: '#cuidados' },
    { label: 'Espaço', href: '#espaco' },
    { label: 'Equipe', href: '#equipe' },
    { label: 'Agendar', href: '#agendar' },
  ],
  manifesto: [
    'Na Harmonie, pensamos em cada detalhe.',
    'Estrutura moderna. Profissionais preparados.',
    'Uma experiência completa — com excelência.',
  ],
  story: [
    'Cuidar da sua saúde, bem-estar e autoestima começa aqui.',
    'Somos uma clínica médica em Itapeva que une estética avançada, medicina regenerativa, nutrição, neurologia, saúde mental e modulação hormonal sob o mesmo teto — com atenção, estratégia e resultado.',
  ],
  principles: [
    {
      title: 'Atenção',
      description:
        'Escuta real antes de qualquer conduta. Cada pele, cada corpo e cada rotina pedem um olhar próprio.',
    },
    {
      title: 'Estratégia',
      description:
        'Planos individualizados que conectam estética, saúde e hábitos — sem protocolo genérico.',
    },
    {
      title: 'Resultado',
      description:
        'Tecnologia segura, acompanhamento próximo e evolução constante até o equilíbrio que você busca.',
    },
  ],
} as const

export type CareArea = {
  id: string
  title: string
  line: string
  detail: string
  image: string
  accent: string
}

export const careAreas: CareArea[] = [
  {
    id: 'laser',
    title: 'Depilação a laser',
    line: 'Pele lisa, com tecnologia segura',
    detail:
      'Sessões confortáveis e eficazes para axilas, virilha, pernas e mais — com progresso duradouro e agenda pensada para o seu ritmo.',
    image: 'care-laser.jpg',
    accent: 'Laser Day',
  },
  {
    id: 'botox',
    title: 'Botox preventivo',
    line: 'Naturalidade que se antecipa',
    detail:
      'Suaviza a ação dos músculos das linhas de expressão, retarda rugas marcadas e preserva a expressão do seu rosto — com avaliação individual.',
    image: 'care-botox.jpg',
    accent: 'Estética facial',
  },
  {
    id: 'regen',
    title: 'Medicina regenerativa',
    line: 'Cuidar de dentro para fora',
    detail:
      'Tecnologia de ponta para estimular a regeneração natural dos tecidos — resultados mais naturais, duradouros e alinhados à sua saúde.',
    image: 'care-regen.jpg',
    accent: 'Inovação',
  },
  {
    id: 'nutri',
    title: 'Nutrição & acompanhamento',
    line: 'Estratégia que cabe na vida real',
    detail:
      'Mais do que um plano alimentar: acompanhamento próximo, individualizado e constante — para evolução com segurança.',
    image: 'care-nutri.jpg',
    accent: 'Metabolismo',
  },
  {
    id: 'neuro',
    title: 'Saúde neurológica',
    line: 'Sinais que merecem escuta especializada',
    detail:
      'Esquecimentos, dores de cabeça, tonturas ou dificuldade de concentração — avaliação neurológica com atenção e clareza para cuidar do cérebro.',
    image: 'care-mind.jpg',
    accent: 'Neurologia',
  },
  {
    id: 'hormonal',
    title: 'Modulação hormonal',
    line: 'Protocolo Harmonie',
    detail:
      'Investigação precisa de energia, libido, composição e equilíbrio hormonal — com método personalizado e acompanhamento integral.',
    image: 'care-hormone.jpg',
    accent: 'Endocrinologia',
  },
]

export const team = [
  {
    id: 'rayssa',
    name: 'Dra. Rayssa Alexandre',
    role: 'Clínica médica · Medicina de família',
    crm: 'CRM 214709/SP',
    note: 'Sócia-fundadora. Cuidado próximo, escuta e condução clínica com presença.',
  },
  {
    id: 'marcelo',
    name: 'Dr. Marcelo Prado',
    role: 'Endocrinologia aplicada',
    crm: 'CRM 240129/SP',
    note: 'Sócio-fundador. Emagrecimento, modulação hormonal e Protocolo Harmonie.',
  },
] as const

export const whispers = [
  {
    text: 'Ele é um ótimo profissional, de fácil acesso, um nutricionista atencioso e motivador.',
    who: 'Luísa Rossettini',
    role: 'Médica · Nutrição',
  },
  {
    text: 'Saí da avaliação com clareza. Sem pressa, com um plano que faz sentido para a minha rotina.',
    who: 'Paciente',
    role: 'Estética & bem-estar',
  },
  {
    text: 'Estrutura moderna e acolhimento real. Agendar pelo WhatsApp e ser bem atendida muda tudo.',
    who: 'Paciente',
    role: 'Itapeva',
  },
] as const

export const journey = [
  {
    step: '01',
    title: 'Chegada',
    description: 'Você conta o que busca. A gente escuta o corpo, a rotina e o desejo de equilíbrio.',
  },
  {
    step: '02',
    title: 'Avaliação',
    description: 'Leitura clínica e estética com precisão — para indicar o caminho certo, no tempo certo.',
  },
  {
    step: '03',
    title: 'Condução',
    description: 'Tratamento, hábitos e retornos. Um processo vivo até o resultado que se sustenta.',
  },
] as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
