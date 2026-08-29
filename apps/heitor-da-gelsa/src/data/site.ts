export type ProjectStatus = 'CONCLUÍDO' | 'EM ANDAMENTO' | 'EM ACOMPANHAMENTO' | 'REGISTRO PÚBLICO'

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
  fullName: string
  nameLines: [string, string]
  handle: string
  city: string
  state: string
  locationLabel: string
  tagline: string
  heroHeadline: string
  heroHighlight: string
  heroSubheadline: string
  seo: { title: string; description: string }
  formation: string
  role: string
  history: string
  family: string
  spouse: string
  mother: string
  birthDate?: string
  birthPlace?: string
  instagramUrl: string
  whatsapp: string
  whatsappDisplay: string
  email: string
  facebookUrl: string
  youtubeUrl: string
  sources: string[]
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

export interface CarouselSlide {
  id: number
  src: string
  alt: string
}

export interface AboutCarousel {
  url: string
  caption: string
  slides: CarouselSlide[]
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
  caption: string
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

export {
  media,
  siteConfig,
  stats,
  aboutFacts,
  aboutIntro,
  aboutExtended,
  aboutCarousel,
  navLinks,
  socialLinks,
  timeline,
  galleryItems,
  galleryFilters,
  instagramPosts,
  articles,
  getArticleBySlug,
  projects,
  getProjectBySlug,
  videos,
  mapMarkers,
  featuredItems,
} from './content'
