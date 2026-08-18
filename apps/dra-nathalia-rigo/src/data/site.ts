export const brand = {
  name: 'Dra. Nathalia Rigo',
  short: 'Nathalia Rigo',
  honorific: 'Dra. Nathalia Rigo',
  profession: 'Enfermeira esteta',
  city: 'Sorocaba',
  neighborhood: 'Parque São Bento',
  experienceYears: 12,
  instagramHandle: 'dranathaliarigo',
  instagramUrl: 'https://www.instagram.com/dranathaliarigo',
  instagramDm: 'https://ig.me/m/dranathaliarigo',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua%20Izidro%20Roque%20da%20Silva%20Telo%2C%2035%2C%20Parque%20S%C3%A3o%20Bento%2C%20Sorocaba%20SP',
  address: {
    street: 'Rua Izidro Roque da Silva Telo, 35',
    complement: 'Piso superior',
    district: 'Parque São Bento',
    city: 'Sorocaba',
    state: 'SP',
  },
  hoursNote: 'Horário publicado: 9h às 18h. Confirme o dia pelo Instagram antes de sair.',
  bioLine: 'Realçar sua beleza com resultados naturais e sofisticados.',
} as const

export const media = {
  frost: `${import.meta.env.BASE_URL}media/frost.jpg`,
  skin: `${import.meta.env.BASE_URL}media/skin.jpg`,
  volume: `${import.meta.env.BASE_URL}media/volume.jpg`,
  light: `${import.meta.env.BASE_URL}media/light.jpg`,
  room: `${import.meta.env.BASE_URL}media/room.jpg`,
} as const

export const nav = [
  { to: '/', label: 'Limiar', mercury: 8 },
  { to: '/protocolos', label: 'Protocolos', mercury: 38 },
  { to: '/nathalia', label: 'Nathalia', mercury: 62 },
  { to: '/espaco', label: 'O espaço', mercury: 82 },
  { to: '/avaliacao', label: 'Avaliação', mercury: 100 },
] as const

export const chambers = [
  {
    slug: 'criolipolise',
    reading: '−11 °C',
    name: 'Criolipólise',
    field: 'Corpo',
    image: media.skin,
    imageAlt:
      'Close da pele no ombro e na clavícula, iluminada com luz fria — o território da criolipólise.',
    lead: 'O frio que desenha um contorno mais quieto.',
    body: 'A criolipólise resfria de forma controlada o tecido adiposo localizado. Não é um atalho para emagrecer: é um protocolo de contorno, indicado depois da consulta de enfermagem, quando a região e a expectativa conversam com o método.',
    after: 'A pele segue sendo a sua. O volume a menos é o que o espelho deixa de apontar.',
  },
  {
    slug: 'preenchimento-labial',
    reading: '36,5 °C',
    name: 'Preenchimento labial',
    field: 'Rosto',
    image: media.volume,
    imageAlt: 'Drapeado de seda em tom malva — metáfora tátil de volume, sem exagero.',
    lead: 'Volume que ainda pertence à boca.',
    body: 'O preenchimento labial, no espaço da Dra. Nathalia, existe para realçar o que já está ali: o desenho, a hidratação, a proporção. Nada de boca de outra pessoa. Avaliação primeiro. Indicação depois. Mão de enfermagem o tempo inteiro.',
    after: 'Se alguém precisar perguntar o que você fez, o volume passou do ponto.',
  },
  {
    slug: 'epilacao-a-laser',
    reading: 'luz',
    name: 'Epilação a laser',
    field: 'Pele',
    image: media.light,
    imageAlt: 'Feixe de luz quente atravessando um interior em penumbra.',
    lead: 'Pelo que deixa de interromper a pele.',
    body: 'A epilação a laser reduz o pelo de forma progressiva, sessão a sessão, com leitura de fototipo e de região. É um trabalho de paciência técnica — não um flash único. O espaço publica o procedimento; o plano se escreve na avaliação.',
    after: 'Luz com protocolo. Pele com intervalo. Resultado com o tempo que a folícula pede.',
  },
] as const

export const objections = [
  {
    q: 'Nathalia é médica?',
    a: 'Não. A Dra. Nathalia Rigo é enfermeira esteta. Em estética avançada, o título “Dra.” acompanha a graduação em Enfermagem. A atuação do enfermeiro na estética é regulamentada pelo Cofen — consulta, anamnese, protocolo e registro fazem parte do cuidado, não são detalhes.',
  },
  {
    q: 'Posso chegar e já fazer o procedimento?',
    a: 'A avaliação vem primeiro. É nela que se vê indicação, contraindicação e expectativa. O Instagram é a porta de entrada para marcar esse encontro no Parque São Bento.',
  },
  {
    q: 'O resultado fica com cara de procedimento?',
    a: 'A linha publicada da Nathalia é outra: realçar com naturalidade e sofisticação. Se o desejo for um volume que anuncie o produto, este não é o espaço.',
  },
  {
    q: 'A criolipólise emagrece?',
    a: 'Ela trata gordura localizada em regiões específicas. Não substitui hábito, nutrição nem treino. Na avaliação, isso é dito com clareza — para ninguém comprar uma promessa que o método não carrega.',
  },
  {
    q: 'Como marco?',
    a: 'Pelo Instagram @dranathaliarigo. A avaliação digital deste site prepara a mensagem; você cola no direct. Endereço e horário se confirmam ali, no mesmo fio.',
  },
] as const

export const protocolChoices = {
  interest: [
    { id: 'criolipolise', label: 'Criolipólise', hint: 'Contorno corporal' },
    { id: 'labial', label: 'Preenchimento labial', hint: 'Volume e desenho' },
    { id: 'laser', label: 'Epilação a laser', hint: 'Pele mais quieta' },
    { id: 'conversa', label: 'Ainda não sei', hint: 'Quero conversar' },
  ],
  tempo: [
    { id: 'primeira', label: 'É a primeira vez neste espaço' },
    { id: 'retorno', label: 'Já me cuidei com a Nathalia' },
    { id: 'ouvir', label: 'Quero só entender se faz sentido' },
  ],
} as const

export function composeDirectMessage(interest: string, tempo: string) {
  const interestLabel =
    protocolChoices.interest.find((item) => item.id === interest)?.label ?? 'Avaliação'
  const tempoLabel = protocolChoices.tempo.find((item) => item.id === tempo)?.label ?? ''

  return [
    'Olá, Dra. Nathalia. Gostaria de agendar uma avaliação.',
    `Interesse: ${interestLabel}.`,
    tempoLabel ? `${tempoLabel}.` : '',
    'Vim pelo site.',
  ]
    .filter(Boolean)
    .join(' ')
}

export const privacyPoints = [
  'Este site não coleta cadastro, não grava pagamento e não pede documento.',
  'A conversa de agendamento acontece no Instagram da profissional, sob as regras daquela plataforma.',
  'Não inventamos depoimentos, notas, COREN, preços nem resultados numéricos.',
  'Imagens de atmosfera são direção de arte do ateliê digital — não são fotografias clínicas de pacientes.',
] as const
