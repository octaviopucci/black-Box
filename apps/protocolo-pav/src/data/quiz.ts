import { brand, plans } from './site'

export type QuizOption = {
  id: string
  label: string
  hint?: string
  tags: string[]
}

export type QuizQuestion = {
  id: string
  title: string
  subtitle?: string
  options: QuizOption[]
}

export type QuizInterstitial = {
  id: string
  kind: 'pitch'
  kicker: string
  title: string
  body: string[]
  bullets?: string[]
  cta: string
}

export type QuizStep =
  | { type: 'intro' }
  | { type: 'question'; question: QuizQuestion }
  | { type: 'interstitial'; interstitial: QuizInterstitial }
  | { type: 'analyzing' }
  | { type: 'result' }
  | { type: 'offer' }

export const quizIntro = {
  kicker: 'Diagnóstico BASE · 3 minutos',
  title: 'Você acha que está no controle.',
  highlight: 'Mas negocia com o impulso todo dia.',
  body: [
    'Não precisa de algema pra te prender. Basta uma fissura, um gatilho e zero fundação.',
    'Este diagnóstico mostra onde sua base está rachada — e qual protocolo do BASE você precisa ativar primeiro.',
  ],
  points: [
    'Sem enrolação motivacional',
    'Resultado personalizado em minutos',
    'PAV é o primeiro protocolo. Os próximos vêm depois.',
  ],
  cta: 'Começar meu diagnóstico',
} as const

export const questions: QuizQuestion[] = [
  {
    id: 'padrao',
    title: 'Qual padrão te derruba com mais força hoje?',
    subtitle: 'Escolha o principal. Depois o BASE se adapta.',
    options: [
      { id: 'cigarro', label: 'Cigarro / nicotina', tags: ['pav', 'fissura'] },
      { id: 'alcool', label: 'Álcool', tags: ['pav', 'fissura'] },
      { id: 'apostas', label: 'Apostas / jogos de azar', tags: ['pav', 'dopamina'] },
      { id: 'porno', label: 'Pornografia / compulsão sexual', tags: ['pav', 'dopamina'] },
      { id: 'telas', label: 'Redes / scroll infinito', tags: ['pav', 'atencao'] },
      { id: 'comida', label: 'Açúcar / compulsão alimentar', tags: ['pav', 'fissura'] },
      { id: 'procrastinar', label: 'Procrastinação crônica', tags: ['pav', 'atencao'] },
      { id: 'compras', label: 'Compras compulsivas', tags: ['pav', 'dopamina'] },
    ],
  },
  {
    id: 'tempo',
    title: 'Há quanto tempo esse ciclo se repete?',
    options: [
      { id: 'meses', label: 'Alguns meses', tags: ['inicio'] },
      { id: '1-3', label: '1 a 3 anos', tags: ['ciclo'] },
      { id: '3-10', label: '3 a 10 anos', tags: ['ciclo', 'identidade'] },
      { id: '10+', label: 'Mais de 10 anos', tags: ['identidade', 'ciclo'] },
    ],
  },
  {
    id: 'tentativas',
    title: 'Quantas vezes você já tentou parar nos últimos 12 meses?',
    options: [
      { id: '1', label: 'Uma vez — e não segurou', tags: ['vontade'] },
      { id: '2-5', label: 'De 2 a 5 vezes', tags: ['vontade', 'ciclo'] },
      { id: '6+', label: 'Perdi a conta', tags: ['ciclo', 'identidade'] },
      { id: 'nunca', label: 'Nunca tentei de verdade', tags: ['inicio'] },
    ],
  },
  {
    id: 'fissura',
    title: 'Nos minutos da fissura, o que acontece com você?',
    options: [
      {
        id: 'negocia',
        label: 'Eu negocio: “só dessa vez”',
        hint: 'Barganha mental',
        tags: ['fissura', 'vontade'],
      },
      {
        id: 'explode',
        label: 'A onda sobe e eu caio rápido',
        hint: 'Sem protocolo no pico',
        tags: ['fissura'],
      },
      {
        id: 'esconde',
        label: 'Eu escondo e prometo recomeçar amanhã',
        hint: 'Vergonha no volante',
        tags: ['identidade'],
      },
      {
        id: 'resiste',
        label: 'Às vezes resisto — mas sem sistema',
        hint: 'Roleta da vontade',
        tags: ['vontade'],
      },
    ],
  },
  {
    id: 'bloqueio',
    title: 'O que mais te impede de sustentar a mudança?',
    options: [
      {
        id: 'perdido',
        label: 'Estou perdido. Não sei por onde começar.',
        tags: ['estrutura'],
      },
      {
        id: 'distracao',
        label: 'Sei o que fazer, mas me distraio fácil.',
        tags: ['atencao', 'estrutura'],
      },
      {
        id: 'sozinho',
        label: 'Luto sozinho. Ninguém cobra. Ninguém vê.',
        tags: ['comunidade'],
      },
      {
        id: 'recaida',
        label: 'Quando caio, desabo emocionalmente.',
        tags: ['identidade', 'ciclo'],
      },
    ],
  },
  {
    id: 'objetivo',
    title: 'O que você mais quer reconstruir agora?',
    options: [
      {
        id: 'foco',
        label: 'Foco, rotina e disciplina real',
        tags: ['estrutura'],
      },
      {
        id: 'respeito',
        label: 'Respeito próprio e identidade limpa',
        tags: ['identidade'],
      },
      {
        id: 'familia',
        label: 'Presença com família / relacionamento',
        tags: ['proposito'],
      },
      {
        id: 'dinheiro',
        label: 'Clareza pra construir (trabalho, dinheiro, futuro)',
        tags: ['proposito', 'atencao'],
      },
    ],
  },
  {
    id: 'pronto',
    title: 'O que você está disposto a fazer desta vez?',
    subtitle: 'Sem resposta certa. Só honestidade.',
    options: [
      {
        id: 'protocolo',
        label: 'Seguir um protocolo — não mais “força de vontade”',
        tags: ['pronto'],
      },
      {
        id: 'diario',
        label: 'Registrar gatilhos e agir nos minutos críticos',
        tags: ['pronto', 'fissura'],
      },
      {
        id: 'investir',
        label: 'Investir tempo e estrutura pra ter base de verdade',
        tags: ['pronto'],
      },
      {
        id: 'duvida',
        label: 'Ainda tenho dúvida — mas quero ver o diagnóstico',
        tags: ['inicio'],
      },
    ],
  },
]

