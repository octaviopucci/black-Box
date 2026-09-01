export const media = {
  profile: 'instagram/profile.jpg',
  hero: 'instagram/post-9.jpg',
  space: 'instagram/post-1.jpg',
  gallery: [
    'instagram/post-1.jpg',
    'instagram/post-2.jpg',
    'instagram/post-5.jpg',
    'instagram/post-8.jpg',
    'instagram/post-9.jpg',
  ],
} as const

export const site = {
  name: 'Vida',
  fullName: 'Clínica Vida',
  tagline: 'Clínica multidisciplinar',
  slogan: 'VIDA… é isso que nos MOVE!',
  headline: 'Cuidado integral para quem quer voltar a se mover — e viver melhor.',
  description:
    'Clínica multidisciplinar em Capão Bonito/SP — fisioterapia, medicina, exames e parceiros especializados sob o mesmo teto. Agende pelo WhatsApp.',
  instagram: 'https://www.instagram.com/clinicavida_cb',
  instagramHandle: '@clinicavida_cb',
  phone: {
    label: '(15) 99764-9228',
    href: 'tel:+5515997649228',
  },
  whatsapp: {
    number: '5515997649228',
    message: 'Olá! Vim pelo site da Clínica Vida e gostaria de agendar um atendimento.',
  },
  address: 'Rua Floriano Peixoto, 230 — Centro — Capão Bonito/SP',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Floriano+Peixoto,+230,+Centro,+Cap%C3%A3o+Bonito+SP',
  city: 'Capão Bonito/SP',
  hours: 'Segunda a sexta · consulte horários pelo WhatsApp',
  nav: [
    { label: 'Essência', href: '#essencia' },
    { label: 'Especialidades', href: '#especialidades' },
    { label: 'Espaço', href: '#espaco' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Agendar', href: '#agendar' },
  ],
  manifesto: [
    'Seu corpo foi feito para se movimentar.',
    'Na Clínica Vida, unimos tecnologia, conhecimento técnico e atendimento humanizado.',
    'VIDA… é isso que nos MOVE!',
  ],
  story: [
    'Somos uma clínica multidisciplinar em Capão Bonito que reúne fisioterapia, medicina, exames laboratoriais e parceiros especializados — com foco em recuperação funcional, saúde da mulher e cuidado de verdade.',
    'Cada atendimento parte da escuta: identificar a origem do problema, não apenas aliviar o sintoma.',
  ],
  principles: [
    {
      title: 'Movimento',
      description:
        'Fisioterapia com equipamentos como o Home-Leg — na clínica ou em domicílio — para fortalecer, equilibrar e recuperar independência.',
    },
    {
      title: 'Integração',
      description:
        'Medicina, nutrição, psicologia, odontologia e terapias complementares conectadas para um plano que respeita sua rotina.',
    },
    {
      title: 'Presença',
      description:
        'Acolhimento real, exames com parceiros de referência e acompanhamento próximo — do primeiro contato ao resultado.',
    },
  ],
} as const

export type Specialty = {
  id: string
  title: string
  line: string
  detail: string
  image: string
  accent: string
}

export const specialties: Specialty[] = [
  {
    id: 'fisio',
    title: 'Fisioterapia & reabilitação',
    line: 'Tratar a causa, não só o sintoma',
    detail:
      'Identificamos a origem da dor e desenvolvemos tratamento individualizado — com Home-Leg para fortalecimento, mobilidade e recuperação funcional, inclusive em domicílio.',
    image: media.gallery[1],
    accent: 'Reabilitação',
  },
  {
    id: 'medicina',
    title: 'Medicina & emagrecimento',
    line: 'Mudança sustentável, não efeito sanfona',
    detail:
      'Acompanhamento individualizado que considera rotina, composição corporal, hormônios, sono e hábitos — com a Dra. Thayla Maine, foco em emagrecimento e saúde da mulher.',
    image: media.gallery[2],
    accent: 'Saúde da mulher',
  },
  {
    id: 'parceiros',
    title: 'Exames & parceiros',
    line: 'Coleta, diagnóstico e saúde auditiva',
    detail:
      'Laboratório Paulista dentro da clínica para exames com cuidado e segurança. Parceria com Ouvitec para saúde auditiva, aparelhos e exames especializados.',
    image: media.gallery[0],
    accent: 'Diagnóstico',
  },
]

export const faq = [
  {
    q: 'Como agendo um atendimento?',
    a: 'Pelo WhatsApp — é o canal mais rápido. Informe a especialidade desejada e nossa equipe orienta horários e documentos necessários.',
  },
  {
    q: 'Quais especialidades vocês oferecem?',
    a: 'Fisioterapia, medicina (incluindo emagrecimento e saúde da mulher), exames laboratoriais, saúde auditiva com Ouvitec, além de psicologia, odontologia e terapia ocupacional — tudo integrado na clínica.',
  },
  {
    q: 'O Home-Leg pode ser usado em casa?',
    a: 'Sim. Além dos atendimentos na clínica, o equipamento pode ser levado para domicílio — ideal para reabilitação, pós-operatório e idosos que precisam recuperar força e equilíbrio.',
  },
  {
    q: 'Onde a clínica fica?',
    a: 'Rua Floriano Peixoto, 230 — Centro, Capão Bonito/SP. Use o mapa no rodapé ou pergunte pelo WhatsApp.',
  },
] as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
