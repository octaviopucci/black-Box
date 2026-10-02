import { brand, plans } from './site'

export type QuizOption = {
  id: string
  label: string
}

export type PitchStep = {
  type: 'pitch'
  id: string
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
  progress: number
  title: string
  helper: string
  options: QuizOption[]
}

export type OfferStep = {
  type: 'offer'
  id: string
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
    progress: 8,
    kicker: 'Trilha ENEM',
    title: 'Você estuda horas.',
    highlight: 'A nota não sobe.',
    body: [
      'Já fez lista. Já maratonou videoaula. Já zerou o caderno. E na hora do simulado, erra do mesmo jeito.',
      'Não é falta de esforço. É falta de correção de verdade. Questão sem explicação. Redação sem feedback. Você repete erro sem saber por quê.',
    ],
    bullets: [
      'Pra quem cansou de estudar no escuro',
      'Pra quem precisa de redação corrigida, não só gabarito',
      'Sem cursinho genérico. Sem promessa vazia.',
    ],
    cta: 'QUERO ENTENDER',
  },
  {
    type: 'pitch',
    id: 'broken-cycle',
    progress: 16,
    title: 'Simulado sem correção',
    highlight: 'é treino cego.',
    body: [
      'Você marca a alternativa, vê vermelho ou verde, e segue. Não sabe onde errou a lógica. Não sabe qual conteúdo revisar.',
      'Semana que vem, mesma questão, mesmo erro. O tempo passa. O ENEM chega.',
    ],
    emphasis:
      'Quantos simulados você já fez sem entender por que errou?',
    cta: 'ISSO ME DESCREVE',
  },
  {
    type: 'pitch',
    id: 'redacao',
    progress: 24,
    title: 'Redação sem feedback',
    highlight: 'trava sua nota.',
    body: [
      'Competência 2, 3, 4, 5. Cada uma pesa. Mas quem corrige sua redação hoje? Prof do cursinho com 40 folhas? Colega que também tá aprendendo?',
      'Escrever sem saber o que melhorar é adivinhar. E adivinhar no ENEM custa caro.',
    ],
    bullets: [
      'Correção por competências oficiais',
      'Feedback linha a linha',
      'Sugestão de reescrita, não só nota',
    ],
    cta: 'PRECISO DISSO',
  },
  {
    type: 'pitch',
    id: 'filter',
    progress: 32,
    title: 'Antes de seguir, lê com atenção.',
    note: {
      title: 'Trilha não é cursinho online.',
      body: [
        'É app de estudo com correção real: questões explicadas, redação com feedback, simulados que mostram onde você falha.',
        'Não é pra quem quer só assistir aula e achar que estudou.',
        'É pra quem topa errar, corrigir e subir de verdade.',
        'Se você quer atalho sem prática, fecha a página.',
      ],
    },
    body: [],
    cta: 'EU QUERO SEGUIR',
  },
  {
    type: 'pitch',
    id: 'reframe',
    progress: 42,
    title: 'Estudar certo',
    highlight: 'não é estudar mais.',
    body: [
      'Trilha ENEM corrige cada questão com o raciocínio por trás. Mostra o conteúdo que você precisa revisar. Monta sua trilha semana a semana.',
      'Na redação: nota por competência, comentários no texto, o que cortar, o que reforçar. Igual corretor de prova, no celular.',
    ],
    emphasis: 'Menos volume. Mais direção.',
    cta: 'FAZ SENTIDO PRA MIM',
  },
  {
    type: 'pitch',
    id: 'intensity',
    progress: 50,
    title: 'O ENEM não espera',
    highlight: 'você se organizar.',
    body: [
      'Cada semana sem correção é uma semana repetindo erro.',
      'Quem corrige e ajusta hoje chega na prova com mapa. Quem só acumula lista chega na prova com ansiedade.',
    ],
    emphasis: 'A prova é uma data. Seu plano precisa ser agora.',
    cta: 'CHEGA DE ADIAR',
  },
  {
    type: 'pitch',
    id: 'social-proof',
    progress: 58,
    title: 'Não é só teoria.',
    highlight: 'Tem gente subindo nota.',
    body: [
      'Estudantes de cursinho, escola pública, EJA. Alguns começaram com 500, outros mirando 900. O que mudou foi ter correção e trilha, não só mais horas na cadeira.',
    ],
    emphasis: 'Você continua sozinho ou entra na Trilha?',
    cta: 'QUERO ENTRAR',
  },
  {
    type: 'question',
    id: 'objetivo',
    progress: 66,
    title: 'O que você mais quer com o ENEM?',
    helper: 'Escolhe uma pra avançar',
    options: [
      { id: 'medicina', label: 'Passar em medicina ou curso concorrido' },
      { id: 'faculdade', label: 'Garantir uma vaga boa na faculdade' },
      { id: 'nota', label: 'Subir minha nota geral (700+)' },
      { id: 'redacao', label: 'Destravar redação de vez' },
    ],
  },
  {
    type: 'question',
    id: 'bloqueio',
    progress: 74,
    title: 'O que mais te trava hoje?',
    helper: 'Escolhe uma pra avançar',
    options: [
      { id: 'correcao', label: 'Estudo mas ninguém corrige direito' },
      { id: 'organizacao', label: 'Não sei o que revisar nem por onde' },
      { id: 'redacao', label: 'Redação sempre abaixo de 800' },
      { id: 'tempo', label: 'Tempo curto e muita matéria' },
    ],
  },
  {
    type: 'question',
    id: 'area',
    progress: 82,
    title: 'Qual área mais te derruba?',
    helper: 'Escolhe uma pra avançar',
    options: [
      { id: 'mat', label: 'Matemática e suas tecnologias' },
      { id: 'nat', label: 'Ciências da natureza' },
      { id: 'hum', label: 'Ciências humanas' },
      { id: 'lin', label: 'Linguagens e redação' },
    ],
  },
  {
    type: 'pitch',
    id: 'transformation',
    progress: 90,
    title: 'Quando a correção entra,',
    highlight: 'a nota responde.',
    body: [
      'Não é mágica. É ver o erro, entender, revisar o conteúdo certo, escrever redação melhor na próxima.',
      'Semana a semana, simulado a simulado, a curva inclina.',
    ],
    cta: 'QUERO ESSA TRILHA',
  },
  {
    type: 'pitch',
    id: 'how-it-works',
    progress: 96,
    title: 'Como a Trilha funciona na prática',
    body: [
      '1. Você faz questões ou simulados no app.',
      '2. Cada erro vem com explicação e link pro conteúdo.',
      '3. Envia redação. Recebe correção por competência em até 48h.',
      '4. O app monta sua semana: o que revisar, quantas redações, qual simulado.',
      '5. Você vê evolução por matéria. Sem achismo.',
    ],
    emphasis: 'Primeiro passo: responder o quiz e escolher seu plano.',
    cta: 'VER MEU PLANO',
  },
  {
    type: 'offer',
    id: 'offer',
    progress: 100,
  },
]