export const interstitials: QuizInterstitial[] = [
  {
    id: 'verdade',
    kind: 'pitch',
    kicker: 'A verdade inconveniente',
    title: 'Vontade sozinha perde. Sempre.',
    body: [
      'O impulso conhece o seu horário, o seu gatilho e a sua frase de barganha.',
      'O que falta não é coragem. É fundação: rotina, propósito e protocolo no pico da onda.',
    ],
    bullets: [
      'Contador de dias sem ação = placar sem time',
      'Vergonha não reconstrói — estrutura reconstrói',
      'BASE existe pra você parar de negociar',
    ],
    cta: 'Continuar diagnóstico',
  },
  {
    id: 'sistema',
    kind: 'pitch',
    kicker: 'O que é o BASE',
    title: 'BASE não é um app de motivação.',
    body: [
      'É o sistema de reconstrução pessoal. Protocolos empilháveis. O primeiro é o PAV — Protocolo Antivício.',
      'Os próximos protocolos chegam depois. Você começa pela fundação que segura o padrão que te derruba hoje.',
    ],
    bullets: [
      'Arena — vence o minuto da fissura',
      'Protocolo — vence o dia com rotina e metas',
      'Identidade — sobe de nível com dias que somam',
    ],
    cta: 'Quero meu resultado',
  },
]

/** Ordem do funil: intro → Q1-3 → pitch → Q4-6 → pitch → Q7 → analyzing → result → offer */
export function buildSteps(): QuizStep[] {
  const [q0, q1, q2, q3, q4, q5, q6] = questions
  return [
    { type: 'intro' },
    { type: 'question', question: q0 },
    { type: 'question', question: q1 },
    { type: 'question', question: q2 },
    { type: 'interstitial', interstitial: interstitials[0] },
    { type: 'question', question: q3 },
    { type: 'question', question: q4 },
    { type: 'question', question: q5 },
    { type: 'interstitial', interstitial: interstitials[1] },
    { type: 'question', question: q6 },
    { type: 'analyzing' },
    { type: 'result' },
    { type: 'offer' },
  ]
}

