import type { Project } from './site'

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
    image: '/instagram/post-2.jpg',
    gallery: ['/instagram/post-2.jpg'],
    videos: [],
    updates: [{ date: '[DATA]', text: '[INSERIR ATUALIZAÇÃO DO PROJETO]' }],
    relatedLinks: [{ label: 'Instagram', url: 'https://www.instagram.com/heitordagelsa/' }],
    isPlaceholder: true,
  },
  {
    slug: 'placeholder-fiscalizacao-urbana',
    category: 'FISCALIZAÇÃO',
    title: '[TÍTULO DO PROJETO — PLACEHOLDER]',
    date: '[DATA]',
    location: 'Capão Bonito — SP',
    summary: 'Demanda de fiscalização urbana — aguardando dados do cliente.',
    description:
      'Placeholder para registro de demandas acompanhadas sobre infraestrutura, poluição visual ou uso do espaço público. Inserir descrição completa quando disponível.',
    status: 'EM ACOMPANHAMENTO',
    image: '/instagram/post-3.jpg',
    gallery: ['/instagram/post-3.jpg'],
    videos: [],
    updates: [],
    relatedLinks: [],
    isPlaceholder: true,
  },
  {
    slug: 'placeholder-comunidade',
    category: 'COMUNIDADE',
    title: '[TÍTULO DO PROJETO — PLACEHOLDER]',
    date: '[DATA]',
    location: 'Capão Bonito — SP',
    summary: 'Ação comunitária — aguardando dados do cliente.',
    description:
      'Placeholder para ações de proximidade com a comunidade. Substituir por registros reais de visitas, reuniões ou iniciativas locais.',
    status: 'EM ANDAMENTO',
    image: '/instagram/post-6.jpg',
    gallery: ['/instagram/post-6.jpg', '/instagram/post-7.jpg'],
    videos: [],
    updates: [],
    relatedLinks: [],
    isPlaceholder: true,
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
