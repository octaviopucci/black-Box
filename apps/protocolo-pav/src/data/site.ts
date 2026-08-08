export const brand = {
  name: 'BASE',
  product: 'Protocolo PAV',
  tagline: 'Sem base, você não sustenta.',
  system: 'Sistema de reconstrução pessoal',
  disclaimer:
    'O BASE e seus sistemas (incluindo o PAV) são ferramentas de apoio comportamental e não substituem orientação médica, psicológica ou profissional.',
  logo: `${import.meta.env.BASE_URL}brand/logo.png`,
  icon: `${import.meta.env.BASE_URL}brand/icone.png`,
  kiwify: 'https://pay.kiwify.com.br/',
  cadastroExternal: 'https://usebase.vercel.app/cadastro',
  loginExternal: 'https://usebase.vercel.app/login',
} as const

export const levels = [
  { id: 1, name: 'Iniciante', xp: 0 },
  { id: 2, name: 'Resistente', xp: 120 },
  { id: 3, name: 'Disciplinado', xp: 320 },
  { id: 4, name: 'Fundação', xp: 640 },
  { id: 5, name: 'Inabalável', xp: 1100 },
] as const

export type GameId = 'luta' | 'runner' | 'reflex' | 'snake' | 'blocks' | 'velha'

export const games: {
  id: GameId
  name: string
  blurb: string
  duration: string
  accent: string
  featured?: boolean
}[] = [
  {
    id: 'luta',
    name: 'A Luta',
    blurb:
      'O desafio central. Só vontade perde para o vício. Com BASE (rotina, propósito, protocolo), a onda fica atravessável.',
    duration: '3 atos',
    accent: '#E10600',
    featured: true,
  },
  {
    id: 'runner',
    name: 'Runner',
    blurb: 'Desvie do impulso. Cada obstáculo é uma recaída evitada.',
    duration: '60s',
    accent: '#E10600',
  },
  {
    id: 'reflex',
    name: 'Reflexo',
    blurb: 'Dispara dopamina saudável no pico da onda.',
    duration: '20s',
    accent: '#FF2A1F',
  },
  {
    id: 'snake',
    name: 'Cobra',
    blurb: 'Ritmo repetitivo que acalma o impulso.',
    duration: '45s',
    accent: '#2EE59D',
  },
  {
    id: 'blocks',
    name: 'Blocos',
    blurb: 'Foco visual. A mente sai do gatilho.',
    duration: '60s',
    accent: '#7C8CFF',
  },
  {
    id: 'velha',
    name: 'Velha',
    blurb: 'Partida rápida enquanto a onda passa.',
    duration: 'rápido',
    accent: '#F5C542',
  },
]

export const vices = [
  'Cigarro',
  'Álcool',
  'Drogas',
  'Apostas',
  'Pornografia',
  'Compulsão alimentar',
  'Açúcar',
  'Procrastinação',
  'Redes sociais',
  'Compras compulsivas',
] as const

export const features = [
  {
    code: '01',
    title: 'Botão de Fissura',
    body: 'Clicou. Aí vem respiração, propósito, mini-jogo, mensagem do você do passado e contagem regressiva.',
  },
  {
    code: '02',
    title: 'Mapa de Evolução',
    body: 'A jornada vira um caminho visual. De onde você saiu, onde está e o próximo marco.',
  },
  {
    code: '03',
    title: 'Sistema de Níveis',
    body: 'Iniciante. Resistente. Disciplinado. Fundação. Inabalável. Você sobe com dias limpos e ondas vencidas.',
  },
  {
    code: '04',
    title: 'Propósito Central',
    body: 'O sistema te força a definir o porquê e te lembra disso todo dia.',
  },
  {
    code: '05',
    title: 'Benefícios em tempo real',
    body: 'Marcos de abstinência específicos para cada padrão que você combate.',
  },
  {
    code: '06',
    title: 'Mini-jogos de abstinência',
    body: 'Quando o cérebro grita por dopamina, você joga. Desafios curtos nos minutos críticos.',
  },
  {
    code: '07',
    title: 'Metas pessoais',
    body: 'Você define seus marcos. O sistema cobra.',
  },
  {
    code: '08',
    title: 'Comunidade silenciosa',
    body: 'Quantas pessoas estão de pé agora, em tempo real. Sem julgamento.',
  },
] as const

export const plans = [
  {
    id: 'tijolo',
    name: 'Tijolo',
    price: 'R$ 37',
    cadence: 'pagamento único',
    highlight: false,
    perks: ['1 vício monitorado', 'Mapa de evolução', 'Mini-jogos da Arena'],
  },
  {
    id: 'fundacao',
    name: 'Fundação',
    price: 'R$ 17',
    cadence: '/mês',
    highlight: true,
    perks: [
      'Vícios ilimitados',
      'Analytics avançado',
      'Acesso à comunidade',
      'Suporte prioritário',
    ],
  },
  {
    id: 'inabalavel',
    name: 'Inabalável',
    price: 'R$ 497',
    cadence: 'oferta completa',
    highlight: false,
    perks: [
      'Estrutura máxima do protocolo',
      'Sessão de onboarding 1:1',
      'Todos os benefícios Fundação',
    ],
  },
] as const

export const faqs = [
  {
    q: 'Se eu recair, perco o progresso?',
    a: 'Não. Recaída faz parte. O BASE registra, te ajuda a entender o gatilho e te recoloca em pé. Você não perde nível por cair. Você perde nível por desistir.',
  },
  {
    q: 'Funciona pra mais de um vício ao mesmo tempo?',
    a: 'Sim. No plano Fundação você monitora vícios ilimitados com o mesmo protocolo.',
  },
  {
    q: 'Preciso compartilhar com alguém?',
    a: 'Não. Tudo acontece no app, no seu ritmo. A comunidade é opcional e anônima.',
  },
  {
    q: 'Substitui terapia ou tratamento médico?',
    a: 'Não. O BASE é ferramenta de apoio à rotina e ao autocontrole. Não substitui profissional de saúde.',
  },
  {
    q: 'Como funcionam os mini-jogos?',
    a: 'São desafios curtos e jogáveis de verdade para ocupar a mente nos minutos críticos da fissura, sem te expor a gatilhos externos.',
  },
  {
    q: 'Tem garantia?',
    a: '30 dias de garantia incondicional. Se em 30 dias o BASE não fizer diferença, devolução total. Sem perguntas.',
  },
] as const

export const testimonials = [
  {
    name: 'Marcos R.',
    meta: '34 · São Paulo · Cigarro',
    days: 287,
    quote:
      'Tentei parar 14 vezes em 12 anos. O botão de fissura salvou minha pele nos primeiros 30 dias. Hoje eu nem lembro que fumava.',
  },
  {
    name: 'Júlia C.',
    meta: '28 · Belo Horizonte · Açúcar',
    days: 142,
    quote:
      'O mapa de evolução virou meu vício novo. Saudável. Acordar e ver que mais um dia foi conquistado vicia mais que doce.',
  },
  {
    name: 'Rafael M.',
    meta: '41 · Porto Alegre · Apostas',
    days: 423,
    quote:
      'Perdi R$ 80 mil em três anos. O BASE me deu o que terapia sozinha não deu: estrutura diária. Hoje eu construo. Não destruo.',
  },
] as const
