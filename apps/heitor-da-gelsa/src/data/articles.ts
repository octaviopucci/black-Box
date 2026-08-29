import type { Article } from './site'

export const articles: Article[] = [
  {
    slug: 'saude-populacao-registros',
    category: 'SAÚDE',
    title: 'Registros sobre saúde da população',
    date: '[DATA]',
    summary:
      'Heitor da Gelsa e Daan Cabeleireiro se unem em favor do Dep Federal que mais ajudou a saúde de Capão Bonito e as entidades sociais.',
    readTime: '3 min',
    image: '/instagram/post-2.jpg',
    body: [
      'Heitor da Gelsa e Daan Cabeleireiro se unem em favor do Dep Federal que mais ajudou a saúde de Capão Bonito e as entidades sociais.',
      'Conteúdo extraído de publicação oficial no Instagram @heitordagelsa. [INSERIR TEXTO COMPLETO QUANDO DISPONÍVEL]',
    ],
    source: 'Instagram @heitordagelsa',
  },
  {
    slug: 'placeholder-cidade',
    category: 'CIDADE',
    title: '[TÍTULO DO CONTEÚDO — PLACEHOLDER]',
    date: '[DATA]',
    summary: 'Resumo do conteúdo sobre a cidade — aguardando dados do cliente.',
    readTime: '4 min',
    image: '/instagram/post-3.jpg',
    body: [
      'Este é um placeholder para conteúdos editoriais sobre Capão Bonito.',
      'Substitua por texto real fornecido pelo cliente.',
    ],
    isPlaceholder: true,
  },
  {
    slug: 'placeholder-infraestrutura',
    category: 'INFRAESTRUTURA',
    title: '[TÍTULO DO CONTEÚDO — PLACEHOLDER]',
    date: '[DATA]',
    summary: 'Conteúdo sobre infraestrutura — aguardando dados do cliente.',
    readTime: '5 min',
    image: '/instagram/post-1.jpg',
    body: ['Placeholder para artigo sobre infraestrutura.'],
    isPlaceholder: true,
  },
  {
    slug: 'placeholder-comunidade',
    category: 'COMUNIDADE',
    title: '[TÍTULO DO CONTEÚDO — PLACEHOLDER]',
    date: '[DATA]',
    summary: 'Conteúdo sobre comunidade — aguardando dados do cliente.',
    readTime: '3 min',
    image: '/instagram/post-6.jpg',
    body: ['Placeholder para artigo sobre comunidade.'],
    isPlaceholder: true,
  },
  {
    slug: 'placeholder-fiscalizacao',
    category: 'FISCALIZAÇÃO',
    title: '[TÍTULO DO CONTEÚDO — PLACEHOLDER]',
    date: '[DATA]',
    summary: 'Conteúdo sobre fiscalização — aguardando dados do cliente.',
    readTime: '4 min',
    image: '/instagram/post-7.jpg',
    body: ['Placeholder para artigo sobre fiscalização.'],
    isPlaceholder: true,
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}
