import type { MapMarker } from './site'
import { media } from './site'

export const mapMarkers: MapMarker[] = [
  {
    id: 'centro',
    name: 'Centro',
    category: 'BAIRRO',
    description: 'Região central de Capão Bonito — [INSERIR DESCRIÇÃO DE ATUAÇÃO]',
    date: '[DATA]',
    image: media.presenca,
    x: 52,
    y: 48,
    isPlaceholder: true,
  },
  {
    id: 'vila-nova',
    name: 'Vila Nova',
    category: 'BAIRRO',
    description: 'Acompanhamento de demandas locais — [INSERIR DESCRIÇÃO]',
    date: '[DATA]',
    image: media.comunidade,
    x: 38,
    y: 62,
    isPlaceholder: true,
  },
  {
    id: 'saude',
    name: 'Ação em saúde',
    category: 'PROJETO',
    description: 'Registro relacionado à saúde da população.',
    date: '[DATA]',
    image: media.saude,
    link: '/projetos/placeholder-saude-populacao',
    x: 65,
    y: 35,
  },
  {
    id: 'comunidade',
    name: 'Presença comunitária',
    category: 'VISITA',
    description: 'Registro de proximidade com moradores — [INSERIR DESCRIÇÃO]',
    date: '[DATA]',
    image: media.comunidade,
    x: 28,
    y: 42,
    isPlaceholder: true,
  },
]
