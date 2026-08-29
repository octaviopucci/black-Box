export type ProjectStatus = 'CONCLUÍDO' | 'EM ANDAMENTO' | 'EM ACOMPANHAMENTO'

export type ContentCategory =
  | 'TODOS'
  | 'SAÚDE'
  | 'CIDADE'
  | 'INFRAESTRUTURA'
  | 'COMUNIDADE'
  | 'FISCALIZAÇÃO'
  | 'VÍDEOS'

export interface SiteConfig {
  name: string
  nameLines: [string, string]
  handle: string
  city: string
  state: string
  locationLabel: string
  tagline: string
  heroHeadline: string
  heroHighlight: string
  heroSubheadline: string
  seo: {
    title: string
    description: string
  }
  formation: string
  role: string
  history: string
  family: string
  instagramUrl: string
  whatsapp: string
  whatsappDisplay: string
  email: string
  facebookUrl: string
  youtubeUrl: string
}

export interface StatItem {
  id: string
  value: string
  label: string
}

export interface TimelineItem {
  id: string
  year: string
  title: string
  description: string
  image?: string
}

export interface AboutFact {
  id: string
  label: string
  value: string
}

export interface AreaOfActuation {
  id: string
  title: string
  description: string
  icon: string
  slug: string
}

export interface Project {
  slug: string
  category: string
  title: string
  date: string
  location: string
  description: string
  summary: string
  status: ProjectStatus
  image: string
  gallery: string[]
  videos: { title: string; url: string }[]
  updates: { date: string; text: string }[]
  relatedLinks: { label: string; url: string }[]
  isPlaceholder?: boolean
}

export interface Article {
  slug: string
  category: Exclude<ContentCategory, 'TODOS'>
  title: string
  date: string
  summary: string
  readTime: string
  image: string
  body: string[]
  isPlaceholder?: boolean
  source?: string
}

export interface VideoItem {
  id: string
  title: string
  date: string
  category: string
  thumbnail: string
  url: string
  platform: 'instagram' | 'youtube'
  isPlaceholder?: boolean
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  category: 'Cidade' | 'Comunidade' | 'Reuniões' | 'Visitas' | 'Eventos'
}

export interface MapMarker {
  id: string
  name: string
  category: string
  description: string
  date: string
  image?: string
  link?: string
  x: number
  y: number
  isPlaceholder?: boolean
}

export interface InstagramPost {
  id: number
  thumbnail: string
  date: string
  category: string
  title: string
  url: string
  isPlaceholder?: boolean
}

export interface FeaturedItem {
  id: string
  category: string
  title: string
  image: string
  link: string
  featured?: boolean
  isPlaceholder?: boolean
}

export const siteConfig: SiteConfig = {
  name: 'Heitor da Gelsa',
  nameLines: ['HEITOR', 'DA GELSA'],
  handle: 'heitordagelsa',
  city: 'Capão Bonito',
  state: 'SP',
  locationLabel: 'Capão Bonito — SP',
  tagline: 'Presença que se transforma em trabalho.',
  heroHeadline: 'Presença que se transforma em',
  heroHighlight: 'TRABALHO.',
  heroSubheadline:
    'Conheça a trajetória, a atuação pública, os projetos e os conteúdos de Heitor da Gelsa em Capão Bonito.',
  seo: {
    title: 'Heitor da Gelsa | Atuação Pública em Capão Bonito',
    description:
      'Conheça a trajetória, atuação pública, projetos, conteúdos e canais de contato de Heitor da Gelsa em Capão Bonito.',
  },
  formation: 'Bacharel em Direito',
  role: 'Assessor Parlamentar',
  history: 'Vereador por dois mandatos',
  family: 'Pai do Calebe e do Arthur',
  instagramUrl: 'https://www.instagram.com/heitordagelsa/',
  whatsapp: '5515998591411',
  whatsappDisplay: '(15) 99859-1411',
  email: '[INSERIR E-MAIL REAL]',
  facebookUrl: '[INSERIR LINK DO FACEBOOK]',
  youtubeUrl: '[INSERIR LINK DO YOUTUBE]',
}

/** Fotos reais curadas — sem prints, overlays ou artes de campanha. */
export const media = {
  profile: '/photos/01-hero.jpg',
  hero: '/photos/01-hero.jpg',
  about: '/photos/02-rua.jpg',
  saude: '/photos/03-saude.jpg',
  comunidade: '/photos/04-comunidade.jpg',
  trabalho: '/photos/05-trabalho.jpg',
  parceria: '/photos/06-parceria.jpg',
  presenca: '/photos/07-presenca.jpg',
  documentos: '/photos/08-documentos.jpg',
  gallery: [
    '/photos/01-hero.jpg',
    '/photos/02-rua.jpg',
    '/photos/03-saude.jpg',
    '/photos/04-comunidade.jpg',
    '/photos/05-trabalho.jpg',
    '/photos/06-parceria.jpg',
    '/photos/07-presenca.jpg',
    '/photos/08-documentos.jpg',
  ],
}

export const stats: StatItem[] = [
  { id: 'mandatos', value: '02', label: 'MANDATOS COMO VEREADOR' },
  { id: 'votos', value: '8.733', label: 'VOTOS NA ELEIÇÃO MUNICIPAL' },
  { id: 'formacao', value: 'BACHAREL', label: 'EM DIREITO' },
  { id: 'cidade', value: 'CAPÃO BONITO', label: 'CIDADE DE ATUAÇÃO' },
]

export const aboutFacts: AboutFact[] = [
  { id: 'formacao', label: 'FORMAÇÃO', value: 'Bacharel em Direito' },
  { id: 'atuacao', label: 'ATUAÇÃO PÚBLICA', value: 'Vereador por dois mandatos' },
  { id: 'parlamentar', label: 'ATUAÇÃO PARLAMENTAR', value: 'Assessor Parlamentar' },
  { id: 'cidade', label: 'CIDADE', value: 'Capão Bonito — SP' },
]

export const aboutIntro =
  'Heitor da Gelsa é bacharel em Direito, assessor parlamentar e exerceu dois mandatos como vereador em Capão Bonito.'

export const navLinks = [
  { label: 'Início', href: '/#inicio' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Atuação', href: '/#atuacao' },
  { label: 'Projetos', href: '/#projetos' },
  { label: 'Conteúdos', href: '/conteudos' },
  { label: 'Contato', href: '/#contato' },
]

export const socialLinks = [
  { id: 'instagram', label: 'Instagram', url: siteConfig.instagramUrl },
  { id: 'whatsapp', label: 'WhatsApp', url: `https://wa.me/${siteConfig.whatsapp}` },
  { id: 'facebook', label: 'Facebook', url: siteConfig.facebookUrl },
  { id: 'youtube', label: 'YouTube', url: siteConfig.youtubeUrl },
]
