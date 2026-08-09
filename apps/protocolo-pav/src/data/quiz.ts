/**
 * Funil BASE — espelha a arquitetura validada do Mode Caverna Quiz:
 *
 * 1) Hook / promessa
 * 2) Dor / promessa quebrada (agitar)
 * 3) Prisão invisível (reframe do problema)
 * 4) Preço da saída / renúncias + prova do mentor
 * 5) Filtro (quem fica / quem sai)
 * 6) Reframe do produto (ritual/protocolo, não motivação)
 * 7) Intensidade do tempo (por que agora funciona)
 * 8) Urgência (custo de adiar)
 * 9) Prova social
 * 10–11) Perguntas de qualificação (tarde no funil)
 * 12) Promessa de transformação + micro-sim
 * 13) Como funciona (passos)
 * 14) Oferta + garantia + história + CTA
 *
 * Cada etapa força um micro-compromisso (botão “sim”) antes da venda.
 */

import { brand, plans } from './site'

export type QuizOption = {
  id: string
  label: string
}

export type PitchStep = {
  type: 'pitch'
  id: string
  /** Motivo da etapa no funil (documentação interna) */
  why: string
  progress: number
  kicker?: string
  title: string
  highlight?: string
  body: string[]
  note?: { title: string; body: string[] }
  bullets?: string[]
  emphasis?: string
  cta: string
}

export type QuestionStep = {
  type: 'question'
  id: string
  why: string
  progress: number
  title: string
  helper: string
  options: QuizOption[]
}

export type OfferStep = {
  type: 'offer'
  id: string
  why: string
  progress: number
}

export type QuizStep = PitchStep | QuestionStep | OfferStep

