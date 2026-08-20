export const site = {
  name: 'Dr. Bruno França',
  handle: 'drbrunofranca_',
  tagline: 'Facetas em Tatuí',
  promise: 'Estética odontológica com planejamento individualizado',
  location: 'Tatuí, SP',
  followers: 2217,
  years: 9,
  whatsapp: '',
  whatsappMessage:
    'Olá! Vi o site do Dr. Bruno França e gostaria de agendar uma avaliação.',
  links: {
    instagram: 'https://www.instagram.com/drbrunofranca_/',
  },
} as const

export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/hero-reel.jpg',
  doctor: '/instagram/post-5.jpg',
} as const

export type Treatment = {
  id: string
  title: string
  description: string
  image: string
}

export const treatments: Treatment[] = [
  {
    id: 'facetas',
    title: 'Facetas',
    description:
      'Pequenos detalhes que devolvem equilíbrio, harmonia e uma nova expressão ao sorriso — com técnica, planejamento e naturalidade.',
    image: '/instagram/post-6.jpg',
  },
  {
    id: 'clareamento',
    title: 'Clareamento',
    description:
      'Cada paciente possui um ponto de partida e um planejamento individualizado. Resultados únicos, conduzidos com acompanhamento profissional.',
    image: '/instagram/post-9.jpg',
  },
  {
    id: 'resina',
    title: 'Acréscimos em resina',
    description:
      'Acréscimos estratégicos para valorizar o sorriso, respeitando características naturais e preservando o que já tinha de mais bonito.',
    image: '/instagram/post-8.jpg',
  },
]

export type ResultCase = {
  id: number
  image: string
  title: string
  excerpt: string
  treatment: string
  permalink: string
  source: string
}

export const results: ResultCase[] = [
  {
    id: 1,
    image: '/instagram/post-2.jpg',
    title: 'Clareamento A3 → BL3',
    excerpt:
      'Evolução da cor A3 para BL3 — sorriso mais claro, leve e naturalmente bonito.',
    treatment: 'Clareamento',
    permalink: 'https://www.instagram.com/p/Db61RUjEWMS/',
    source: 'Instagram @drbrunofranca_',
  },
  {
    id: 2,
    image: '/instagram/post-13.jpg',
    title: 'Transformação diária',
    excerpt: 'Uma das transformações realizadas no consultório.',
    treatment: 'Estética',
    permalink: 'https://www.instagram.com/p/DbTZOz8xTRO/',
    source: 'Instagram @drbrunofranca_',
  },
  {
    id: 3,
    image: '/instagram/post-1.jpg',
    title: 'Transformação',
    excerpt: 'Há 9 anos realizando sonhos — só quem passou por aqui sabe o que é viver uma transformação.',
    treatment: 'Estética',
    permalink: 'https://www.instagram.com/p/DcNOqATN96h/',
    source: 'Instagram @drbrunofranca_',
  },
  {
    id: 4,
    image: '/instagram/post-15.jpg',
    title: 'Antes e depois',
    excerpt:
      'Evolução acompanhada desde a cor inicial até o resultado final, mantendo naturalidade.',
    treatment: 'Clareamento',
    permalink: 'https://www.instagram.com/p/DbTZO0zxlFG/',
    source: 'Instagram @drbrunofranca_',
  },
  {
    id: 5,
    image: '/instagram/post-10.jpg',
    title: 'Harmonia do sorriso',
    excerpt: 'Resultado conduzido com planejamento e acompanhamento profissional.',
    treatment: 'Estética',
    permalink: 'https://www.instagram.com/p/Dbd5cJUxKs8/',
    source: 'Instagram @drbrunofranca_',
  },
  {
    id: 6,
    image: '/instagram/post-20.jpg',
    title: 'Transformação',
    excerpt: 'Sorriso mais iluminado, respeitando as características naturais dos dentes.',
    treatment: 'Estética',
    permalink: 'https://www.instagram.com/p/Da1Fj3sx1t3/',
    source: 'Instagram @drbrunofranca_',
  },
  {
    id: 7,
    image: '/instagram/post-11.jpg',
    title: 'Naturalidade',
    excerpt: 'Beleza em realçar o que cada pessoa tem de único.',
    treatment: 'Facetas',
    permalink: 'https://www.instagram.com/p/Dbd5cL6xCXE/',
    source: 'Instagram @drbrunofranca_',
  },
  {
    id: 8,
    image: '/instagram/post-16.jpg',
    title: 'Resultado clínico',
    excerpt: 'Técnica e naturalidade caminhando juntas.',
    treatment: 'Estética',
    permalink: 'https://www.instagram.com/p/DbRgr4rxgk-/',
    source: 'Instagram @drbrunofranca_',
  },
  {
    id: 9,
    image: '/instagram/post-6.jpg',
    title: 'Acréscimos em resina',
    excerpt:
      'Detalhes estratégicos que devolvem equilíbrio e fazem o sorriso ganhar nova expressão.',
    treatment: 'Resina',
    permalink: 'https://www.instagram.com/p/Dbd5b5Vxx01/',
    source: 'Instagram @drbrunofranca_',
  },
  {
    id: 10,
    image: '/instagram/post-12.jpg',
    title: 'Estética odontológica',
    excerpt: 'Cada detalhe importa na construção de um sorriso leve e elegante.',
    treatment: 'Estética',
    permalink: 'https://www.instagram.com/p/DbTZd0IEaxr/',
    source: 'Instagram @drbrunofranca_',
  },
]

export const philosophy = {
  headline: 'Antes de cuidar de dentes, cuidamos de pessoas.',
  body: 'Um consultório onde cada conversa importa, cada detalhe é planejado e cada tratamento respeita quem está por trás do sorriso.',
  source: 'Instagram @drbrunofranca_',
} as const

export const doctor = {
  name: 'Dr. Bruno França',
  role: 'Cirurgião-dentista · Estética odontológica',
  bio: 'Há 9 anos vivendo o sonho de realizar sonhos. Só quem já passou por aqui sabe o que é viver uma transformação.',
  photo: media.profile,
  portrait: media.doctor,
  source: 'Instagram @drbrunofranca_',
} as const

export const navLinks = [
  { label: 'Tratamentos', href: '#tratamentos' },
  { label: 'Resultados', href: '#resultados' },
  { label: 'Dr. Bruno', href: '#profissional' },
  { label: 'Contato', href: '#contato' },
] as const
