import type { Project } from './site'
import { media } from './site'

export const projects: Project[] = [
  {
    slug: 'placeholder-saude-populacao',
    category: 'SAÚDE',
    title: '[TÍTULO DO PROJETO — PLACEHOLDER]',
    date: '[DATA]',
    location: 'Capão Bonito — SP',
    summary: 'Iniciativa relacionada à saúde da população — aguardando dados do cliente.',
    description:
      'Este é um placeholder para projetos e ações acompanhadas. Substitua por informações reais fornecidas pelo cliente: contexto, etapas, parceiros e registros.',
    status: 'EM ACOMPANHAMENTO',
    image: media.saude,
    gallery: [media.saude, media.trabalho],
    videos: [],
    updates: [{ date: '[DATA]', text: '[INSERIR ATUALIZAÇÃO DO PROJETO]' }],
    relatedLinks: [{ label: 'Instagram', url: 'https://www.instagram.com/heitordagelsa/' }],
    isPlaceholder: true,
  },
  {
    slug: 'placeholder-presenca-comunitaria',
    category: 'COMUNIDADE',
    title: '[TÍTULO DO PROJETO — PLACEHOLDER]',
    date: '[DATA]',
    location: 'Capão Bonito — SP',
    summary: 'Ações de proximidade com a comunidade — aguardando dados do cliente.',
    description:
      'Placeholder para registro de visitas e escuta com moradores. Inserir descrição completa quando disponível.',
    status: 'EM ANDAMENTO',
    image: media.comunidade,
    gallery: [media.comunidade, media.presenca],
    videos: [],
    updates: [],
    relatedLinks: [],
    isPlaceholder: true,
  },
  {
    slug: 'placeholder-acompanhamento-demandas',
    category: 'FISCALIZAÇÃO',
    title: '[TÍTULO DO PROJETO — PLACEHOLDER]',
    date: '[DATA]',
    location: 'Capão Bonito — SP',
    summary: 'Acompanhamento de demandas urbanas — aguardando dados do cliente.',
    description:
      'Placeholder para demandas acompanhadas sobre infraestrutura e uso do espaço público.',
    status: 'EM ACOMPANHAMENTO',
    image: media.documentos,
    gallery: [media.documentos, media.trabalho],
    videos: [],
    updates: [],
    relatedLinks: [],
    isPlaceholder: true,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