export const funnelSteps: QuizStep[] = [
  {
    type: 'pitch',
    id: 'hook',
    why: 'Hook — promessa clara + CTA de entrada (igual “ATIVAR O MODO CAVERNA”).',
    progress: 6,
    kicker: 'BASE · Sistema de reconstrução',
    title: 'Sem base, você não sustenta.',
    highlight: 'E a gente já sabe disso na pele.',
    body: [
      'Eu e muita gente do BASE já rodamos no mesmo filme: prometer, cair, esconder, recomeçar.',
      'Aqui não tem guru de palco. Tem um caminho que segura a fissura — começando pelo PAV, o primeiro protocolo. Os outros vêm depois.',
    ],
    bullets: [
      'Menos procrastinação com a própria vida',
      'Mais estrutura nos minutos difíceis',
      'Decisão sua. Sem pressão de show.',
    ],
    cta: 'ATIVAR O BASE',
  },
  {
    type: 'pitch',
    id: 'broken-promise',
    why: 'Agitar a dor — espelha “você prometeu que esse ano seria diferente”.',
    progress: 12,
    title: 'Você prometeu que dessa vez seria diferente.',
    highlight: 'Lembra?',
    body: [
      'Mas olha pra rotina: mesmos gatilhos, mesma barganha, mesma vergonha depois.',
      'E o pior é quando a gente começa a achar isso “normal” — sobreviver no piloto automático como se não houvesse outra opção.',
    ],
    emphasis:
      'Daqui a 5 anos, o que vai doer mais: ter tentado com estrutura… ou nunca ter parado de negociar consigo mesmo?',
    cta: 'EU NÃO QUERO VIVER ASSIM',
  },
  {
    type: 'pitch',
    id: 'invisible-prison',
    why: 'Reframe do problema — prisão invisível / labirinto (MC).',
    progress: 20,
    title: 'Você acha que está no controle…',
    highlight: 'Mas negocia com o impulso todo dia.',
    body: [
      'Não precisa de algema. Basta um gatilho, uma fissura e zero fundação — e a mente fica ocupada demais pra admitir que está presa.',
      'Será que ainda dá pra acreditar que “só força de vontade” vai segurar na próxima onda?',
    ],
    bullets: [
      'É ciclo, não coincidência',
      'É alívio de minutos contra anos da sua vida',
      'É modo sobrevivência — e ele funciona contra você',
    ],
    emphasis: 'Funciona tão bem que você acha que é livre. Mas não é.',
    cta: 'QUERO SAIR DESSE CICLO',
  },
  {
    type: 'pitch',
    id: 'exit-price',
    why: 'Preço da saída / renúncias + autoridade de quem já atravessou (MC).',
    progress: 28,
    title: 'A saída existe.',
    highlight: 'Mas ela cobra um preço.',
    body: [
      'Não é sorte. Não é talento. Nem motivação de domingo.',
      'É renúncia — do alívio fácil, da mentira de “só hoje”, dos lugares e hábitos que te puxam de volta sempre que você tenta subir.',
    ],
    bullets: [
      'Dos vícios que aliviam minutos e cobram anos',
      'Das desculpas que te mantêm no mesmo buraco',
      'Do orgulho de “eu aguento sozinho” sem estrutura',
    ],
    emphasis:
      'Eu cobrei esse preço. Dezenas, centenas, milhares no BASE também. A pergunta é: você está disposto a deixar o ciclo pra trás?',
    cta: 'SIM, ESTOU PRONTO',
  },
  {
    type: 'pitch',
    id: 'filter',
    why: 'Filtro — repeliar curioso e criar identidade “um de nós” (MC amarelo).',
    progress: 36,
    title: 'Antes de seguir, lê com atenção.',
    note: {
      title: 'BASE não é conforto.',
      body: [
        'É campo de batalha pra quem aceitou uma verdade simples: ninguém vai te salvar na hora da fissura.',
        'Não é pra quem quer paz agora sem pagar o preço. É pra quem quer se respeitar daqui pra frente.',
        'Se essa conversa faz sentido… talvez você seja um dos nossos.',
        'Se prefere anestesia, desculpa e vitimismo — fecha essa página e não volta.',
      ],
    },
    body: [],
    cta: 'EU QUERO PROSSEGUIR',
  },
  {
    type: 'pitch',
    id: 'reframe-protocol',
    why: 'Reframe do produto — de “app” para ritual/protocolo (MC “É UM RITUAL”).',
    progress: 44,
    title: 'BASE não é motivação barata.',
    highlight: 'É um sistema de protocolos.',
    body: [
      'Vai além de contador de dias e frase bonita no espelho.',
      'O primeiro protocolo é o PAV — Protocolo Antivício: o que fazer no pico da onda, no dia seguinte e na construção da identidade.',
      'Os próximos protocolos do BASE entram depois. Você começa pelo que te derruba agora.',
    ],
    emphasis: 'É fundação. Não é challenge de fim de semana.',
    cta: 'SIM, TÁ FAZENDO SENTIDO',
  },
  {
    type: 'pitch',
    id: 'intensity',
    why: 'Intensidade do tempo — por que estrutura comprimida vence anos improvisando (MC 40 dias / DBZ).',
    progress: 52,
    title: 'Será que estrutura de verdade muda uma vida?',
    highlight: 'Depende do quão intenso você está disposto a ser.',
    body: [
      'Anos “tentando na raça” custam caro e quase não andam.',
      'Dias com protocolo no minuto da fissura — respiração, propósito, ação, registro — valem mais do que meses negociando sozinho.',
      'Eu vi isso em mim. Vi em gente do BASE. Intensidade com método distorce o calendário: você para de girar e começa a subir.',
    ],
    emphasis: 'Você está pronto pra parar de improvisar na hora H?',
    cta: 'SIM, EU PRECISO',
  },
  {
    type: 'pitch',
    id: 'urgency',
    why: 'Urgência — custo de adiar (MC “tempo de vida é curto”).',
    progress: 58,
    title: 'Seu tempo é curto.',
    highlight: 'E ainda assim a gente joga fora a chance de ter chão.',
    body: [
      'Enquanto isso, pessoas comuns — iguais a você e a mim — estão construindo o que você só imagina entre uma queda e outra.',
      'Eu sei que a sensação de ficar pra trás come por dentro.',
    ],
    emphasis:
      'A diferença não é sorte. É a coragem de dizer chega — e entrar num caminho. Cada dia negociando é mais um dia sem base.',
    cta: 'SIM. ESTOU DECIDIDO',
  },
  {
    type: 'pitch',
    id: 'social-proof',
    why: 'Prova social — pertencimento e “você vai ser o próximo?” (MC).',
    progress: 66,
    title: 'Dezenas. Centenas. Milhares.',
    highlight: 'Gente que cansou de cair sozinha.',
    body: [
      'Não são heróis. São pessoas que decidiram parar de negociar com o impulso — e usaram o BASE pra ter o que fazer quando a onda vem.',
      'Eu já estive do outro lado. Eles também. A pergunta que importa agora é a sua.',
    ],
    emphasis: 'E aí… você vai ser o próximo a erguer fundação?',
    cta: 'SIM, EU ESTOU DECIDIDO',
  },
  {
    type: 'question',
    id: 'objetivo',
    why: 'Qualificação tardia — objetivo (MC pergunta 1 perto do fim).',
    progress: 74,
    title: 'O que você mais quer conquistar com o BASE?',
    helper: 'Escolha uma opção para avançar',
    options: [
      {
        id: 'habitos',
        label: 'Melhorar hábitos e rotina. Ter foco e disciplina de verdade.',
      },
      {
        id: 'identidade',
        label: 'Me respeitar de novo. Parar de me sabotar e reconstruir quem eu sou.',
      },
      {
        id: 'vida',
        label: 'Estar presente com a família / construir uma vida que eu não precise esconder.',
      },
    ],
  },
  {
    type: 'question',
    id: 'bloqueio',
    why: 'Qualificação — obstáculo (MC pergunta 2).',
    progress: 80,
    title: 'O que mais te impede de conquistar isso?',
    helper: 'Escolha uma opção para avançar',
    options: [
      {
        id: 'perdido',
        label: 'Estou perdido. Não sei o que fazer pra mudar de verdade.',
      },
      {
        id: 'distracao',
        label: 'Eu sei o caminho, mas me distraio e caio na fissura.',
      },
      {
        id: 'comparacao',
        label: 'Me comparo, me paraliso e acabo voltando pro alívio fácil.',
      },
    ],
  },
  {
    type: 'question',
    id: 'padrao',
    why: 'Qualificação BASE — padrão principal (adaptação de produto; MC não tem, nós precisamos).',
    progress: 85,
    title: 'Qual padrão te derruba com mais força hoje?',
    helper: 'Escolha uma opção para avançar',
    options: [
      { id: 'cigarro', label: 'Cigarro / nicotina' },
      { id: 'alcool', label: 'Álcool' },
      { id: 'apostas', label: 'Apostas / jogos' },
      { id: 'porno', label: 'Pornografia' },
      { id: 'telas', label: 'Redes / scroll sem fim' },
      { id: 'comida', label: 'Açúcar / compulsão com comida' },
      { id: 'procrastinar', label: 'Procrastinação que destrói o dia' },
      { id: 'outro', label: 'Outro padrão que eu sei qual é' },
    ],
  },
  {
    type: 'pitch',
    id: 'transformation',
    why: 'Promessa de transformação + micro-sim (MC “não será mais o mesmo”).',
    progress: 90,
    title: 'Quando a base segura…',
    highlight: 'Você não é mais o mesmo. E o mundo percebe.',
    body: [
      'Não porque virou outro personagem da noite pro dia.',
      'Porque parou de negociar. Porque tem o que fazer no pico. Porque os dias começam a somar.',
    ],
    cta: 'EU QUERO ESSA TRANSFORMAÇÃO',
  },
  {
    type: 'pitch',
    id: 'how-it-works',
    why: 'Como funciona — reduzir medo do desconhecido (MC 6 passos + “quero o app”).',
    progress: 95,
    title: 'É assim que você ativa o BASE',
    body: [
      '1. Entra no sistema — app BASE no celular.',
      '2. Começa pelo PAV — o protocolo antivício (os próximos vêm depois).',
      '3. No pico da fissura: Botão + Arena — ação em vez de barganha.',
      '4. No dia: rotina, propósito e registro do que te derruba.',
      '5. No tempo: mapa, níveis e dias que somam — identidade que sustenta.',
    ],
    emphasis:
      'Relaxa: você não precisa entender tudo agora. É dar o primeiro passo. O sistema segura o resto.',
    cta: 'EU QUERO O BASE',
  },
  {
    type: 'offer',
    id: 'offer',
    why: 'Oferta — stack, planos, garantia, história do mentor, CTA (MC offer page).',
    progress: 100,
  },
]

