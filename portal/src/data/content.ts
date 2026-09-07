export type Solution = {
  number: string
  title: string
  description: string
  examples: string[]
}

export const solutions: Solution[] = [
  {
    number: '01',
    title: 'ENGENHARIA DE IA',
    description:
      'Agentes, copilotos e sistemas inteligentes preparados para executar tarefas reais e melhorar operações.',
    examples: [
      'Agentes de IA',
      'Assistentes inteligentes',
      'RAG',
      'Sistemas de decisão',
      'IA integrada aos processos da empresa',
    ],
  },
  {
    number: '02',
    title: 'SISTEMAS WEB',
    description:
      'Aplicações web, dashboards, plataformas e ferramentas internas construídas sob medida.',
    examples: ['Web Apps', 'SaaS', 'Dashboards', 'Sistemas internos', 'Portais'],
  },
  {
    number: '03',
    title: 'AUTOMAÇÕES',
    description:
      'Conectamos ferramentas, dados e processos para reduzir trabalho manual e acelerar operações.',
    examples: [
      'Automação de CRM',
      'WhatsApp',
      'E-mail',
      'APIs',
      'Webhooks',
      'Workflows inteligentes',
    ],
  },
  {
    number: '04',
    title: 'CONVERSÃO',
    description: 'Experiências digitais projetadas para transformar visitantes em oportunidades.',
    examples: [
      'Landing Pages',
      'Sites',
      'Funis',
      'Experiências interativas',
      'Otimização de conversão',
    ],
  },
  {
    number: '05',
    title: 'RECUPERAÇÃO DE CLIENTES',
    description:
      'Sistemas que encontram oportunidades escondidas na sua própria base de clientes.',
    examples: [
      'Reativação de clientes',
      'Recuperação de leads',
      'Follow-ups automáticos',
      'Segmentação',
      'Campanhas inteligentes',
    ],
  },
  {
    number: '06',
    title: 'INTEGRAÇÕES',
    description:
      'Conectamos sistemas diferentes para que sua operação funcione como uma única estrutura.',
    examples: ['APIs', 'Bancos de dados', 'CRM', 'WhatsApp', 'Sistemas externos', 'Automações'],
  },
]

export const specialties = [
  'ENGENHARIA DE IA',
  'AUTOMAÇÕES',
  'WEB APPS',
  'LANDING PAGES',
  'INTEGRAÇÕES',
  'SISTEMAS DIGITAIS',
  'SOFTWARE SOB MEDIDA',
] as const

export const processSteps = [
  {
    number: '01',
    title: 'ENTENDER',
    description: 'Entendemos o problema, o contexto e o objetivo.',
  },
  {
    number: '02',
    title: 'ARQUITETAR',
    description: 'Desenhamos a experiência, a lógica e a arquitetura da solução.',
  },
  {
    number: '03',
    title: 'CONSTRUIR',
    description: 'Desenvolvemos o sistema e conectamos todos os componentes.',
  },
  {
    number: '04',
    title: 'COLOCAR NO AR',
    description: 'Colocamos a solução em produção.',
  },
  {
    number: '05',
    title: 'EVOLUIR',
    description: 'Medimos, aprendemos e melhoramos continuamente.',
  },
] as const

export const principles = [
  {
    number: '01',
    title: 'CONSTRUÍMOS COM PROPÓSITO',
    description: 'Cada interface, fluxo e automação existe para cumprir uma função.',
  },
  {
    number: '02',
    title: 'IA COMO INFRAESTRUTURA',
    description:
      'Não usamos inteligência artificial como enfeite. Usamos para resolver problemas.',
  },
  {
    number: '03',
    title: 'SISTEMAS, NÃO FUNCIONALIDADES ISOLADAS',
    description: 'Pensamos na operação inteira, não apenas em uma tela.',
  },
  {
    number: '04',
    title: 'DESIGN + ENGENHARIA',
    description: 'Uma solução precisa funcionar muito bem e parecer excelente.',
  },
] as const

export type LabItem = {
  title: string
  status: 'EXPERIMENTAL' | 'PROTÓTIPO' | 'EM TESTES' | 'P&D'
}

export const labItems: LabItem[] = [
  { title: 'AGENTE DE VENDAS COM IA', status: 'EXPERIMENTAL' },
  { title: 'ATENDIMENTO AUTÔNOMO', status: 'PROTÓTIPO' },
  { title: 'GERADOR INTELIGENTE DE PROPOSTAS', status: 'EM TESTES' },
  { title: 'SISTEMA OPERACIONAL PARA EMPRESAS', status: 'P&D' },
  { title: 'AGENTE DE RECUPERAÇÃO DE CLIENTES', status: 'EXPERIMENTAL' },
]
