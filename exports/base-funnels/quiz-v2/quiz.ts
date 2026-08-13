/**
 * Funil BASE (estrutura Mode Caverna).
 * Copy: voz humana de quem já viveu a luta. Sem travessões.
 */

import { brand, plans } from './site'

export type QuizOption = {
  id: string
  label: string
}

export type PitchStep = {
  type: 'pitch'
  id: string
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

export type Proof = {
  name: string
  meta: string
  quote: string
}

export const funnelSteps: QuizStep[] = [
  {
    type: 'pitch',
    id: 'hook',
    why: 'Hook: promessa + CTA de entrada.',
    progress: 6,
    kicker: 'BASE',
    title: 'Se você tá cansado de cair de novo,',
    highlight: 'fica comigo um minuto.',
    body: [
      'Eu já acordei jurando que ia ficar limpo. Já caí de noite. Já escondi. Já apaguei o histórico. Já falei "amanhã eu paro" sabendo que era mentira.',
      'O BASE é o sistema que a gente usa pra parar de enfrentar a fissura no escuro. O primeiro protocolo é o PAV. Os outros entram depois. Hoje o jogo é o que te derruba agora.',
    ],
    bullets: [
      'Pra quem já tentou na raça e não segurou',
      'Pra quem quer o que fazer quando a vontade aperta',
      'Sem palestra. Sem pose.',
    ],
    cta: 'QUERO CONTINUAR',
  },
  {
    type: 'pitch',
    id: 'broken-promise',
    why: 'Agitar a dor da promessa quebrada.',
    progress: 12,
    title: 'Você falou que dessa vez ia ser diferente.',
    highlight: 'E aí?',
    body: [
      'Mesmo gatilho. Mesma hora. Mesma conversa na cabeça. Mesma vergonha depois.',
      'Chega uma hora que a gente para de brigar e começa a se acostumar. Fica no automático. Conta mentira pra si. Finge que tá tudo bem.',
    ],
    emphasis:
      'Daqui a cinco anos, o que vai doer mais: ter pedido ajuda com método... ou continuar fingindo que "só vontade" ia resolver?',
    cta: 'EU TÔ CANSADO DISSO',
  },
  {
    type: 'pitch',
    id: 'invisible-prison',
    why: 'Reframe: ciclo/prisão invisível.',
    progress: 20,
    title: 'Você acha que manda no impulso.',
    highlight: 'Até a fissura chegar.',
    body: [
      'Não precisa corrente. Basta um gatilho, uma vontade forte e zero plano. A cabeça fica tão ocupada barganhando que você nem vê que tá preso.',
      '"Só dessa vez." "Hoje eu mereço." "Amanhã eu seguro." Você conhece essas frases. Eu também.',
    ],
    bullets: [
      'Isso é ciclo, não azar',
      'Alívio de minutos cobrando anos da sua vida',
      'Modo sobrevivência. E ele te come por dentro',
    ],
    emphasis: 'Funciona tão bem que parece liberdade. Não é.',
    cta: 'QUERO SAIR DESSE CICLO',
  },
  {
    type: 'pitch',
    id: 'exit-price',
    why: 'Preço da saída + autoridade de quem já atravessou.',
    progress: 28,
    title: 'Dá pra sair.',
    highlight: 'Mas tem preço.',
    body: [
      'Não é sorte. Não é "nasceu forte". Não é vídeo motivacional.',
      'É largar o alívio fácil. É largar o "só hoje". É largar o orgulho de enfrentar sozinho sem estrutura nenhuma.',
    ],
    bullets: [
      'O vício que te acalma agora e te destrói depois',
      'A desculpa que te devolve pro buraco',
      'A ideia de que pedir método é fraqueza',
    ],
    emphasis:
      'Eu paguei esse preço. Tem gente demais no BASE que também pagou. A pergunta é se você topa parar de negociar.',
    cta: 'SIM, EU TOPO',
  },
  {
    type: 'pitch',
    id: 'filter',
    why: 'Filtro: quem fica e quem sai.',
    progress: 36,
    title: 'Antes de seguir, lê isso com atenção.',
    note: {
      title: 'Aqui não é spa.',
      body: [
        'BASE é pra quem já cansou de mentir pra si na hora da fissura.',
        'Não é pra quem quer uma frase bonita e continuar igual.',
        'É pra quem quer se olhar no espelho sem nojo.',
        'Se isso te incomoda e você prefere desculpa e anestesia, fecha a página. Sério. Não volta.',
      ],
    },
    body: [],
    cta: 'EU QUERO SEGUIR',
  },
  {
    type: 'pitch',
    id: 'reframe-protocol',
    why: 'Reframe: sistema/protocolo, não motivação.',
    progress: 44,
    title: 'BASE não é "se motiva e vai".',
    highlight: 'É protocolo.',
    body: [
      'Contador de dias limpos sem plano na crise é enfeite. Você fecha o app e cai igual.',
      'O PAV é o primeiro protocolo do BASE. Ele te dá o que fazer no pico da fissura, no dia seguinte e no caminho de se reconstruir. Os próximos protocolos entram depois.',
      'Você começa pelo que te quebra hoje. Simples assim.',
    ],
    emphasis: 'Fundação. Não challenge de final de semana.',
    cta: 'ISSO FAZ SENTIDO PRA MIM',
  },
  {
    type: 'pitch',
    id: 'intensity',
    why: 'Por que método intenso vence anos improvisando.',
    progress: 52,
    title: 'Método de verdade muda alguma coisa?',
    highlight: 'Se você para de improvisar na hora H, muda.',
    body: [
      'Anos tentando "na raça" cansam e quase não andam.',
      'Ter o que fazer no minuto da fissura (respirar, lembrar o porquê, ocupar a cabeça, registrar o gatilho) vale mais do que meses prometendo sozinho.',
      'Eu vi isso em mim. Vi em gente do BASE. Quando tem caminho, a vontade deixa de ser a única arma.',
    ],
    emphasis: 'Você topa parar de ir pra guerra desarmado?',
    cta: 'SIM, EU PRECISO DISSO',
  },
  {
    type: 'pitch',
    id: 'urgency',
    why: 'Urgência: custo de adiar.',
    progress: 58,
    title: 'O tempo passa igual.',
    highlight: 'Com você limpo ou com você caindo.',
    body: [
      'Enquanto a gente adia, tem gente comum (igual você, igual eu) construindo o que a gente só imagina entre uma recaída e outra.',
      'Essa sensação de ficar pra trás? Eu conheço. Come quieto.',
    ],
    emphasis:
      'Não é sorte. É decidir que chega. Cada dia barganhando é mais um dia sem chão.',
    cta: 'CHEGA. EU DECIDI',
  },
  {
    type: 'pitch',
    id: 'social-proof',
    why: 'Prova social e pertencimento.',
    progress: 66,
    title: 'Não é só eu.',
    highlight: 'São dezenas, centenas, milhares no BASE.',
    body: [
      'Gente que fumava escondido. Gente que perdia noite em aposta. Gente que abria pornô "só um pouco" e sumia duas horas. Gente que jurava dieta e caía no açúcar. Gente que abria o celular e só fechava morta de sono.',
      'Ninguém aqui nasceu santo. A diferença foi ter o que fazer quando a onda subiu.',
    ],
    emphasis: 'E aí. Você vai continuar sozinho nessa, ou vai entrar?',
    cta: 'EU VOU ENTRAR',
  },
  {
    type: 'question',
    id: 'objetivo',
    why: 'Qualificação: objetivo.',
    progress: 74,
    title: 'O que você mais quer tirar disso?',
    helper: 'Escolhe uma pra avançar',
    options: [
      {
        id: 'habitos',
        label: 'Parar de me sabotar. Ter rotina e foco de verdade.',
      },
      {
        id: 'identidade',
        label: 'Me respeitar de novo. Olhar no espelho sem vergonha.',
      },
      {
        id: 'vida',
        label: 'Estar presente com quem eu amo. Viver sem esconder queda.',
      },
    ],
  },
  {
    type: 'question',
    id: 'bloqueio',
    why: 'Qualificação: obstáculo.',
    progress: 80,
    title: 'O que mais te derruba quando você tenta mudar?',
    helper: 'Escolhe uma pra avançar',
    options: [
      {
        id: 'perdido',
        label: 'Fico perdido. Não sei por onde começar de verdade.',
      },
      {
        id: 'distracao',
        label: 'Eu sei o que fazer, mas a fissura me pega e eu caio.',
      },
      {
        id: 'comparacao',
        label: 'Me comparo, travo, e volto pro alívio fácil.',
      },
    ],
  },
  {
    type: 'question',
    id: 'padrao',
    why: 'Qualificação: padrão/vício principal.',
    progress: 85,
    title: 'Qual vício ou padrão te puxa mais forte hoje?',
    helper: 'Escolhe uma pra avançar',
    options: [
      { id: 'cigarro', label: 'Cigarro / nicotina' },
      { id: 'alcool', label: 'Álcool' },
      { id: 'apostas', label: 'Aposta / jogo' },
      { id: 'porno', label: 'Pornografia' },
      { id: 'telas', label: 'Rede social / scroll sem fim' },
      { id: 'comida', label: 'Açúcar / compulsão com comida' },
      { id: 'procrastinar', label: 'Procrastinação que come meu dia' },
      { id: 'outro', label: 'Outro. Eu sei qual é.' },
    ],
  },
  {
    type: 'pitch',
    id: 'transformation',
    why: 'Transformação + micro-sim.',
    progress: 90,
    title: 'Quando a fissura para de te mandar,',
    highlight: 'as pessoas em volta sentem.',
    body: [
      'Não é virar outro de um dia pro outro.',
      'É acordar sem aquela nóia. É cumprir o que falou. É os dias limpos começarem a somar em vez de zerar na primeira queda.',
    ],
    cta: 'EU QUERO ISSO PRA MIM',
  },
  {
    type: 'pitch',
    id: 'how-it-works',
    why: 'Como funciona: reduzir medo.',
    progress: 95,
    title: 'Como o BASE te segura na prática',
    body: [
      '1. Você entra no app.',
      '2. Começa pelo PAV (protocolo antivício). Os outros protocolos vêm depois.',
      '3. Quando a fissura sobe: você aperta o botão, usa a Arena, atravessa a onda em vez de barganhar.',
      '4. No dia: rotina, propósito e registro do gatilho.',
      '5. No tempo: você vê o progresso. Dia limpo deixa de ser sorte e vira caminho.',
    ],
    emphasis:
      'Não precisa entender tudo agora. O primeiro passo é entrar. O sistema segura o resto.',
    cta: 'QUERO MEU ACESSO',
  },
  {
    type: 'offer',
    id: 'offer',
    why: 'Oferta completa.',
    progress: 100,
  },
]

export function buildSteps(): QuizStep[] {
  return funnelSteps
}

export const proofs: Proof[] = [
  {
    name: 'Marcos',
    meta: '34 anos · parou com cigarro · 287 dias limpo',
    quote:
      'Eu falava que controlava. Mentira. O botão de fissura me segurou nos primeiros 30 dias. Hoje eu nem ligo pra cigarro na roda.',
  },
  {
    name: 'Júlia',
    meta: '28 anos · açúcar e compulsão · 142 dias',
    quote:
      'Eu caía toda noite. Doce, culpa, juramento. Ver o dia somando me puxou mais do que qualquer dieta. Parei de me odiar toda manhã.',
  },
  {
    name: 'Rafael',
    meta: '41 anos · aposta · 423 dias sem apostar',
    quote:
      'Queimei dinheiro que não tinha. Terapia me ajudou a entender. O BASE me deu o que fazer quando a mão ia no app da bet. Hoje eu construo. Não destruo.',
  },
  {
    name: 'Camila',
    meta: '31 anos · pornografia · 96 dias',
    quote:
      'Eu achava que era "só um hábito". Era fuga. Ter protocolo no pico mudou. Ainda tem vontade às vezes. A diferença é que agora eu sei o que fazer com ela.',
  },
]

export const offerCopy = {
  kicker: 'Sua vez',
  title: 'Entra no BASE. Começa pelo PAV.',
  subtitle:
    'Pra quem já tentou parar sozinho, caiu, e não quer mais viver de promessa. Menos barganha com o impulso. Mais o que fazer quando a vontade aperta.',
  luckTitle: 'Olha. Vou falar reto.',
  luckBody:
    'Você veio até aqui clicando sim. Isso não foi acaso. É a parte sua que já sabe que sozinho, do jeito antigo, não segura. Agora é só decidir se vai continuar no mesmo ciclo ou se vai ter base de verdade.',
  stackTitle: 'O que você recebe',
  stack: [
    'Acesso ao app BASE',
    'Protocolo PAV (fissura, Arena, mapa, rotina)',
    'O que fazer no minuto em que a vontade sobe',
    'Registro de gatilho sem julgamento',
    'Gente que entende a luta (sem teatro)',
    'Próximos protocolos do BASE quando forem liberados',
    '30 dias pra testar. Se não servir, devolve.',
  ],
  valueBridge:
    'Menos que uma noite caindo. Menos que uma aposta "só dessa vez". Menos que o dano de mais um mês no mesmo buraco.',
  mentorTitle: 'De quem já esteve no fundo',
  mentorBody: [
    'Eu não nasci disciplinado. Eu caí. Negociei. Escondi. Recomecei. Odeiei o espelho.',
    'O que me tirou daquilo não foi discurso. Foi ter um caminho na hora da fissura e gente que já tinha passado por isso.',
    'O BASE nasceu dessa porrada. O PAV é o primeiro protocolo. Eu uso. Tem gente demais usando também. A decisão agora é sua. E tem que ser sua.',
  ],
  guaranteeTitle: '30 dias. Sem pegadinha.',
  guaranteeBody:
    'Entra. Usa. Vê se segura a sua luta. Se em 30 dias não fizer diferença pra você, devolve 100%. Sem humilhação. Sem letra miúda na nossa conversa. O risco fica com a gente. A escolha fica com você.',
  faqTitle: 'Se ainda tá travando na cabeça',
  faqs: [
    {
      q: 'E se eu recair?',
      a: 'Recaída acontece. O BASE não te joga fora. Você registra, vê o gatilho e volta. Quem perde é quem desiste, não quem cai e levanta.',
    },
    {
      q: 'Isso substitui terapia ou médico?',
      a: 'Não. É apoio de rotina e autocontrole. Se você precisa de profissional, usa junto. Nunca no lugar.',
    },
    {
      q: 'Por que pagar se força de vontade é de graça?',
      a: 'Porque vontade sem estrutura já te custou caro. O pagamento é compromisso com você. Menos espaço pra "deixa pra depois".',
    },
  ],
  cta: 'QUERO MEU ACESSO AGORA',
  secondaryCta: 'Criar minha conta',
  plans,
  proofs,
  cadastro: brand.cadastroExternal,
  disclaimer: brand.disclaimer,
} as const

export const quizIntro = {
  kicker: funnelSteps[0].type === 'pitch' ? funnelSteps[0].kicker : '',
  title: funnelSteps[0].type === 'pitch' ? funnelSteps[0].title : '',
  highlight: funnelSteps[0].type === 'pitch' ? funnelSteps[0].highlight : '',
  body: funnelSteps[0].type === 'pitch' ? funnelSteps[0].body : [],
  points: funnelSteps[0].type === 'pitch' ? (funnelSteps[0].bullets ?? []) : [],
  cta: funnelSteps[0].type === 'pitch' ? funnelSteps[0].cta : '',
} as const
