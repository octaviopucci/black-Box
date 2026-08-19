export const media = {
  hero: 'media/profissional.jpg',
  profissional: 'media/hero.jpg',
  espaco: 'media/espaco.jpg',
  logo: 'media/logo-cover.jpg',
  profile: 'media/profile-picture.jpg',
  criolipolise: 'media/criolipolise.jpg',
  preenchimentoFacial: 'media/preenchimento-facial.jpg',
  preenchimentoFacialResultado: 'media/preenchimento-facial-antes-depois.jpg',
  tratamentoFacial: 'media/antes-depois-facial.jpg',
  preenchimentoLabial: 'media/preenchimento-labial.jpg',
} as const

export const instagramHighlights = [
  {
    title: 'Preenchimentos',
    text: 'Labial e facial — doses pensadas, resultados naturais.',
    image: media.preenchimentoFacial,
  },
  {
    title: 'Resultados',
    text: 'Antes e depois reais publicados no feed.',
    image: media.tratamentoFacial,
  },
  {
    title: 'Corporal',
    text: 'Criolipólise e contorno — tecnologia com avaliação prévia.',
    image: media.criolipolise,
  },
  {
    title: 'Consultório',
    text: 'Parque São Bento · ambiente acolhedor.',
    image: media.espaco,
  },
] as const

export const feedGallery = [
  { image: 'media/profissional.jpg', label: 'Profissional · FULL BODY 2026' },
  { image: 'media/hero.jpg', label: 'Consultório · uniforme' },
  { image: 'media/espaco.jpg', label: 'Espaço · Parque São Bento' },
  { image: 'media/preenchimento-labial.jpg', label: 'Preenchimento labial · antes e depois' },
  { image: 'media/preenchimento-facial.jpg', label: 'Preenchimento facial' },
  { image: 'media/preenchimento-facial-antes-depois.jpg', label: 'Bigode chinês · antes e depois' },
  { image: 'media/antes-depois-facial.jpg', label: 'Tratamento facial · resultado' },
  { image: 'media/criolipolise.jpg', label: 'Criolipólise · contorno corporal' },
  { image: 'media/profile-picture.jpg', label: 'Perfil @dranathaliarigo' },
] as const

export const brand = {
  name: 'Dra. Nathalia Rigo',
  short: 'Nathalia Rigo',
  businessName: 'Nathalia Rigo · Estética & Saúde',
  tagline: 'Estética & Saúde',
  subtitle: 'Estética avançada · Sorocaba',
  profession: 'Enfermeira esteta',
  coren: '387004',
  city: 'Sorocaba',
  neighborhood: 'Parque São Bento',
  experienceYears: 12,
  instagramHandle: 'dranathaliarigo',
  instagramAltHandle: 'nathy.rigo',
  instagramUrl: 'https://www.instagram.com/dranathaliarigo',
  instagramDm: 'https://ig.me/m/dranathaliarigo',
  facebookUrl: 'https://www.facebook.com/dra.nathyrigo',
  phone: '+55 15 99279-1887',
  whatsappUrl: 'https://wa.me/5515992791887',
  email: 'dranathalliarigo@gmail.com',
  cta: 'Transforme-se hoje',
  ctaAlt: 'Agende sua consulta',
  bioLines: [
    'Procedimentos estéticos com naturalidade.',
    'Enfermeira esteta · COREN 387004',
    'Sorocaba',
  ] as const,
  bioLegacy: 'Realçar sua beleza com resultados naturais e sofisticados.',
  instagramStats: {
    posts: 107,
    followers: '6k',
  },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua%20Izidro%20Roque%20da%20Silva%20Telo%2C%2035%2C%20Parque%20S%C3%A3o%20Bento%2C%20Sorocaba%20SP',
  address: {
    street: 'Rua Izidro Roque da Silva Telo, 35',
    complement: 'Piso superior',
    district: 'Parque São Bento',
    city: 'Sorocaba',
    state: 'SP',
  },
  hoursNote: 'Horário publicado: 9h às 18h. Confirme pelo Instagram ou WhatsApp antes de ir.',
} as const

