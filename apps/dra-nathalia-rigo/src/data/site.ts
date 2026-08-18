export const brand = {
  name: 'Dra. Nathalia Rigo',
  short: 'Nathalia Rigo',
  tagline: 'Estética Avançada',
  subtitle: 'Criolipólise · Sorocaba',
  profession: 'Enfermeira esteta',
  city: 'Sorocaba',
  neighborhood: 'Parque São Bento',
  experienceYears: 12,
  instagramHandle: 'dranathaliarigo',
  instagramUrl: 'https://www.instagram.com/dranathaliarigo',
  instagramDm: 'https://ig.me/m/dranathaliarigo',
  cta: 'Transforme-se hoje',
  bioLines: [
    'Realçar sua beleza com resultados naturais e sofisticados.',
    'Enf. · 12 anos de experiência',
    'Sorocaba',
  ] as const,
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua%20Izidro%20Roque%20da%20Silva%20Telo%2C%2035%2C%20Parque%20S%C3%A3o%20Bento%2C%20Sorocaba%20SP',
  address: {
    street: 'Rua Izidro Roque da Silva Telo, 35',
    complement: 'Piso superior',
    district: 'Parque São Bento',
    city: 'Sorocaba',
    state: 'SP',
  },
  hoursNote: 'Horário publicado: 9h às 18h. Confirme pelo Instagram antes de ir.',
} as const

export const nav = [
  { to: '/', label: 'Início' },
  { to: '/procedimentos', label: 'Procedimentos' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
] as const

export const procedures = [
  {
    slug: 'criolipolise',
    name: 'Criolipólise',
    area: 'Corporal',
    lead: 'Contorno com tecnologia de resfriamento controlado.',
    body: 'Procedimento publicado no perfil da Dra. Nathalia para gordura localizada. A indicação e o plano saem na avaliação de enfermagem — não no direct, nem num catálogo genérico.',
  },
  {
    slug: 'preenchimento-labial',
    name: 'Preenchimento labial',
    area: 'Facial',
    lead: 'Volume e desenho que respeitam a sua boca.',
    body: 'Realce natural e sofisticado — a mesma linha da bio do Instagram. Sem exageros. Avaliação antes de qualquer aplicação.',
  },
  {
    slug: 'epilacao-a-laser',
    name: 'Epilação a laser',
    area: 'Pele',
    lead: 'Redução progressiva do pelo, sessão a sessão.',
    body: 'Tratamento publicado no espaço, com protocolo definido na consulta. Pele, região e expectativa são lidas antes de começar.',
  },
] as const

export const highlights = [
  { label: 'Estética avançada', detail: 'Atendimento com base em enfermagem e protocolo.' },
  { label: '12 anos', detail: 'Experiência publicada no Instagram da profissional.' },
  { label: 'Sorocaba', detail: 'Parque São Bento — consultório no piso superior.' },
  { label: 'Natural', detail: 'Resultados naturais e sofisticados — frase oficial da bio.' },
] as const

export const objections = [
  {
    q: 'A Dra. Nathalia é médica?',
    a: 'Não. É enfermeira esteta. Em estética avançada, o título “Dra.” acompanha a graduação em Enfermagem. Consulta, anamnese e registro fazem parte do cuidado.',
  },
  {
    q: 'Como agendo?',
    a: 'Pelo Instagram @dranathaliarigo. Toque em “Transforme-se hoje” na bio ou envie direct — é o canal publicado pela profissional.',
  },
  {
    q: 'O resultado fica artificial?',
    a: 'A promessa publicada é outra: realçar com naturalidade e sofisticação. Se busca exagero visível, este não é o perfil.',
  },
  {
    q: 'Onde fica o consultório?',
    a: 'Rua Izidro Roque da Silva Telo, 35, piso superior — Parque São Bento, Sorocaba.',
  },
] as const

export const protocolChoices = {
  interest: [
    { id: 'criolipolise', label: 'Criolipólise' },
    { id: 'labial', label: 'Preenchimento labial' },
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
  'Sem cadastro, pagamento ou formulário neste site.',
  'Agendamento apenas pelo Instagram @dranathaliarigo.',
  'Sem depoimentos, COREN, preços ou resultados inventados.',
] as const
