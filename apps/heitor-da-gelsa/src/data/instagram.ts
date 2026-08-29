import type { InstagramPost, FeaturedItem } from './site'
import { siteConfig } from './site'

export const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    thumbnail: '/instagram/post-2.jpg',
    date: '[DATA]',
    category: 'SAÚDE',
    title: 'Registros sobre saúde da população e entidades sociais',
    url: 'https://www.instagram.com/p/Dcj9pQPtFvJ/',
  },
  {
    id: 2,
    thumbnail: '/instagram/post-3.jpg',
    date: '[DATA]',
    category: 'CIDADE',
    title: 'Demandas urbanas e canal de contato via WhatsApp',
    url: 'https://www.instagram.com/p/Dchf1EENelz/',
  },
  {
    id: 3,
    thumbnail: '/instagram/post-6.jpg',
    date: '[DATA]',
    category: 'COMUNIDADE',
    title: 'Presença nas ruas de Capão Bonito',
    url: 'https://www.instagram.com/p/Dce6eIHRU6C/',
  },
  {
    id: 4,
    thumbnail: '/instagram/post-7.jpg',
    date: '[DATA]',
    category: 'COMUNIDADE',
    title: 'Registro de atuação comunitária',
    url: 'https://www.instagram.com/p/DcZ1Er0tO50/',
  },
  {
    id: 5,
    thumbnail: '/instagram/post-1.jpg',
    date: '[DATA]',
    category: 'TRANSPARÊNCIA',
    title: 'Canal de feedback e melhoria contínua',
    url: 'https://www.instagram.com/p/Dcl-Z9etEMT/',
  },
  {
    id: 6,
    thumbnail: '/instagram/post-8.jpg',
    date: '[DATA]',
    category: 'CIDADE',
    title: 'Registro de atuação pública',
    url: 'https://www.instagram.com/p/DcJ7Vv8t2_L/',
  },
]

export const featuredItems: FeaturedItem[] = [
  {
    id: 'feat-1',
    category: 'SAÚDE',
    title: 'Saúde da população e entidades sociais',
    image: '/instagram/post-2.jpg',
    link: '/conteudos/saude-populacao-registros',
    featured: true,
  },
  {
    id: 'feat-2',
    category: 'CIDADE',
    title: '[DESTAQUE — PLACEHOLDER]',
    image: '/instagram/post-3.jpg',
    link: '/conteudos/placeholder-cidade',
    isPlaceholder: true,
  },
  {
    id: 'feat-3',
    category: 'COMUNIDADE',
    title: '[DESTAQUE — PLACEHOLDER]',
    image: '/instagram/post-6.jpg',
    link: '/conteudos/placeholder-comunidade',
    isPlaceholder: true,
  },
]

export const instagramCta = siteConfig.instagramUrl
