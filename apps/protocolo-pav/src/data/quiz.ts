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
  kicker: 'Conversa rápida · 3 minutos',
  title: 'Eu já estive onde você está.',
  highlight: 'Negociando. Caindo. Prometendo “amanhã”.',
  body: [
    'Não vim te dar um discurso. Vim te olhar de igual pra igual.',
    'Eu sei o buraco. Sei a vergonha depois. Sei a mentira de “dessa vez é diferente” — porque eu também falei isso. E sei o caminho que sustenta de verdade, porque eu e muita gente do BASE já atravessamos essa luta.',
  ],
  points: [
    'Sem julgamento. Sem pose de guru.',
    'Você responde. Eu te mostro o que eu faria no seu lugar.',
    'No fim, a decisão é só sua — como tem que ser.',
  ],
  cta: 'Beleza. Vamos nessa',
} as const

export const questions: QuizQuestion[] = [
  {
    id: 'padrao',
    title: 'O que mais te puxa pra baixo hoje?',
    subtitle: 'Pode ser sincero. Aqui não tem plateia.',
    options: [
      { id: 'cigarro', label: 'Cigarro / nicotina', tags: ['pav', 'fissura'] },
      { id: 'alcool', label: 'Álcool', tags: ['pav', 'fissura'] },
      { id: 'apostas', label: 'Apostas / jogos', tags: ['pav', 'dopamina'] },
      { id: 'porno', label: 'Pornografia', tags: ['pav', 'dopamina'] },
      { id: 'telas', label: 'Redes / scroll sem fim', tags: ['pav', 'atencao'] },
      { id: 'comida', label: 'Açúcar / compulsão com comida', tags: ['pav', 'fissura'] },
      { id: 'procrastinar', label: 'Procrastinação que destrói o dia', tags: ['pav', 'atencao'] },
      { id: 'compras', label: 'Compras pra aliviar', tags: ['pav', 'dopamina'] },
    ],
  },
  {
    id: 'tempo',
    title: 'Faz quanto tempo que esse ciclo te acompanha?',
    options: [
      { id: 'meses', label: 'Alguns meses', tags: ['inicio'] },
      { id: '1-3', label: '1 a 3 anos', tags: ['ciclo'] },
      { id: '3-10', label: '3 a 10 anos', tags: ['ciclo', 'identidade'] },
      { id: '10+', label: 'Mais de 10 anos… e cansa admitir', tags: ['identidade', 'ciclo'] },
    ],
  },
  {
    id: 'tentativas',
    title: 'Nesses últimos 12 meses… quantas vezes você tentou parar?',
    options: [
      { id: '1', label: 'Uma vez. Não segurou.', tags: ['vontade'] },
      { id: '2-5', label: 'Umas 2 a 5. Sempre o mesmo filme.', tags: ['vontade', 'ciclo'] },
      { id: '6+', label: 'Perdi a conta. Já cansei de recomeçar.', tags: ['ciclo', 'identidade'] },
      { id: 'nunca', label: 'Nunca tentei de verdade. Ainda.', tags: ['inicio'] },
    ],
  },
  {
    id: 'fissura',
    title: 'Quando a vontade aperta, o que rola na sua cabeça?',
    options: [
      {
        id: 'negocia',
        label: 'Eu negocio: “só dessa vez”',
        hint: 'Eu conheço essa frase',
        tags: ['fissura', 'vontade'],
      },
      {
        id: 'explode',
        label: 'A onda sobe e eu caio rápido',
        hint: 'Minutos que decidem o dia',
        tags: ['fissura'],
      },
      {
        id: 'esconde',
        label: 'Eu escondo e juro que amanhã muda',
        hint: 'Vergonha no comando',
        tags: ['identidade'],
      },
      {
        id: 'resiste',
        label: 'Às vezes aguento… até não aguentar',
        hint: 'Força sem estrutura',
        tags: ['vontade'],
      },
    ],
  },
  {
    id: 'bloqueio',
    title: 'O que mais te faz voltar pro buraco?',
    options: [
      {
        id: 'perdido',
        label: 'Não sei por onde começar de verdade',
        tags: ['estrutura'],
      },
      {
        id: 'distracao',
        label: 'Eu sei o caminho… e me distraio igual',
        tags: ['atencao', 'estrutura'],
      },
      {
        id: 'sozinho',
        label: 'Luto sozinho. Ninguém vê. Ninguém cobra.',
        tags: ['comunidade'],
      },
      {
        id: 'recaida',
        label: 'Quando caio, eu desabo por dentro',
        tags: ['identidade', 'ciclo'],
      },
    ],
  },
  {
    id: 'objetivo',
    title: 'Se amanhã você acordasse diferente… o que mais importaria?',
    options: [
      {
        id: 'foco',
        label: 'Conseguir focar e cumprir o que eu falo',
        tags: ['estrutura'],
      },
      {
        id: 'respeito',
        label: 'Olhar no espelho sem vergonha',
        tags: ['identidade'],
      },
      {
        id: 'familia',
        label: 'Estar presente com quem eu amo',
        tags: ['proposito'],
      },
      {
        id: 'dinheiro',
        label: 'Ter clareza pra construir minha vida',
        tags: ['proposito', 'atencao'],
      },
    ],
  },
  {
    id: 'pronto',
    title: 'Sendo honesto: o que você tá disposto a fazer agora?',
    subtitle: 'Não tem resposta certa. Tem a sua.',
    options: [
      {
        id: 'protocolo',
        label: 'Parar de confiar só na força de vontade',
        tags: ['pronto'],
      },
      {
        id: 'diario',
        label: 'Enfrentar a fissura no momento em que ela vem',
        tags: ['pronto', 'fissura'],
      },
      {
        id: 'investir',
        label: 'Investir numa estrutura de verdade',
        tags: ['pronto'],
      },
      {
        id: 'duvida',
        label: 'Ainda tô em dúvida — mas quero ouvir o que você vê',
        tags: ['inicio'],
      },
    ],
  },
]

