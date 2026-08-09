export const brand = {
  name: 'BASE',
  product: 'Protocolo PAV',
  tagline: 'Sem base, você não sustenta.',
  system: 'Sistema de reconstrução pessoal',
  promise: 'O protocolo que troca a roleta da vontade por estrutura que segura a onda.',
  disclaimer:
    'O BASE e seus sistemas (incluindo o PAV) são ferramentas de apoio comportamental e não substituem orientação médica, psicológica ou profissional.',
  logo: `${import.meta.env.BASE_URL}brand/logo.png`,
  icon: `${import.meta.env.BASE_URL}brand/icone.png`,
  kiwify: 'https://pay.kiwify.com.br/',
  cadastroExternal: 'https://usebase.vercel.app/cadastro',
  loginExternal: 'https://usebase.vercel.app/login',
  appUrl: 'https://usebase.vercel.app/',
  planosExternal: 'https://usebase.vercel.app/planos',
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

/** Copy da página de vendas — estrutura longa de conversão */
export const sales = {
  hero: {
    kicker: 'Sistema PAV — Protocolo Antivício',
    headline: 'Sem base, você não sustenta.',
    support:
      'Você não negocia com o vício. Constrói a estrutura que o atravessa — nos minutos da fissura e nos dias que vêm depois.',
    primaryCta: 'Quero minha BASE agora',
    secondaryCta: 'Sentir a Luta (demo)',
  },

  pattern: {
    line: 'Toda vez que você “decide parar”, o vício sorri.',
    body: 'Porque ele já conhece o roteiro: promessa de manhã, barganha à tarde, colapso à noite. O problema nunca foi coragem. Foi falta de fundação.',
  },

  problem: {
    code: '01',
    title: 'Você já tentou. E caiu. De novo.',
    lead: 'O problema não é falta de força de vontade. É falta de BASE.',
    items: [
      {
        n: '01',
        t: 'Vontade sem sistema é roleta',
        b: 'Hoje cedo você resiste. Amanhã o gatilho chega no horário certo e a disciplina some. Isso não é fraqueza — é biologia sem protocolo.',
      },
      {
        n: '02',
        t: 'Você luta em silêncio',
        b: 'Ninguém vê o esforço. Ninguém cobra o porquê. Sem testemunha e sem estrutura, a mente volta ao caminho mais curto: alívio.',
      },
      {
        n: '03',
        t: 'Recaída vira identidade',
        b: 'Sem fundação, um tropeço não é um dado. Vira vergonha. Vergonha vira esconderijo. Esconderijo vira o próximo ciclo.',
      },
    ],
  },

  cost: {
    code: '02',
    title: 'O preço de continuar “tentando sozinho”',
    lead: 'Não é só o cigarro, o lance, o scroll, o doce. É o que o ciclo rouba enquanto você negocia consigo mesmo.',
    items: [
      {
        t: 'Tempo que não volta',
        b: 'Anos em modo sobrevivência. Dias limpos que viram pó porque não havia estrutura pra segurar a queda.',
      },
      {
        t: 'Dinheiro que some',
        b: 'Apostas, delivery de alívio, “só hoje”. O vício sempre encontra um preço. A liberdade também — mas o seu.',
      },
      {
        t: 'Quem você deixa de ser',
        b: 'Pai presente. Corpo forte. Foco no trabalho. Respeito próprio. O vício não só consome o hábito — consome a versão de você que você prometeu ser.',
      },
    ],
  },

  falseSolutions: {
    code: '03',
    title: 'O que já falhou — e por quê',
    lead: 'Não é falta de informação. É método errado pra guerra certa.',
    items: [
      {
        t: '“Só força de vontade”',
        b: 'Funciona até o pico da onda. Depois disso, o cérebro pede dopamina e a frase motivacional não responde.',
      },
      {
        t: 'Apps que só contam dias',
        b: 'Contador sem protocolo é placar sem time. Bonito até a primeira crise — aí você fecha o app e cai.',
      },
      {
        t: 'Vergonha como motor',
        b: 'Se humilhar não reconstrói. Quem se odeia recai mais. Quem se respeita cria rotina.',
      },
      {
        t: 'Parar “um dia de cada vez” sem mapa',
        b: 'Sem gatilhos mapeados, sem propósito diário, sem ação nos minutos críticos — você improvisa. O vício não improvisa.',
      },
    ],
  },

  mechanism: {
    code: '04',
    title: 'O mecanismo: Protocolo PAV',
    lead: 'PAV não é motivação. É engenharia comportamental: estrutura, hábitos e identidade no mesmo sistema.',
    pillars: [
      {
        n: 'I',
        t: 'Arena — vencer o minuto',
        b: 'Quando a fissura sobe, você não “resiste no vazio”. Entra na Arena: respiração, propósito, mini-jogo real, contagem da onda. Ação no pico.',
      },
      {
        n: 'II',
        t: 'Protocolo — vencer o dia',
        b: 'Rotina, metas, registro de humor e crises, lembretes do porquê. O dia deixa de ser sorte. Vira missão.',
      },
      {
        n: 'III',
        t: 'Identidade — vencer a década',
        b: 'Níveis, mapa de evolução, benefícios em tempo real. Você para de “não fazer X” e passa a ser alguém que constrói.',
      },
    ],
    laws: [
      {
        t: 'Não negocie com o inimigo',
        b: 'O vício pedindo “só um pouco” é a mesma voz que já te derrubou. O PAV corta a barganha e coloca um protocolo no lugar.',
      },
      {
        t: 'Recrie-se com forma',
        b: 'Parar não basta. Você redefine o personagem: Iniciante → Resistente → Disciplinado → Fundação → Inabalável.',
      },
      {
        t: 'Aja com ousadia no momento certo',
        b: 'A onda dura minutos. O Botão de Fissura existe pra você entrar em ação exatamente quando a vontade costuma falhar.',
      },
      {
        t: 'Fale a língua do desejo',
        b: 'Não pedimos “seja forte”. Entregamos o que você realmente quer: controle, respeito próprio, dias que somam, vida que sustenta.',
      },
    ],
  },

  acts: {
    code: '05',
    title: 'Três atos. Vontade perde. BASE sustenta.',
    lead: 'No desafio central, a metáfora vira corpo: sozinho, o impulso esmaga. Com fundação, a mesma onda vira atravessável.',
    steps: [
      { n: '01', t: 'Só vontade', b: 'Você resiste. O vício é mais forte. A queda é a lição — não a sentença.' },
      { n: '02', t: 'Construir BASE', b: 'Três pilares: rotina, propósito, protocolo. Sem isso, não há luta — só atraso.' },
      { n: '03', t: 'Com BASE', b: 'A estrutura segura o que a vontade sozinha nunca vai segurar.' },
    ],
  },

  features: {
    code: '06',
    title: 'O que entra na sua fundação',
    lead: 'Jogo na crise. Protocolo no dia. Evolução na semana. Tudo apontando pra uma coisa: você de pé.',
    items: [
      {
        code: '01',
        title: 'Botão de Fissura · 9 etapas',
        body: 'Clicou. Respiração. Propósito. Mini-jogo. Mensagem do você do passado. Checklist físico. Afirmação. Contagem da onda. Registro do gatilho. Missão do dia.',
      },
      {
        code: '02',
        title: 'Mapa de Evolução',
        body: 'A jornada vira caminho visual. De onde você saiu, onde está, qual o próximo marco. Progresso que a mente respeita.',
      },
      {
        code: '03',
        title: 'Sistema de Níveis',
        body: 'Iniciante. Resistente. Disciplinado. Fundação. Inabalável. Você sobe com dias limpos e ondas vencidas — não com discurso.',
      },
      {
        code: '04',
        title: 'Propósito Central',
        body: 'O sistema te obriga a definir o porquê e te lembra disso todo dia. Sem porquê, a fissura inventa um.',
      },
      {
        code: '05',
        title: 'Benefícios em tempo real',
        body: 'Marcos de abstinência específicos pro padrão que você combate. O corpo e a mente mostram o retorno do investimento.',
      },
      {
        code: '06',
        title: 'Mini-jogos de abstinência',
        body: 'Quando o cérebro grita por dopamina, você joga de verdade: Luta, Runner, Reflexo, Cobra, Blocos, Velha. Minutos críticos ocupados.',
      },
      {
        code: '07',
        title: 'Diário de humor, crises e gatilhos',
        body: 'Sem julgamento. Com dados. Você mapeia horários críticos e para de ser surpreendido pelo próprio impulso.',
      },
      {
        code: '08',
        title: 'Comunidade silenciosa',
        body: 'Quantas pessoas estão de pé agora. Feed sem chat privado, sem distração, sem exposição. Apoio sem teatro.',
      },
    ],
  },

  forWho: {
    code: '07',
    title: 'Isto é pra você se…',
    yes: [
      'Você já tentou parar sozinho e conhece o ciclo da promessa quebrada',
      'Quer método, não mais um discurso motivacional',
      'Aceita olhar gatilhos, horários e identidade sem se esconder',
      'Quer reconstruir rotina, foco e respeito próprio — não só “parar”',
      'Está disposto a pagar o preço da estrutura (tempo + disciplina + decisão)',
    ],
    no: [
      'Procura milagre sem mudar rotina',
      'Quer desculpa nova pra negociar “só hoje”',
      'Busca substituto de tratamento médico ou terapia quando precisa deles',
      'Não quer ser cobrado por metas que você mesmo definiu',
    ],
  },

  transformation: {
    code: '08',
    title: 'Do ciclo ao personagem',
    lead: 'Não vendemos “zero pra sempre amanhã”. Vendemos o sistema que transforma a próxima onda — e a próxima, e a próxima.',
    before: [
      'Negociar com o impulso',
      'Esconder a recaída',
      'Começar do zero emocional',
      'Dias que não se conectam',
    ],
    after: [
      'Acionar o protocolo',
      'Registrar e aprender',
      'Subir de nível mesmo depois de cair',
      'Uma identidade que sustenta',
    ],
  },

  socialProof: {
    code: '09',
    title: 'Quem parou de negociar',
    lead: 'Histórias reais de quem trocou a roleta por fundação. Resultados individuais variam — o método é o mesmo.',
  },

  offer: {
    code: '10',
    title: 'Quanto vale ter base?',
    lead: 'Menos do que um final de semana caindo. Mais barato do que mais um ano no mesmo buraco.',
    stackTitle: 'O que você leva no acesso',
    stack: [
      'Acesso ao app BASE com Sistema PAV completo',
      'Botão de Fissura em 9 etapas',
      'Arena com mini-jogos reais anti-impulso',
      'Mapa de evolução + níveis + XP',
      'Diário de humor, crises, gatilhos e metas',
      'Propósito diário + benefícios em tempo real',
      'Comunidade silenciosa (planos elegíveis)',
      'Garantia incondicional de 30 dias',
    ],
  },

  guarantee: {
    title: '30 dias. Sem teatro.',
    body: 'Se em 30 dias o BASE não fizer diferença na sua estrutura diária, devolução total. Sem perguntas. O risco fica conosco — a decisão, com você.',
  },

  close: {
    code: '11',
    title: 'Você vai cair de novo hoje?',
    highlight: 'Ou vai começar a se levantar?',
    body: 'A diferença entre quem se reconstrói e quem continua negociando é uma decisão ousada no momento certo. Este é o momento.',
    primaryCta: 'Ativar minha BASE',
    secondaryCta: 'Entrar na Arena agora',
  },
} as const

export const features = sales.features.items

export const plans = [
  {
    id: 'mensal',
    name: 'Mensal',
    subtitle: 'Flexível',
    price: 'R$ 17,70',
    cadence: '/mês',
    highlight: false,
    badge: 'Flexível',
    checkout: 'https://pay.kiwify.com.br/ss3fR01',
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
    checkout: 'https://pay.kiwify.com.br/F6PxeHX',
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
    checkout: 'https://pay.kiwify.com.br/8IUShvx',
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

export const faqs = [
  {
    q: 'Se eu recair, perco o progresso?',
    a: 'Não. Recaída faz parte do mapa — não é exclusão. O BASE registra, ajuda a ler o gatilho e te recoloca em pé. Você não perde nível por cair. Você perde nível por desistir.',
  },
  {
    q: 'Funciona pra mais de um vício ao mesmo tempo?',
    a: 'Sim. No plano Fundação você monitora padrões ilimitados com o mesmo protocolo: gatilhos, horários, metas e evolução.',
  },
  {
    q: 'Preciso compartilhar com alguém?',
    a: 'Não. Tudo acontece no app, no seu ritmo. A comunidade é opcional, anônima nas interações públicas e sem chat privado.',
  },
  {
    q: 'Substitui terapia ou tratamento médico?',
    a: 'Não. O BASE é ferramenta de apoio à rotina e ao autocontrole. Se você precisa de cuidado profissional, use o PAV junto — nunca no lugar.',
  },
  {
    q: 'Como funcionam os mini-jogos?',
    a: 'São desafios curtos e jogáveis de verdade para ocupar a mente nos minutos críticos da fissura, sem te expor a gatilhos externos. A Arena vence o minuto; o protocolo vence o dia.',
  },
  {
    q: 'Por que pagar se “força de vontade é grátis”?',
    a: 'Porque vontade sem estrutura já te custou caro. O pagamento é um compromisso público consigo: você investe na fundação que a barganha mental sempre adiou.',
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
      'O mapa de evolução virou meu vício novo. Saudável. Acordar e ver que mais um dia foi conquistado puxa mais forte que doce.',
  },
  {
    name: 'Rafael M.',
    meta: '41 · Porto Alegre · Apostas',
    days: 423,
    quote:
      'Perdi R$ 80 mil em três anos. O BASE me deu o que terapia sozinha não deu: estrutura diária. Hoje eu construo. Não destruo.',
  },
] as const