export function buildSteps(): QuizStep[] {
  return funnelSteps
}

export const proofs: Proof[] = [
  {
    name: 'Ana',
    meta: '17 anos · SP · 640 → 812 em 4 meses',
    quote:
      'Redação travava em 560. Com feedback linha a linha subi pra 780. Passei em enfermagem na USP.',
  },
  {
    name: 'Lucas',
    meta: '19 anos · MG · retorno · 520 → 701',
    quote:
      'Fiz 30 simulados antes sem saber onde falhava. Na Trilha vi que era função exponencial. Foquei e subi 180 pontos.',
  },
  {
    name: 'Juliana',
    meta: '16 anos · BA · escola pública · 580 → 745',
    quote:
      'Não tinha grana pra cursinho caro. O app corrigia igual. Hoje tô em engenharia.',
  },
]

export const offerCopy = {
  kicker: 'Sua trilha',
  title: 'Entra na Trilha ENEM.',
  subtitle:
    'App com correção de questões, redação com feedback e simulados que mostram onde você precisa melhorar. Pra quem cansou de estudar sem direção.',
  luckTitle: 'Você chegou até aqui.',
  luckBody:
    'Isso não foi acaso. É a parte sua que já sabe que mais lista sem correção não resolve. Agora é escolher: continuar no escuro ou ter trilha.',
  stackTitle: 'O que você recebe',
  stack: [
    'Correção de questões com explicação passo a passo',
    'Redação corrigida por competências ENEM',
    'Simulados com gabarito comentado',
    'Plano de estudo semanal personalizado',
    'Histórico de evolução por matéria',
    '7 dias grátis pra testar',
  ],
  valueBridge:
    'Menos que uma aula avulsa de redação. Menos que um simulado presencial. Mais direção que meses estudando sem feedback.',
  guaranteeTitle: '7 dias grátis. Sem pegadinha.',
  guaranteeBody:
    'Testa correção, redação e simulados. Se não fizer diferença na sua rotina, cancela antes de pagar. Risco nosso. Decisão sua.',
  faqTitle: 'Se ainda tá na dúvida',
  faqs: [
    {
      q: 'Funciona sem cursinho?',
      a: 'Sim. Muita gente usa só a Trilha. Outros combinam com escola ou cursinho. A correção e a trilha são independentes.',
    },
    {
      q: 'Quanto tempo leva a correção de redação?',
      a: 'Até 48h no plano trimestral. Ilimitada e prioritária no anual. Sempre com feedback por competência.',
    },
    {
      q: 'E se eu estiver começando do zero?',
      a: 'O app monta trilha pelo seu nível. Simulado inicial define por onde começar. Sem jogar conteúdo avançado em cima de você.',
    },
  ],
  cta: 'COMEÇAR 7 DIAS GRÁTIS',
  secondaryCta: 'Falar no WhatsApp',
  plans,
  proofs,
  disclaimer: brand.disclaimer,
} as const
