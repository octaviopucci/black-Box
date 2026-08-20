export const site = {
  name: 'Marcenaria Noé',
  handle: 'marcenarianoe',
  tagline: 'Móveis de alto padrão',
  promise: 'Especializada em projetos especiais',
  description:
    'Marcenaria especializada em fabricação de móveis sob medida.',
  followers: 3107,
  whatsapp: '5515996365101',
  whatsappMessage:
    'Olá! Vi o site da Marcenaria Noé e gostaria de solicitar um orçamento.',
  links: {
    instagram: 'https://www.instagram.com/marcenarianoe/',
    facebook: 'https://www.facebook.com/marcenarianoe',
    linktree: 'https://linktr.ee/marcenarianoe',
  },
} as const

/** Imagens por shortcode — extraídas via instaloader (foto real de cada post). */
export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/DadaK37TSAP.jpg',
  gallery: [
    '/instagram/DadaK37TSAP.jpg',
    '/instagram/DYkOMaUDR9M.jpg',
    '/instagram/DY65lb0R2K4.jpg',
    '/instagram/DY5DtLLzX0B.jpg',
    '/instagram/DZi3PTrFdoM.jpg',
    '/instagram/DYkNtLQt4uY.jpg',
    '/instagram/DYkNtMZtaKq.jpg',
  ],
} as const

export type PortfolioItem = {
  id: number
  image: string
  title: string
  excerpt: string
  tags: string[]
  permalink: string
  source: string
}

export const portfolio: PortfolioItem[] = [
  {
    id: 1,
    image: '/instagram/DadaK37TSAP.jpg',
    title: 'Sala de jantar',
    excerpt: 'Uma sala de jantar luxuosa e refinada.',
    tags: ['moveissobmedida', 'saladejantar', 'moveisaltopadrao'],
    permalink: 'https://www.instagram.com/p/DadaK37TSAP/',
    source: 'Instagram @marcenarianoe',
  },
  {
    id: 2,
    image: '/instagram/DYkOMaUDR9M.jpg',
    title: 'Cozinha clássica contemporânea',
    excerpt:
      'Elegância, funcionalidade e sofisticação em cada detalhe — armários off-white, puxadores dourados, revestimento marmorizado iluminado e eletros em preto.',
    tags: ['cozinhaplanejada', 'marcenariadealtopadrao', 'projetosobmedida'],
    permalink: 'https://www.instagram.com/p/DZi2jCmh-f5/',
    source: 'Instagram @marcenarianoe',
  },
  {
    id: 3,
    image: '/instagram/DY65lb0R2K4.jpg',
    title: 'Penteadeira',
    excerpt: 'Uma penteadeira linda e charmosa.',
    tags: ['penteadeirascamarim', 'dormitoriosmodernos', 'moveisplanejados'],
    permalink: 'https://www.instagram.com/p/DZi2i8rsIbt/',
    source: 'Instagram @marcenarianoe',
  },
  {
    id: 4,
    image: '/instagram/DY5DtLLzX0B.jpg',
    title: 'Quarto gamer',
    excerpt: 'Lindo quarto gamer.',
    tags: ['quartogamer', 'moveisplanejados', 'marcenaria'],
    permalink: 'https://www.instagram.com/p/DZi2jANhug3/',
    source: 'Instagram @marcenarianoe',
  },
  {
    id: 5,
    image: '/instagram/DZi3PTrFdoM.jpg',
    title: 'Letra caixa personalizada',
    excerpt:
      'Letra caixa MRNT feita para o departamento @jovensapso — peça exclusiva em MDF personalizado.',
    tags: ['mdfpersonalizado', '7personalizados'],
    permalink: 'https://www.instagram.com/p/DZi3PTrFdoM/',
    source: 'Instagram @marcenarianoe',
  },
]

export type Ambiente = {
  id: string
  name: string
  detail: string
}

export const ambientes: Ambiente[] = [
  {
    id: 'cozinhas',
    name: 'Cozinhas planejadas',
    detail:
      'Marcenaria planejada com aproveitamento inteligente dos espaços, iluminação LED embutida e acabamentos sofisticados.',
  },
  {
    id: 'dormitorios',
    name: 'Dormitórios',
    detail:
      'Quartos modernos, penteadeiras e ambientes pensados para conforto e personalidade.',
  },
  {
    id: 'salas',
    name: 'Salas e jantares',
    detail: 'Móveis sob medida que elevam a sala — luxuosos, refinados e funcionais.',
  },
  {
    id: 'especiais',
    name: 'Projetos especiais',
    detail:
      'Peças exclusivas, letras caixa, MDF personalizado e projetos que exigem solução única.',
  },
]

export const processSteps = [
  {
    step: '01',
    title: 'Conversa',
    text: 'Entendemos o ambiente, suas necessidades e referências visuais.',
  },
  {
    step: '02',
    title: 'Projeto',
    text: 'Desenvolvemos a solução sob medida com materiais e acabamentos definidos.',
  },
  {
    step: '03',
    title: 'Fabricação',
    text: 'Produção artesanal com atenção a cada detalhe e encaixe.',
  },
  {
    step: '04',
    title: 'Instalação',
    text: 'Entrega e montagem no local, prontos para uso.',
  },
] as const

export function whatsappHref(message = site.whatsappMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}
