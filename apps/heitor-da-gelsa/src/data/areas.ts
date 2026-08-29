import type { AreaOfActuation } from './site'

export const areasOfActuation: AreaOfActuation[] = [
  {
    id: 'saude',
    title: 'SAÚDE',
    slug: 'saude',
    icon: 'heart-pulse',
    description:
      'Acompanhamento de registros sobre saúde da população e entidades sociais em Capão Bonito.',
  },
  {
    id: 'cidade',
    title: 'CIDADE',
    slug: 'cidade',
    icon: 'map-pin',
    description:
      'Presença nas ruas, escuta de moradores e canal aberto de feedback via WhatsApp (15) 99859-1411.',
  },
  {
    id: 'comunidade',
    title: 'COMUNIDADE',
    slug: 'comunidade',
    icon: 'users',
    description:
      'Proximidade com bairros e moradores — visitas, diálogo e registros de demandas locais.',
  },
  {
    id: 'transparencia',
    title: 'TRANSPARÊNCIA',
    slug: 'transparencia',
    icon: 'eye',
    description:
      'Compartilhamento de registros, posicionamentos e informações públicas nas redes e neste site.',
  },
]
