export const site = {
  name: 'Dr. Marcelo Prado',
  shortName: 'MP',
  specialty: 'Endocrinologia Aplicada',
  crm: 'CRM 240129/SP',
  tagline: 'modulação com precisão',
  headline: 'Saúde, corpo e autoestima — calibrados',
  description:
    'Endocrinologia aplicada com foco em emagrecimento e modulação hormonal. Capão Bonito, Itapeva e on-line. CRM 240129/SP.',
  promise: 'Cuido da sua saúde, corpo e autoestima com métodos personalizados.',
  instagram: 'https://www.instagram.com/dr.marceloprado',
  instagramHandle: '@dr.marceloprado',
  linktree: 'https://linktr.ee/dr.marceloprado',
  manifesto: [
    'Hormônios não se adivinham.',
    'Eles se calibram — com escuta, método e presença.',
    'Emagrecimento e modulação, no ritmo do seu corpo.',
  ],
  story: [
    'Médico CRM 240129/SP, o Dr. Marcelo Prado conduz a endocrinologia aplicada para além do jargão: testosterona, menopausa, metabolismo, ossos e composição — traduzidos em planos claros.',
    'Presencial em Capão Bonito e Itapeva, e on-line para quem precisa de continuidade. Parceiro do Projeto 120 Dias Korpen e do Protocolo Harmonie.',
  ],
  whispers: [
    {
      text: 'Pela primeira vez entendi meus exames sem medo. Saí com um plano claro — e energia de verdade.',
      who: 'Paciente · modulação',
    },
    {
      text: 'Emagrecimento com condução médica séria. Sem milagre. Com método.',
      who: 'Paciente · composição',
    },
    {
      text: 'A teleconsulta manteve o ritmo do tratamento. Atento, humano, objetivo.',
      who: 'Paciente · on-line',
    },
  ],
  locations: [
    {
      city: 'Capão Bonito/SP',
      address: 'Rua Dona Auta de Camargo Lírio, 51 — Centro',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Rua+Dona+Auta+de+Camargo+Lirio,+51,+Centro,+Capao+Bonito+SP',
    },
    {
      city: 'Itapeva/SP',
      address: 'R. Flausino Antunes, 146 — Centro',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Rua+Flausino+Antunes,+146,+Centro,+Itapeva+SP',
    },
  ],
  protocolo: {
    title: 'Protocolo Harmonie',
    line: 'Acompanhamento integral',
    detail:
      'Modulação com suporte especializado, exames de referência e métodos modernos — incluindo implante subcutâneo quando indicado.',
  },
} as const

export type CarePath = {
  id: string
  title: string
  line: string
  detail: string
  image: string
}

export const carePaths: CarePath[] = [
  {
    id: 'testosterona',
    title: 'Testosterona',
    line: 'Disposição · força · libido',
    detail:
      'Cansaço, queda de libido e perda de força podem ser sinais — mas a leitura precisa vai além do “hormônio baixo”.',
    image: `${import.meta.env.BASE_URL}care-testo.jpg`,
  },
  {
    id: 'menopausa',
    title: 'Menopausa',
    line: 'Reposição com critério',
    detail:
      'Fogachos, insônia e mudanças no corpo não precisam ser sofrimento. Reposição individualizada, quando indicada.',
    image: `${import.meta.env.BASE_URL}care-meno.jpg`,
  },
  {
    id: 'emagrecimento',
    title: 'Emagrecimento',
    line: 'Além da balança',
    detail:
      'Quando dieta e academia não bastam para composição e flacidez, entra a condução clínica personalizada.',
    image: `${import.meta.env.BASE_URL}care-body.jpg`,
  },
  {
    id: 'osteoporose',
    title: 'Osteoporose',
    line: 'Ossos que não avisam',
    detail:
      'Doença silenciosa. Diagnóstico precoce e estratégias para preservar massa óssea e qualidade de vida.',
    image: `${import.meta.env.BASE_URL}care-osso.jpg`,
  },
  {
    id: 'implante',
    title: 'Implante',
    line: 'Modulação consistente',
    detail:
      'Método moderno para resultados consistentes na modulação hormonal — sempre com avaliação clínica prévia.',
    image: `${import.meta.env.BASE_URL}care-implante.jpg`,
  },
]

export function bookingUrl() {
  return site.linktree
}

export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
