import type { GalleryItem } from './site'
import { media } from './site'

export const galleryItems: GalleryItem[] = [
  { id: 'g1', src: media.hero, alt: 'Heitor da Gelsa — retrato', category: 'Eventos' },
  { id: 'g2', src: media.about, alt: 'Heitor da Gelsa em Capão Bonito', category: 'Cidade' },
  { id: 'g3', src: media.presenca, alt: 'Presença nas ruas de Capão Bonito', category: 'Cidade' },
  { id: 'g4', src: media.saude, alt: 'Registro sobre saúde da população', category: 'Reuniões' },
  { id: 'g5', src: media.trabalho, alt: 'Reunião de trabalho com documentos', category: 'Reuniões' },
  { id: 'g6', src: media.documentos, alt: 'Acompanhamento de demandas', category: 'Visitas' },
  { id: 'g7', src: media.comunidade, alt: 'Proximidade com a comunidade', category: 'Comunidade' },
  { id: 'g8', src: media.parceria, alt: 'Parceria e diálogo institucional', category: 'Eventos' },
]

export const galleryFilters = ['Todos', 'Cidade', 'Comunidade', 'Reuniões', 'Visitas', 'Eventos'] as const
