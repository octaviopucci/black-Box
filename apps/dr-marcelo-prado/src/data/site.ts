export const site = {
  name: 'Dr. Marcelo Prado',
  shortName: 'MP',
  fullName: 'Marcelo Prado de Oliveira Junior',
  specialty: 'Endocrinologia Aplicada',
  crm: 'CRM 240129/SP',
  tagline: 'emagrecimento e modulação hormonal',
  headline: 'Saúde, corpo e autoestima — calibrados para você.',
  description:
    'Dr. Marcelo Prado — Endocrinologia Aplicada. Emagrecimento e modulação hormonal com métodos personalizados. Consultas presenciais em Capão Bonito e Itapeva, e atendimento on-line. CRM 240129/SP.',
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
    'Médico CRM 240129/SP, o Dr. Marcelo Prado atua em endocrinologia aplicada com foco em emagrecimento e modulação hormonal — unindo ciência clínica e escuta real.',
    'No consultório e no acompanhamento on-line, cada protocolo nasce do seu histórico, dos seus exames e do que o seu corpo precisa agora: energia, composição, libido, ossos, menopausa ou performance.',
    'Parceiro médico do Projeto 120 Dias Korpen e referência em protocolos de modulação, incluindo o Protocolo Harmonie — acompanhamento integral com exames e suporte especializado.',
  ],
  whispers: [
    {
      text: 'Pela primeira vez entendi meus exames sem medo. Saí com um plano claro de modulação — e energia de verdade.',
      who: 'Paciente · modulação hormonal',
    },
    {
      text: 'Emagrecimento com condução médica séria. Sem milagre, com método — e resultado que se sustenta.',
      who: 'Paciente · emagrecimento',
    },
    {
      text: 'A teleconsulta manteve o ritmo do tratamento mesmo de outra cidade. Atento, humano e objetivo.',
      who: 'Paciente · menopausa',
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
      'Desenvolvido para potencializar resultados com suporte especializado, exames padrão-ouro e acesso a métodos modernos de modulação — incluindo implante subcutâneo quando clinicamente indicado.',
    points: [
      'Avaliação hormonal completa',
      'Plano personalizado e contínuo',
      'Implante subcutâneo quando indicado',
      'Foco em equilíbrio e qualidade de vida',
    ],
  },
  korpen: {
    title: 'Projeto 120 Dias Korpen',
    description:
      'Parceiro médico do Projeto 120 Dias Korpen — transformação com endocrinologia, nutrição, psicologia e treinamento integrados.',
  },
} as const

export type CarePath = {
  id: string
  title: string
  line: string
  detail: string
  image: string
  signals: string[]
}

export const carePaths: CarePath[] = [
  {
    id: 'testosterona',
    title: 'Testosterona',
    line: 'Disposição · força · libido',
    detail:
      'Cansaço, queda de libido, perda de força e desânimo podem ser sinais — mas nem sempre o problema é só “falta de hormônio”. Investigação precisa e conduta individualizada.',
    image: `${import.meta.env.BASE_URL}care-testo.jpg`,
    signals: ['Energia', 'Libido', 'Massa muscular', 'Humor'],
  },
  {
    id: 'menopausa',
    title: 'Menopausa',
    line: 'Reposição com critério',
    detail:
      'Ondas de calor, insônia, irritabilidade e mudanças no corpo não precisam ser sinônimo de sofrimento. Reposição hormonal bem indicada e individualizada.',
    image: `${import.meta.env.BASE_URL}care-meno.jpg`,
    signals: ['Fogachos', 'Sono', 'Humor', 'Ossos'],
  },
  {
    id: 'emagrecimento',
    title: 'Emagrecimento',
    line: 'Além da balança',
    detail:
      'Quando a dieta e a academia não bastam para a gordura localizada e a flacidez, entram protocolos clínicos avançados — com foco em composição e autoestima.',
    image: `${import.meta.env.BASE_URL}care-body.jpg`,
    signals: ['Composição', 'Flacidez', 'Metabolismo', 'Autoestima'],
  },
  {
    id: 'osteoporose',
    title: 'Osteoporose',
    line: 'Ossos que não avisam',
    detail:
      'Doença silenciosa: muitas pessoas só descobrem após uma fratura. Diagnóstico precoce e estratégias para preservar massa óssea e qualidade de vida.',
    image: `${import.meta.env.BASE_URL}care-osso.jpg`,
    signals: ['Prevenção', 'Massa óssea', 'Vitamina D', 'Risco'],
  },
  {
    id: 'implante',
    title: 'Implante',
    line: 'Modulação consistente',
    detail:
      'Método moderno, seguro e eficaz para quem busca resultados consistentes na modulação hormonal — sempre com avaliação clínica prévia.',
    image: `${import.meta.env.BASE_URL}care-implante.jpg`,
    signals: ['Consistência', 'Conforto', 'Acompanhamento', 'Resultado'],
  },
]

export function bookingUrl() {
  return site.linktree
}

export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
