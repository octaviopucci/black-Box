export const site = {
  name: 'Octávio Pucci Tattoo',
  handle: 'octavio-pucci-tattoo',
  brand: 'OCTÁVIO PUCCI',
  mantra: 'Predestinado',
  tagline: 'Tatuador · Studio Privado',
  headline: 'Arte que carrega significado.',
  subline:
    'Composição autoral, dedicação do primeiro traço ao último branco — em studio privado.',
  description:
    'Octávio Pucci — tatuador em Capão Bonito/SP. Realismo preto e cinza, coberturas e fine line. Orçamentos pelo WhatsApp.',
  instagram: 'https://www.instagram.com/octaviopuccitattoo',
  instagramHandle: '@octaviopuccitattoo',
  phone: {
    label: '(15) 99749-9178',
    href: 'tel:+5515997499178',
  },
  whatsapp: {
    number: '5515997499178',
    message:
      'Olá, Octávio! Vim pelo site e quero orçar um projeto de tatuagem.',
  },
  city: 'Capão Bonito/SP',
  studio: 'Studio Privado · Capão Bonito/SP',
  years: 12,
  followers: 6836,
  nav: [
    { label: 'Linguagens', href: '#linguagens' },
    { label: 'Arquivo', href: '#arquivo' },
    { label: 'Processo', href: '#processo' },
    { label: 'Orçar', href: '#orcar' },
  ],
} as const

export const manifesto = [
  'Há marcas que você escolhe.',
  'Há marcas que te encontram.',
  'No studio, o destino vira pele.',
] as const

export type Specialty = {
  id: string
  title: string
  line: string
  detail: string
  proof: string
  source: string
}

/** Especialidades extraídas de legendas reais do Instagram @octaviopuccitattoo */
export const specialties: Specialty[] = [
  {
    id: 'realismo',
    title: 'Realismo preto & cinza',
    line: 'Volume, luz e pele que respira',
    detail:
      'Retratos, homenagens e grandes fechamentos — atenção máxima do primeiro ao último traço, mesmo em sessões longas.',
    proof: 'Fechamento de braço em uma única sessão de 20 horas.',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    id: 'cobertura',
    title: 'Coberturas & reformas',
    line: 'Sem cara de cobertura',
    detail:
      'Composições autorais que contam história sobre o passado — buscando naturalidade, sem aquele “borrão” preto.',
    proof: 'Cobertura em 3 sessões com mais de 80% já cicatrizado.',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    id: 'fineline',
    title: 'Fine line',
    line: 'Traço fino, intenção pesada',
    detail:
      'Linhas delicadas e projetos exclusivos para quem valoriza arte bem feita e durável.',
    proof: 'Especialista em Fine Line, Realismo, Reforma e Cobertura.',
    source: 'Instagram @octaviopuccitattoo',
  },
]

export type GalleryItem = {
  id: number
  image: string
  alt: string
  caption?: string
  permalink: string
}

export const gallery: GalleryItem[] = [
  {
    id: 6,
    image: '/instagram/post-6.jpg',
    alt: 'Fechamento de costas Hannya em realismo preto e cinza',
    caption: 'Hannya — fechamento de costas completo em 2 sessões.',
    permalink: 'https://www.instagram.com/p/DZ-gosFEfpm/',
  },
  {
    id: 5,
    image: '/instagram/post-5.jpg',
    alt: 'Fechamento de braço em realismo — tigre e coruja',
    caption: 'Fechamento de braço externo — 20 horas em uma sessão.',
    permalink: 'https://www.instagram.com/p/DZ-gnyRxnG-/',
  },
  {
    id: 3,
    image: '/instagram/post-3.jpg',
    alt: 'Cobertura autoral em realismo',
    caption: 'Composição 100% autoral — cobertura em 3 sessões.',
    permalink: 'https://www.instagram.com/p/DZ-gnu9RvGA/',
  },
  {
    id: 2,
    image: '/instagram/post-2.jpg',
    alt: 'Tatuagem homenagem em realismo',
    caption: 'Arte exclusiva em homenagem — significado e laço emocional.',
    permalink: 'https://www.instagram.com/p/DZ-gn8yR21c/',
  },
  {
    id: 4,
    image: '/instagram/post-4.jpg',
    alt: 'Complemento no joelho em realismo',
    caption: 'Complemento no joelho — detalhes e brancos.',
    permalink: 'https://www.instagram.com/p/DZ-gnwvxTBp/',
  },
  {
    id: 7,
    image: '/instagram/post-7.jpg',
    alt: 'Trabalho de tatuagem em realismo — Octávio Pucci',
    permalink: 'https://www.instagram.com/p/DZ-gn6pxAHv/',
  },
  {
    id: 8,
    image: '/instagram/post-8.jpg',
    alt: 'Trabalho de tatuagem em realismo — Octávio Pucci',
    permalink: 'https://www.instagram.com/p/DZ-goAkxk7P/',
  },
  {
    id: 9,
    image: '/instagram/post-9.jpg',
    alt: 'Trabalho de tatuagem em realismo — Octávio Pucci',
    permalink: 'https://www.instagram.com/p/DZ-goMFxZOU/',
  },
  {
    id: 11,
    image: '/instagram/post-11.jpg',
    alt: 'Trabalho de tatuagem em realismo — Octávio Pucci',
    permalink: 'https://www.instagram.com/p/DUJlf-ejhwM/',
  },
  {
    id: 13,
    image: '/instagram/post-13.jpg',
    alt: 'Trabalho de tatuagem em realismo — Octávio Pucci',
    permalink: 'https://www.instagram.com/p/DTxj8LQjvo2/',
  },
  {
    id: 15,
    image: '/instagram/post-15.jpg',
    alt: 'Trabalho de tatuagem em realismo — Octávio Pucci',
    permalink: 'https://www.instagram.com/p/DQCt4OtDuf6/',
  },
]

export const process = [
  {
    step: '01',
    title: 'História',
    description:
      'Você traz a ideia — homenagem, cobertura, sonho ou símbolo. Eu escuto o que precisa viver na pele.',
  },
  {
    step: '02',
    title: 'Arte',
    description:
      'Composição pensada para o seu corpo. Projeto único e exclusivo — nada de catálogo.',
  },
  {
    step: '03',
    title: 'Sessão',
    description:
      'Presença do primeiro traço ao último branco. Técnica, paciência e atenção intacta a cada hora.',
  },
  {
    step: '04',
    title: 'Pele',
    description:
      'Cuidados e cicatrização. A marca permanece — e o significado também.',
  },
] as const

export const media = {
  hero: '/instagram/post-6.jpg',
  profile: '/instagram/profile.jpg',
} as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file.replace(/^\//, '')}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}

export function formatFollowers(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}k`
  return String(count)
}
