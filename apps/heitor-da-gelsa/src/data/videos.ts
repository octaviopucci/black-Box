import type { VideoItem } from './site'
import { media } from './site'

export const videos: VideoItem[] = [
  {
    id: 'video-1',
    title: 'Registro sobre saúde da população',
    date: '[DATA]',
    category: 'SAÚDE',
    thumbnail: media.saude,
    url: 'https://www.instagram.com/p/Dcj9pQPtFvJ/',
    platform: 'instagram',
  },
  {
    id: 'video-2',
    title: 'Presença nas ruas de Capão Bonito',
    date: '[DATA]',
    category: 'CIDADE',
    thumbnail: media.presenca,
    url: 'https://www.instagram.com/p/Dcl-Z9etEMT/',
    platform: 'instagram',
  },
  {
    id: 'video-3',
    title: 'Proximidade com a comunidade',
    date: '[DATA]',
    category: 'COMUNIDADE',
    thumbnail: media.comunidade,
    url: 'https://www.instagram.com/p/DcJ7Vv8t2_L/',
    platform: 'instagram',
  },
]
