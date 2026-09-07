export type ProjectCase = {
  id: string
  number: string
  title: string
  category: string
  year: string
  summary: string
  technologies: string[]
  problem: string
  solution: string
  flow: string[]
  impact: string[]
}

export const projects: ProjectCase[] = [
  {
    id: 'engenharia-de-vendas',
    number: '01',
    title: 'ENGENHARIA DE VENDAS',
    category: 'IA + AUTOMAÇÃO',
    year: '2026',
    summary:
      'Um sistema inteligente para analisar, qualificar e encaminhar leads automaticamente para o processo comercial.',
    technologies: ['IA', 'CRM', 'AUTOMAÇÃO', 'API'],
    problem:
      'Leads chegavam sem critério, a equipe perdia tempo com contatos frios e oportunidades boas demoravam para ser atendidas.',
    solution:
      'Construímos um sistema que analisa cada lead com IA, qualifica por comportamento e intenção, e encaminha automaticamente para o fluxo comercial certo.',
    flow: ['LEAD', 'ANÁLISE POR IA', 'QUALIFICAÇÃO', 'CRM', 'AUTOMAÇÃO', 'EQUIPE COMERCIAL'],
    impact: [
      'Redução de tempo entre captura e primeiro contato',
      'Priorização automática de leads com maior potencial',
      'Menos trabalho manual na triagem comercial',
      'Visibilidade clara do funil em tempo real',
    ],
  },
  {
    id: 'recuperacao',
    number: '02',
    title: 'RECUPERAÇÃO',
    category: 'RECUPERAÇÃO DE CLIENTES',
    year: '2026',
    summary:
      'Sistema de reativação automática para encontrar clientes e leads que deixaram de interagir com a empresa.',
    technologies: ['IA', 'CRM', 'WHATSAPP', 'AUTOMAÇÃO'],
    problem:
      'A base de clientes e leads inativos crescia sem estratégia. Oportunidades existentes ficavam esquecidas enquanto a empresa só investia em aquisição.',
    solution:
      'Criamos um sistema de recuperação que segmenta a base, detecta sinais de reativação e dispara follow-ups inteligentes por WhatsApp e outros canais.',
    flow: [
      'BASE DE CLIENTES',
      'SEGMENTAÇÃO',
      'ANÁLISE DE COMPORTAMENTO',
      'PERSONALIZAÇÃO COM IA',
      'WHATSAPP AUTOMÁTICO',
      'REGISTRO NO CRM',
    ],
    impact: [
      'Reativação de leads e clientes parados',
      'Campanhas personalizadas em escala',
      'Aproveitamento da base existente',
      'Follow-ups consistentes sem sobrecarregar a equipe',
    ],
  },
  {
    id: 'painel-operacional',
    number: '03',
    title: 'PAINEL OPERACIONAL',
    category: 'WEB APP',
    year: '2026',
    summary:
      'Dashboard para centralizar indicadores, dados e processos importantes da operação.',
    technologies: ['WEB APP', 'BANCO DE DADOS', 'DASHBOARD', 'API'],
    problem:
      'Informações críticas estavam espalhadas em planilhas, sistemas e conversas. Decisões demoravam porque ninguém via a operação inteira.',
    solution:
      'Desenvolvemos um painel operacional sob medida que concentra indicadores, status de processos e dados em uma interface clara e acionável.',
    flow: ['FONTES DE DADOS', 'APIs', 'PROCESSAMENTO', 'DASHBOARD', 'ALERTAS', 'DECISÃO'],
    impact: [
      'Visão unificada da operação',
      'Decisões mais rápidas com dados atualizados',
      'Menos dependência de planilhas manuais',
      'Monitoramento contínuo de indicadores-chave',
    ],
  },
  {
    id: 'maquina-de-conversao',
    number: '04',
    title: 'MÁQUINA DE CONVERSÃO',
    category: 'LANDING PAGE + CONVERSÃO',
    year: '2026',
    summary:
      'Experiência digital criada para transformar tráfego em leads e oportunidades comerciais.',
    technologies: ['UX', 'CONVERSÃO', 'ANALYTICS', 'WEB'],
    problem:
      'O tráfego existia, mas a experiência digital não convertia. Visitantes saíam sem entender a oferta nem avançar no funil.',
    solution:
      'Projetamos uma experiência de conversão com narrativa clara, hierarquia forte e captura inteligente — do clique ao lead qualificado.',
    flow: ['TRÁFEGO', 'EXPERIÊNCIA', 'INTERESSE', 'CAPTURA', 'QUALIFICAÇÃO', 'OPORTUNIDADE'],
    impact: [
      'Aumento da taxa de conversão',
      'Mensagem alinhada à oferta real',
      'Leads mais qualificados para o comercial',
      'Base analítica para otimização contínua',
    ],
  },
]
