export const site = {
  name: 'Rayssa',
  fullName: 'Dra. Rayssa Alexandre Gomes',
  shortName: 'Dra. Rayssa Alexandre',
  crm: 'CRM 214709/SP',
  specialty: 'Clínica Médica · Medicina de Família',
  tagline: 'Cuidado que escuta, informa e acompanha.',
  headline: 'Medicina de família com olhar para corpo, mente e rotina.',
  description:
    'Dra. Rayssa Alexandre — clínica médica e medicina de família em Itapeva/SP. Atendimento próximo, prevenção e saúde mental integrada à Clínica Harmonie.',
  promise:
    'Informação também é proteção. Acolhimento também é cuidado.',
  instagram: 'https://www.instagram.com/rayssagomes.medica',
  instagramHandle: '@rayssagomes.medica',
  clinic: {
    name: 'Clínica Harmonie',
    instagram: 'https://www.instagram.com/clinicaharmonie.itapeva',
    instagramHandle: '@clinicaharmonie.itapeva',
    address: 'Rua Flauzino Antunes, 146 — Centro — Itapeva/SP',
    city: 'Itapeva/SP',
  },
  whatsapp: {
    number: '5515997426491',
    message:
      'Olá, Dra. Rayssa! Vim pelo seu site e gostaria de agendar uma consulta.',
  },
  nav: [
    { label: 'Essência', href: '#essencia' },
    { label: 'Cuidados', href: '#cuidados' },
    { label: 'Conteúdo', href: '#conteudo' },
    { label: 'Agendar', href: '#agendar' },
  ],
} as const

export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/post-5.jpg',
  gallery: [
    '/instagram/post-1.jpg',
    '/instagram/post-3.jpg',
    '/instagram/post-4.jpg',
    '/instagram/post-5.jpg',
    '/instagram/post-6.jpg',
  ],
} as const

export const pillars = [
  {
    id: 'escuta',
    title: 'Escuta',
    line: 'Antes de qualquer conduta, há tempo para ouvir.',
    detail:
      'Consulta com presença — corpo, rotina, emoções e história contada sem pressa. Cuidado que parte do que você vive, não de protocolo genérico.',
  },
  {
    id: 'prevencao',
    title: 'Prevenção',
    line: 'Informação também é proteção.',
    detail:
      'Saúde mental, saúde da mulher, sinais de alerta e hábitos que sustentam o bem-estar. Conteúdo claro para decidir com segurança — no consultório e no dia a dia.',
  },
  {
    id: 'integral',
    title: 'Cuidado integral',
    line: 'Corpo e mente no mesmo plano.',
    detail:
      'Medicina de família conectada à rede da Clínica Harmonie — estética, nutrição, neurologia e modulação hormonal quando o seu caso pede olhar ampliado.',
  },
] as const

export type FeedPost = {
  id: number
  image: string
  excerpt: string
  permalink: string
}

export const feedPosts: FeedPost[] = [
  {
    id: 5,
    image: '/instagram/post-5.jpg',
    excerpt:
      'Acho chique quem escolhe se cuidar por inteiro. Autocuidado também é respeitar limites, acolher emoções e escolher a própria paz.',
    permalink: 'https://www.instagram.com/p/DcL_eDNESFb/',
  },
  {
    id: 3,
    image: '/instagram/post-3.jpg',
    excerpt:
      'Transtornos alimentares vão além da relação com a comida. Quanto mais cedo identificamos sinais, maiores as possibilidades de recuperação.',
    permalink: 'https://www.instagram.com/p/DcmUM2Ro90g/',
  },
  {
    id: 4,
    image: '/instagram/post-4.jpg',
    excerpt:
      'Atividade física também é parte do cuidado com a saúde mental e cerebral — sempre dentro de um tratamento individualizado.',
    permalink: 'https://www.instagram.com/p/DcbLuBlxc5G/',
  },
  {
    id: 1,
    image: '/instagram/post-1.jpg',
    excerpt:
      'Falar sobre violência contra a mulher também é cuidar da saúde mental. Nenhuma mulher deve viver com medo dentro de uma relação.',
    permalink: 'https://www.instagram.com/p/DctNPp1xnbB/',
  },
  {
    id: 6,
    image: '/instagram/post-6.jpg',
    excerpt:
      'Neuromodulação no TEA e TDAH: uma possibilidade dentro de um cuidado individualizado, com protocolos planejados na Clínica Harmonie.',
    permalink: 'https://www.instagram.com/p/DcL_YhdRVn8/',
  },
]

export const faq = [
  {
    q: 'Qual a diferença entre clínica médica e medicina de família?',
    a: 'A medicina de família acompanha você ao longo do tempo — prevenção, diagnóstico e condução de condições crônicas, com visão ampla da sua saúde e da sua rotina.',
  },
  {
    q: 'A Dra. Rayssa atende apenas na Clínica Harmonie?',
    a: 'Sim. As consultas acontecem na Clínica Harmonie, em Itapeva/SP, onde a Dra. Rayssa é sócia-fundadora e integra a equipe clínica.',
  },
  {
    q: 'Como agendar uma consulta?',
    a: 'Pelo WhatsApp. Você recebe orientação sobre horários, documentos e o tipo de consulta mais adequado ao que busca.',
  },
  {
    q: 'A Dra. Rayssa trata saúde mental?',
    a: 'Sim — dentro da clínica médica e medicina de família. Avaliação, acolhimento e encaminhamento quando necessário, sempre com plano individualizado.',
  },
] as const

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
