import type { InstagramPost, FeaturedItem } from './site'
import { media, siteConfig } from './site'

/** Apenas posts com fotografia real (sem artes/prints). */
export const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    thumbnail: media.saude,
    date: '[DATA]',
    category: 'SAÚDE',
    title: 'Registros sobre saúde da população e entidades sociais',
    url: 'https://www.instagram.com/p/Dcj9pQPtFvJ/',
  },
  {
    id: 2,
    thumbnail: media.presenca,
    date: '[DATA]',
    category: 'CIDADE',
    title: 'Presença e escuta nas ruas de Capão Bonito',
    url: 'https://www.instagram.com/p/Dcl-Z9etEMT/',
  },
  {
    id: 3,
    thumbnail: media.comunidade,
    date: '[DATA]',
    category: 'COMUNIDADE',
    title: 'Proximidade com moradores e demandas locais',
    url: 'https://www.instagram.com/p/DcJ7Vv8t2_L/',
  },
  {
    id: 4,
    thumbnail: media.trabalho,
    date: '[DATA]',
    category: 'TRANSPARÊNCIA',
    title: 'Trabalho acompanhado de perto',
    url: 'https://www.instagram.com/p/DcZ1Er0tO50/',
  },
  {
    id: 5,
    thumbnail: media.parceria,
    date: '[DATA]',
    category: 'COMUNIDADE',
    title: 'Diálogo e parceria na cidade',
    url: siteConfig.instagramUrl,
  },
  {
    id: 6,
    thumbnail: media.documentos,
    date: '[DATA]',
    category: 'CIDADE',
    title: 'Acompanhamento de documentos e demandas',
    url: 'https://www.instagram.com/p/DcZ1Er0tO50/',
  },
]

export const featuredItems: FeaturedItem[] = [
  {
    id: 'feat-1',
    category: 'SAÚDE',
    title: 'Saúde da população e entidades sociais',
    image: media.saude,
    link: '/conteudos/saude-populacao-registros',
    featured: true,
  },
  {
    id: 'feat-2',
    category: 'COMUNIDADE',
    title: 'Presença e proximidade em Capão Bonito',
    image: media.comunidade,
    link: '/conteudos/placeholder-comunidade',
  },
  {
    id: 'feat-3',
    category: 'CIDADE',
    title: 'Trabalho e acompanhamento de demandas',
    image: media.trabalho,
    link: '/conteudos/placeholder-cidade',
  },
]

export const instagramCta = siteConfig.instagramUrl
