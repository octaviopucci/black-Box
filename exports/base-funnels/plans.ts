/** Planos BASE principais (sem afid). Preços atuais — não usar Tijolo/Fundação/Inabalável. */
export const basePlans = [
  {
    id: 'mensal',
    name: 'Mensal',
    subtitle: 'Flexível',
    price: 'R$ 17,70',
    cadence: '/mês',
    highlight: false,
    badge: 'Flexível',
    checkout: 'https://pay.kiwify.com.br/ss3fR01',
  },
  {
    id: 'trimestral',
    name: 'Trimestral',
    subtitle: 'Mais escolhido',
    price: 'R$ 37,70',
    cadence: '/3 meses',
    highlight: true,
    badge: 'Mais escolhido',
    checkout: 'https://pay.kiwify.com.br/F6PxeHX',
  },
  {
    id: 'anual',
    name: 'Anual',
    subtitle: 'Melhor valor',
    price: 'R$ 97,70',
    cadence: '/ano',
    highlight: false,
    badge: 'Melhor valor',
    checkout: 'https://pay.kiwify.com.br/8IUShvx',
  },
] as const

/** Planos afiliado Rian */
export const rianAfId = 'wSk0NAct'
export const rianPlans = [
  {
    id: 'mensal',
    name: 'Mensal',
    subtitle: 'Flexível',
    price: 'R$ 17,70',
    cadence: '/mês',
    highlight: false,
    badge: 'Flexível',
    checkout: `https://pay.kiwify.com.br/5dDatgC?afid=${rianAfId}`,
  },
  {
    id: 'trimestral',
    name: 'Trimestral',
    subtitle: 'Mais escolhido',
    price: 'R$ 37,70',
    cadence: '/3 meses',
    highlight: true,
    badge: 'Mais escolhido',
    checkout: `https://pay.kiwify.com.br/GCbUGh5?afid=${rianAfId}`,
  },
  {
    id: 'anual',
    name: 'Anual',
    subtitle: 'Melhor valor',
    price: 'R$ 97,70',
    cadence: '/ano',
    highlight: false,
    badge: 'Melhor valor',
    checkout: `https://pay.kiwify.com.br/KljXpUY?afid=${rianAfId}`,
  },
] as const

export const cadastroPath = '/cadastro'
export const planosPath = '/planos'
