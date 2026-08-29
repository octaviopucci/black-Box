import type { VideoItem } from './site'

export const videos: VideoItem[] = [
  {
    id: 'video-1',
    title: 'Registro sobre saúde da população',
    date: '[DATA]',
    category: 'SAÚDE',
    thumbnail: '/instagram/post-2.jpg',
    url: 'https://www.instagram.com/p/Dcj9pQPtFvJ/',
    platform: 'instagram',
  },
  {
    id: 'video-2',
    title: '[TÍTULO DO VÍDEO — PLACEHOLDER]',
    date: '[DATA]',
    category: 'CIDADE',
    thumbnail: '/instagram/post-3.jpg',
    url: 'https://www.instagram.com/p/Dchf1EENelz/',
    platform: 'instagram',
    isPlaceholder: true,
  },
  {
    id: 'video-3',
    title: '[TÍTULO DO VÍDEO — PLACEHOLDER]',
    date: '[DATA]',
    category: 'COMUNIDADE',
    thumbnail: '/instagram/post-6.jpg',
    url: '[INSERIR URL DO YOUTUBE]',
    platform: 'youtube',
    isPlaceholder: true,
  },
]