export type Diagnosis = {
  profile: string
  headline: string
  summary: string
  protocol: string
  protocolBlurb: string
  next: string[]
  urgency: string
}

export function diagnose(answers: Record<string, string>): Diagnosis {
  const tags = new Set<string>()
  for (const q of questions) {
    const opt = q.options.find((o) => o.id === answers[q.id])
    opt?.tags.forEach((t) => tags.add(t))
  }

  const heavyCycle = tags.has('ciclo') || tags.has('identidade')
  const fissura = tags.has('fissura')
  const estrutura = tags.has('estrutura')

  if (heavyCycle && fissura) {
    return {
      profile: 'Perfil Fundação Rachada',
      headline: 'Você não precisa de mais uma promessa. Precisa de BASE.',
      summary:
        'Seu padrão já virou ciclo. A fissura chega, você negocia, cai e reinicia com vergonha. Isso não se resolve com motivação — se resolve com protocolo no minuto crítico e estrutura no dia.',
      protocol: 'Protocolo PAV',
      protocolBlurb:
        'Primeiro protocolo do BASE: Botão de Fissura, Arena, mapa de evolução e reconstrução de identidade. Os próximos protocolos do ecossistema BASE vêm depois — você começa pelo que te derruba agora.',
      next: [
        'Ativar o Botão de Fissura nos picos',
        'Mapear gatilhos e horários críticos',
        'Subir de nível com dias limpos e ondas vencidas',
      ],
      urgency: 'Cada dia negociando é mais um dia sem fundação.',
    }
  }

  if (estrutura || tags.has('vontade')) {
    return {
      profile: 'Perfil Roleta da Vontade',
      headline: 'Você já sabe o que fazer. Falta o sistema que segura.',
      summary:
        'Disciplina sem protocolo é sorte. Nos bons dias você resiste. Nos piores, o impulso manda. O BASE troca a roleta por fundação.',
      protocol: 'Protocolo PAV',
      protocolBlurb:
        'PAV é a porta de entrada do BASE. Depois vêm outros protocolos. Hoje, o foco é atravessar a fissura e sustentar a rotina.',
      next: [
        'Trocar “eu aguento” por ação no pico',
        'Rotina + propósito diário',
        'Progresso visível (níveis, mapa, benefícios)',
      ],
      urgency: 'Saber o caminho e não ter estrutura é o jeito mais caro de ficar parado.',
    }
  }

  return {
    profile: 'Perfil Primeira Fundação',
    headline: 'Você chegou cedo o bastante pra construir certo.',
    summary:
      'O ciclo ainda não te engoliu por completo — ou você finalmente parou de fingir que está no controle. Melhor momento pra erguer BASE: antes da próxima queda virar identidade.',
    protocol: 'Protocolo PAV',
    protocolBlurb:
      'Comece pelo PAV dentro do BASE. Um protocolo antivício de verdade. Os demais protocolos do sistema entram na sequência.',
    next: [
      'Definir o padrão principal e o porquê',
      'Usar a Arena nos minutos críticos',
      'Construir streak com método, não com sorte',
    ],
    urgency: 'Fundação cedo custa menos do que reconstrução tarde.',
  }
}

export const offerCopy = {
  kicker: 'Sua vaga na fundação',
  title: 'Ative o BASE. Comece pelo PAV.',
  subtitle:
    'O BASE é o sistema. O PAV é o primeiro protocolo. Você entra agora na estrutura que segura a onda — sem negociar com o vício.',
  stackTitle: 'O que libera no acesso',
  stack: [
    'Diagnóstico + acesso ao app BASE',
    'Protocolo PAV completo (Botão de Fissura · Arena · Mapa)',
    'Níveis, XP e benefícios em tempo real',
    'Diário de humor, crises e gatilhos',
    'Comunidade silenciosa (planos elegíveis)',
    'Próximos protocolos do BASE na evolução do sistema',
    'Garantia incondicional de 30 dias',
  ],
  guaranteeTitle: '30 dias. Risco zero.',
  guaranteeBody:
    'Se em 30 dias o BASE não fizer diferença na sua estrutura diária, devolução total. Sem perguntas.',
  cta: 'Ativar minha BASE agora',
  secondaryCta: 'Criar conta no app',
  plans,
  cadastro: brand.cadastroExternal,
  disclaimer: brand.disclaimer,
} as const
