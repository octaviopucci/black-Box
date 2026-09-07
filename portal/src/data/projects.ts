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
    title: 'Motor comercial inteligente',
    category: 'Vendas + automação',
    year: '2026',
    summary:
      'Organiza leads, qualifica automaticamente e entrega para o vendedor só quem tem chance real de fechar.',
    technologies: ['IA', 'CRM', 'Automação'],
    problem:
      'Leads chegavam desorganizados. A equipe perdia tempo com contato frio e deixava oportunidade boa passar.',
    solution:
      'Criamos um sistema que analisa cada lead, prioriza os melhores e encaminha automaticamente para o comercial certo.',
    flow: [
      'Lead entra',
      'Análise automática',
      'Qualificação',
      'Registro no CRM',
      'Alerta para o vendedor',
      'Contato no timing certo',
    ],
    impact: [
      'Comercial focado em quem realmente pode comprar',
      'Resposta mais rápida aos leads quentes',
      'Menos trabalho manual na triagem',
      'Funil visível para tomada de decisão',
    ],
  },
  {
    id: 'recuperacao',
    number: '02',
    title: 'Clientes que voltam',
    category: 'Recuperação de base',
    year: '2026',
    summary:
      'Encontra quem parou de responder e reativa o contato com mensagem personalizada — no automático.',
    technologies: ['IA', 'WhatsApp', 'CRM'],
    problem:
      'Centenas de leads e clientes parados na base. A equipe não tinha tempo de reativar um por um.',
    solution:
      'Sistema que segmenta a base, detecta quem vale reativar e dispara follow-up inteligente pelo WhatsApp.',
    flow: [
      'Base de clientes',
      'Quem parou de responder',
      'Mensagem personalizada',
      'WhatsApp automático',
      'Retorno pro comercial',
      'Venda recuperada',
    ],
    impact: [
      'Oportunidades escondidas voltam pro funil',
      'Menos dependência só de tráfego novo',
      'Follow-up consistente sem sobrecarregar a equipe',
      'Receita da base existente reativada',
    ],
  },
  {
    id: 'painel-operacional',
    number: '03',
    title: 'Tudo em um painel',
    category: 'Gestão',
    year: '2026',
    summary:
      'Indicadores, status e informações importantes da operação — num lugar só, atualizado em tempo real.',
    technologies: ['Web App', 'Dashboard', 'Integrações'],
    problem:
      'Informação espalhada em planilhas e sistemas. Ninguém tinha visão clara do que estava acontecendo.',
    solution:
      'Painel sob medida que concentra os números e processos que importam para decidir mais rápido.',
    flow: [
      'Dados das ferramentas',
      'Organização automática',
      'Painel visual',
      'Alertas importantes',
      'Decisão rápida',
    ],
    impact: [
      'Visão clara da operação',
      'Menos planilha manual',
      'Decisões baseadas em dado atualizado',
      'Equipe alinhada no mesmo lugar',
    ],
  },
  {
    id: 'maquina-de-conversao',
    number: '04',
    title: 'Página que vende',
    category: 'Conversão',
    year: '2026',
    summary:
      'Experiência digital clara e objetiva — visitante entende a oferta e vira contato comercial.',
    technologies: ['UX', 'Conversão', 'Analytics'],
    problem:
      'Tráfego existia, mas a página não convertia. Visitantes saíam sem entender ou sem entrar em contato.',
    solution:
      'Página construída para explicar a oferta com clareza e capturar leads qualificados.',
    flow: [
      'Visitante chega',
      'Entende a oferta',
      'Demonstra interesse',
      'Deixa contato',
      'Comercial recebe lead',
      'Oportunidade criada',
    ],
    impact: [
      'Mais contatos por visita',
      'Mensagem alinhada à oferta real',
      'Leads mais qualificados',
      'Base para otimizar continuamente',
    ],
  },
]