export const interstitials: QuizInterstitial[] = [
  {
    id: 'verdade',
    kind: 'pitch',
    kicker: 'Posso te falar uma coisa?',
    title: 'Não é falta de caráter.',
    body: [
      'Eu também pensei que era. Que bastava “querer mais”.',
      'Até perceber que, no pico, a vontade some — e quem não tem um caminho pronto cai. Não porque é fraco. Porque tá desarmado.',
    ],
    bullets: [
      'Promessa de manhã não segura a noite',
      'Vergonha não te reconstrói — te esconde',
      'O que segura é ter o que fazer quando a onda vem',
    ],
    cta: 'Continuar. Quero chegar no fim',
  },
  {
    id: 'sistema',
    kind: 'pitch',
    kicker: 'Como a gente passou por isso',
    title: 'Eu não inventei motivação. A gente construiu BASE.',
    body: [
      'BASE é o sistema que eu e muita gente usamos pra parar de negociar com o impulso. O primeiro protocolo é o PAV — antivício. Os outros vêm depois.',
      'Não é mágica. É ter o que fazer no minuto difícil… e uma rotina que te segura no dia seguinte. Milhares já passaram por essa porta. Você não estaria aqui se alguma parte sua não soubesse que precisa disso.',
    ],
    bullets: [
      'No pico: você age, em vez de barganhar',
      'No dia: rotina e propósito no lugar do caos',
      'No tempo: você vira alguém que sustenta — não alguém que recomeça',
    ],
    cta: 'Me mostra o que você viu em mim',
  },
]

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
      profile: 'Eu já vivi esse ciclo',
      headline: 'Você não precisa de mais uma promessa. Precisa de chão.',
      summary:
        'Pelo que você me contou, o filme é esse: a vontade aperta, você negocia, cai, se odeia e jura recomeçar. Eu conheço. Não porque li num livro — porque eu também rodei nesse loop. O que mudou pra mim e pra muita gente do BASE foi parar de “tentar na raça” e ter um caminho no minuto em que a onda vem.',
      protocol: 'Começar pelo PAV',
      protocolBlurb:
        'PAV é o primeiro protocolo do BASE — o antivício. Botão pra fissura, Arena pra atravessar o pico, mapa pra você ver que tá construindo. Os outros protocolos vêm depois. Hoje o foco é o que te derruba agora.',
      next: [
        'Ter o que fazer quando a fissura subir — não só “aguentar”',
        'Entender seus gatilhos sem se esconder deles',
        'Juntar dia limpo com dia limpo, sem drama de recomeçar do zero emocional',
      ],
      urgency:
        'Se uma parte sua já cansou desse filme… essa parte sabe o que precisa fazer.',
    }
  }

  if (estrutura || tags.has('vontade')) {
    return {
      profile: 'Você já sabe demais pra continuar improvisando',
      headline: 'O problema não é saber. É não ter estrutura na hora H.',
      summary:
        'Você não é burro. Você não é fraco. Nos bons dias você até segura. Nos ruins, o impulso manda. Eu era assim. A diferença entre continuar nessa roleta e sair dela não foi “querer mais” — foi ter um sistema que segura quando a vontade some. Foi isso que o BASE fez por mim e por tanta gente que entrou depois.',
      protocol: 'Começar pelo PAV',
      protocolBlurb:
        'PAV é a porta de entrada do BASE. Depois vêm outros protocolos. Agora o jogo é atravessar a fissura e sustentar o dia — sem depender de humor.',
      next: [
        'Trocar “eu aguento” por um passo concreto no pico',
        'Ter um porquê claro todo dia — não só depois da queda',
        'Ver progresso de verdade, pra mente parar de mentir que “não adianta”',
      ],
      urgency: 'Você já sabe o caminho. Falta decidir se vai continuar andando descalço.',
    }
  }

  return {
    profile: 'Dá pra construir agora — antes de piorar',
    headline: 'Você chegou num ponto bom: ainda dá pra fazer certo.',
    summary:
      'Ou o ciclo ainda não te engoliu, ou você finalmente cansou de fingir que tá no controle. Dos dois jeitos, esse é o momento em que a gente costuma conseguir mudar de verdade — antes da próxima queda virar “quem você é”. Eu preferia ter começado aqui. Muita gente do BASE também.',
    protocol: 'Começar pelo PAV',
    protocolBlurb:
      'Entra pelo PAV dentro do BASE. Um protocolo antivício de verdade. O resto do sistema vem na sequência — sem pressa de guru, com passo firme.',
    next: [
      'Escolher o padrão principal e o porquê de sair dele',
      'Usar a Arena nos minutos difíceis',
      'Construir sequência com método, não com sorte',
    ],
    urgency: 'Se você sentiu um “é agora”… não ignore. Essa voz raramente mente.',
  }
}

