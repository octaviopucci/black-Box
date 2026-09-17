export const brand = {
  name: 'Trilha ENEM',
  product: 'App de estudos ENEM',
  tagline: 'Questão corrigida. Redação com feedback. Nota que sobe.',
  disclaimer:
    'Trilha ENEM é ferramenta de estudo e preparação. Resultados dependem de dedicação e uso consistente da plataforma.',
  ctaWhatsApp: 'https://wa.me/5511999999999?text=Quero%20testar%20a%20Trilha%20ENEM',
  signupUrl: '#assinar',
} as const

export const plans = [
  {
    id: 'mensal',
    name: 'Mensal',
    subtitle: 'Flexível',
    price: 'R$ 29,90',
    cadence: '/mês',
    highlight: false,
    badge: 'Flexível',
    checkout: '#checkout-mensal',
    perks: [
      'Correção de questões com explicação passo a passo',
      '2 redações corrigidas por mês com feedback',
      'Simulados ENEM com gabarito comentado',
      'Plano de estudo semanal',
      'Histórico de evolução por matéria',
    ],
  },
  {
    id: 'trimestral',
    name: 'Trimestral',
    subtitle: 'Mais escolhido',
    price: 'R$ 69,90',
    cadence: '/3 meses',
    highlight: true,
    badge: 'Mais escolhido',
    checkout: '#checkout-trimestral',
    perks: [
      'Tudo do mensal',
      '8 redações corrigidas (com competências ENEM)',
      'Simulados ilimitados',
      'Revisão espaçada automática',
      'Suporte por chat em horário de estudo',
    ],
  },
  {
    id: 'anual',
    name: 'Anual',
    subtitle: 'Melhor valor',
    price: 'R$ 149,90',
    cadence: '/ano',
    highlight: false,
    badge: 'Melhor valor',
    checkout: '#checkout-anual',
    perks: [
      'Tudo do trimestral',
      'Redações ilimitadas com correção em 48h',
      'Trilha personalizada até a prova',
      'Relatório mensal pra pais ou responsável',
      'Acesso antecipado a novos simulados',
    ],
  },
] as const
