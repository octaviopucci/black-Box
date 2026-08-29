import type { GalleryItem } from './site'

export const galleryItems: GalleryItem[] = [
  { id: 'g1', src: '/instagram/post-1.jpg', alt: 'Registro de atuação pública — Heitor da Gelsa', category: 'Cidade' },
  { id: 'g2', src: '/instagram/post-2.jpg', alt: 'Registro sobre saúde da população', category: 'Reuniões' },
  { id: 'g3', src: '/instagram/post-3.jpg', alt: 'Registro de demanda urbana em Capão Bonito', category: 'Cidade' },
  { id: 'g4', src: '/instagram/post-4.jpg', alt: 'Registro de atuação pública', category: 'Eventos' },
  { id: 'g5', src: '/instagram/post-5.jpg', alt: 'Registro de parceria institucional', category: 'Reuniões' },
  { id: 'g6', src: '/instagram/post-6.jpg', alt: 'Presença nas ruas de Capão Bonito', category: 'Comunidade' },
  { id: 'g7', src: '/instagram/post-7.jpg', alt: 'Registro de visita comunitária', category: 'Visitas' },
  { id: 'g8', src: '/instagram/post-8.jpg', alt: 'Registro de atuação pública', category: 'Comunidade' },
  { id: 'g9', src: '/instagram/user-ref-1.jpg', alt: 'Heitor da Gelsa em Capão Bonito', category: 'Cidade' },
  { id: 'g10', src: '/instagram/user-ref-2.jpg', alt: 'Retrato de Heitor da Gelsa', category: 'Eventos' },
]

export const galleryFilters = ['Todos', 'Cidade', 'Comunidade', 'Reuniões', 'Visitas', 'Eventos'] as const