export const offerCopy = {
  kicker: 'Agora é com você',
  title: 'Se faz sentido… entra.',
  subtitle:
    'Eu não vou te empurrar. Só te dizer o que eu faria no seu lugar: ativar o BASE, começar pelo PAV, e parar de enfrentar isso sozinho e desarmado. Eu fiz. Dezenas, centenas, milhares de pessoas no BASE também. A decisão — do jeito certo — tem que parecer sua. Porque é.',
  stackTitle: 'O que você leva com você',
  stack: [
    'Acesso ao app BASE',
    'Protocolo PAV (fissura, Arena, mapa, rotina)',
    'Um caminho pra hora em que a vontade aperta',
    'Registro do que te derruba — sem julgamento',
    'Gente que entende a luta (sem teatro)',
    'Próximos protocolos do BASE quando forem liberados',
    '30 dias pra testar. Se não servir, devolve.',
  ],
  mentorNote:
    'Não é sobre eu te convencer. É sobre você olhar pra trás daqui a 30 dias e perceber que escolheu não negociar mais.',
  guaranteeTitle: '30 dias. Sem pressão.',
  guaranteeBody:
    'Entra, usa, vê se segura sua luta. Se em 30 dias não fizer diferença pra você, devolve o valor. Sem humilhação. Sem letra miúda na nossa conversa.',
  cta: 'Quero começar pelo BASE',
  secondaryCta: 'Criar minha conta',
  plans,
  cadastro: brand.cadastroExternal,
  disclaimer: brand.disclaimer,
} as const