export const nav = [
  { to: '/', label: 'Início' },
  { to: '/procedimentos', label: 'Procedimentos' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
] as const

export const landingSections = [
  { id: 'procedimentos', label: 'Procedimentos' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'destaques', label: 'Destaques' },
  { id: 'profissional', label: 'Profissional' },
  { id: 'espaco', label: 'Espaço' },
  { id: 'contato', label: 'Contato' },
] as const

export const highlightThemes = [
  {
    title: 'Naturalidade',
    text: 'Procedimentos estéticos com naturalidade — a promessa publicada na bio do Instagram.',
  },
  {
    title: 'Preenchimentos',
    text: 'Labial e facial com doses pensadas. Nem sempre o objetivo é resolver tudo em uma sessão.',
  },
  {
    title: 'Resultados',
    text: 'Menos marcas, mais leveza — antes e depois reais no feed @dranathaliarigo.',
  },
  {
    title: 'Consulta',
    text: 'Agende sua consulta pelo Instagram ou WhatsApp publicados pela profissional.',
  },
] as const

export const philosophyQuotes = [
  {
    quote: 'Nem sempre o objetivo é “apagar” o bigode chinês em uma única sessão.',
    source: 'Post no Instagram · preenchimento facial',
  },
  {
    quote: 'Será que apenas 1 ml faz diferença?',
    source: 'Post no Instagram · preenchimento labial',
  },
  {
    quote: 'Menos marcas, mais leveza.',
    source: 'Post no Instagram · tratamento facial',
  },
] as const

export const results = [
  {
    slug: 'preenchimento-facial',
    title: 'Preenchimento facial',
    caption: 'Bigode chinês — resultado publicado no perfil.',
    image: 'media/preenchimento-facial.jpg',
  },
  {
    slug: 'preenchimento-facial-sessao',
    title: 'Evolução facial',
    caption: 'Antes e depois em sessão — expectativa realista.',
    image: 'media/preenchimento-facial-antes-depois.jpg',
  },
  {
    slug: 'tratamento-facial',
    title: 'Tratamento facial',
    caption: 'Menos marcas, mais leveza.',
    image: 'media/antes-depois-facial.jpg',
  },
  {
    slug: 'criolipolise',
    title: 'Criolipólise',
    caption: 'Contorno corporal — antes e depois publicado no Instagram.',
    image: 'media/criolipolise.jpg',
  },
] as const

export const procedures = [
  {
    slug: 'preenchimento-labial',
    name: 'Preenchimento labial',
    area: 'Facial',
    lead: 'Será que apenas 1 ml faz diferença?',
    body: 'Volume e desenho que respeitam a sua boca — publicado no Instagram com foco em naturalidade. Avaliação de enfermagem antes de qualquer aplicação.',
    caption: 'Antes e depois publicado nos Reels do perfil.',
    image: 'media/preenchimento-labial.jpg',
  },
  {
    slug: 'preenchimento-facial',
    name: 'Preenchimento facial',
    area: 'Facial',
    lead: 'Bigode chinês com expectativa realista.',
    body: 'Nem sempre o objetivo é apagar o bigode chinês em uma única sessão. O plano respeita o tempo da pele e a naturalidade do rosto.',
    caption: 'Foto real extraída do feed @dranathaliarigo.',
    image: 'media/preenchimento-facial.jpg',
  },
  {
    slug: 'tratamento-facial',
    name: 'Tratamento facial',
    area: 'Facial',
    lead: 'Menos marcas, mais leveza.',
    body: 'Tratamentos faciais publicados no perfil, com resultado gradual e sofisticado — sem prometer transformação instantânea.',
    caption: 'Resultado publicado no Instagram.',
    image: 'media/antes-depois-facial.jpg',
  },
  {
    slug: 'criolipolise',
    name: 'Criolipólise',
    area: 'Corporal',
    lead: 'Contorno com tecnologia de resfriamento controlado.',
    body: 'Procedimento corporal publicado no histórico do perfil e nas listagens do espaço. Indicação e plano saem na avaliação de enfermagem.',
    caption: 'Foto real extraída do feed @dranathaliarigo.',
    image: 'media/criolipolise.jpg',
  },
  {
    slug: 'epilacao-a-laser',
    name: 'Epilação a laser',
    area: 'Pele',
    lead: 'Redução progressiva do pelo, sessão a sessão.',
    body: 'Tratamento publicado no espaço, com protocolo definido na consulta. Pele, região e expectativa são lidas antes de começar.',
    caption: 'Protocolo detalhado na consulta.',
    image: null,
  },
] as const

export const objections = [
  {
    q: 'A Dra. Nathalia é médica?',
    a: 'Não. É enfermeira esteta — COREN 387004, publicado no Instagram. Em estética avançada, o título “Dra.” acompanha a graduação em Enfermagem. Consulta, anamnese e registro fazem parte do cuidado.',
  },
  {
    q: 'Como agendo?',
    a: 'Pelo Instagram @dranathaliarigo, WhatsApp (15) 99279-1887 ou e-mail dranathalliarigo@gmail.com — canais publicados nos perfis oficiais.',
  },
  {
    q: 'O resultado fica artificial?',
    a: 'A promessa publicada é outra: procedimentos com naturalidade. Se busca exagero visível, este não é o perfil.',
  },
  {
    q: 'Onde fica o consultório?',
    a: 'Rua Izidro Roque da Silva Telo, 35, piso superior — Parque São Bento, Sorocaba.',
  },
] as const

export const protocolChoices = {
  interest: [
    { id: 'labial', label: 'Preenchimento labial' },
    { id: 'facial', label: 'Preenchimento facial' },
    { id: 'tratamento', label: 'Tratamento facial' },
    { id: 'criolipolise', label: 'Criolipólise' },
    { id: 'laser', label: 'Epilação a laser' },
    { id: 'conversa', label: 'Quero conversar primeiro' },
  ],
  tempo: [
    { id: 'primeira', label: 'Primeira vez no espaço' },
    { id: 'retorno', label: 'Já sou paciente' },
    { id: 'duvida', label: 'Só tirar dúvidas' },
  ],
} as const

export function composeDirectMessage(interest: string, tempo: string) {
  const interestLabel =
    protocolChoices.interest.find((item) => item.id === interest)?.label ?? 'Avaliação'
  const tempoLabel = protocolChoices.tempo.find((item) => item.id === tempo)?.label ?? ''

  return [
    'Olá, Dra. Nathalia! Vi seu Instagram e gostaria de agendar.',
    `Procedimento: ${interestLabel}.`,
    tempoLabel ? `${tempoLabel}.` : '',
    'Transforme-se hoje ✨',
  ]
    .filter(Boolean)
    .join(' ')
}

export const privacyPoints = [
  'Sem cadastro ou pagamento neste site.',
  'Contatos publicados: Instagram, WhatsApp e e-mail da profissional.',
  'Fotos de procedimentos extraídas do perfil oficial ou publicadas com permissão implícita do feed.',
  'Sem depoimentos ou preços inventados.',
] as const
