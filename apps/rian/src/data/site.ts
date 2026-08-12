const AFID = 'hZc5iRhT'

export const affiliate = {
  slug: 'rian',
  name: 'Rian',
  afid: AFID,
  label: 'Indicação · Rian',
} as const

export const brand = {
  name: 'BASE',
  product: 'Protocolo PAV',
  tagline: 'Sem base, você não sustenta.',
  disclaimer:
    'O BASE e seus sistemas (incluindo o PAV) são ferramentas de apoio comportamental e não substituem orientação médica, psicológica ou profissional.',
  logo: `${import.meta.env.BASE_URL}brand/logo.png`,
  icon: `${import.meta.env.BASE_URL}brand/icone.png`,
  loginExternal: 'https://usebase.vercel.app/login',
  appUrl: 'https://usebase.vercel.app/',
} as const

export const plans = [
  {
    id: 'mensal',
    name: 'Mensal',
    subtitle: 'Flexível',
    price: 'R$ 17,70',
    cadence: '/mês',
    highlight: false,
    badge: 'Flexível',
    checkout: `https://pay.kiwify.com.br/ss3fR01?afid=${AFID}`,
    perks: [
      'Protocolo de crise personalizado',
      'Rotina diária adaptativa',
      'Análise do seu padrão comportamental',
      'Jogos cognitivos anti-impulso',
      'Progresso semanal rastreado',
      'Suporte 24h',
    ],
  },
  {
    id: 'trimestral',
    name: 'Trimestral',
    subtitle: 'Mais escolhido',
    price: 'R$ 37,70',
    cadence: '/3 meses',
    highlight: true,
    badge: 'Mais escolhido',
    checkout: `https://pay.kiwify.com.br/F6PxeHX?afid=${AFID}`,
    perks: [
      'Protocolo de crise personalizado',
      'Rotina diária adaptativa',
      'Análise do seu padrão comportamental',
      'Jogos cognitivos anti-impulso',
      'Progresso semanal rastreado',
      'Suporte 24h',
    ],
  },
  {
    id: 'anual',
    name: 'Anual',
    subtitle: 'Melhor valor',
    price: 'R$ 97,70',
    cadence: '/ano',
    highlight: false,
    badge: 'Melhor valor',
    checkout: `https://pay.kiwify.com.br/8IUShvx?afid=${AFID}`,
    perks: [
      'Protocolo de crise personalizado',
      'Rotina diária adaptativa',
      'Análise do seu padrão comportamental',
      'Jogos cognitivos anti-impulso',
      'Progresso semanal rastreado',
      'Suporte 24h',
    ],
  },
] as const