export function buildSteps(): QuizStep[] {
  return funnelSteps
}

export const offerCopy = {
  kicker: 'Hoje é o dia',
  title: 'Ativa o BASE. Começa pelo PAV.',
  subtitle:
    'Ideal pra quem cansou de se sabotar e quer resultado com estrutura — menos negociação com o impulso, mais disciplina no minuto difícil.',
  luckTitle: 'Olha… vou ser direto com você.',
  luckBody:
    'Você chegou até aqui respondendo e dizendo sim várias vezes. Isso não é coincidência. É a parte sua que já sabe o que precisa fazer.',
  stackTitle: 'O que você leva',
  stack: [
    'Acesso ao app BASE',
    'Protocolo PAV completo (fissura, Arena, mapa, rotina)',
    'Caminho claro nos minutos da onda',
    'Registro de gatilhos sem julgamento',
    'Comunidade de quem entende a luta',
    'Próximos protocolos do BASE na evolução do sistema',
    '30 dias de garantia — sem teatro',
  ],
  mentorTitle: 'Quem fala com você',
  mentorBody: [
    'Eu não nasci “disciplinado”. Eu caí. Negociei. Escondi. Recomecei.',
    'O que mudou não foi um discurso. Foi ter fundação — e depois ajudar outras pessoas a terem a mesma coisa.',
    'O BASE nasceu dessa luta. O PAV é o primeiro protocolo. Eu usei. Dezenas, centenas, milhares no BASE também. Agora a decisão é sua — e tem que parecer sua, porque é.',
  ],
  guaranteeTitle: 'Garantia incondicional de 30 dias',
  guaranteeBody:
    'Entra, usa, vê se segura a sua luta. Se em 30 dias não fizer diferença, devolve 100%. Sem perguntas. Sem humilhação. O risco fica com a gente — a escolha, com você.',
  cta: 'COMEÇAR AGORA',
  secondaryCta: 'Criar minha conta',
  plans,
  cadastro: brand.cadastroExternal,
  disclaimer: brand.disclaimer,
} as const

/** Compat: QuizPage antigo importava quizIntro — mantém alias mínimo se necessário */
export const quizIntro = {
  kicker: funnelSteps[0].type === 'pitch' ? funnelSteps[0].kicker : '',
  title: funnelSteps[0].type === 'pitch' ? funnelSteps[0].title : '',
  highlight: funnelSteps[0].type === 'pitch' ? funnelSteps[0].highlight : '',
  body: funnelSteps[0].type === 'pitch' ? funnelSteps[0].body : [],
  points: funnelSteps[0].type === 'pitch' ? funnelSteps[0].bullets ?? [] : [],
  cta: funnelSteps[0].type === 'pitch' ? funnelSteps[0].cta : '',
} as const
