export const site = {
  name: 'Clínica DNA',
  shortName: 'DNA',
  tagline: 'conectando vidas',
  headline: 'Cuidamos de você em cada detalhe',
  description:
    'Clínica multidisciplinar em Capão Bonito. Um espaço onde especialidades se encontram para cuidar de você e da sua família — com escuta, precisão e presença.',
  since: 2016,
  instagram: 'https://www.instagram.com/clinicadnacb',
  instagramHandle: '@clinicadnacb',
  cnpj: '24.995.674/0001-31',
  address: 'Rua Floriano Peixoto, 299 — Centro — Capão Bonito/SP',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Floriano+Peixoto,+299,+Centro,+Cap%C3%A3o+Bonito+SP',
  hours: 'Segunda a sexta · 08:30 às 19:00',
  phone: {
    label: '(15) 99852-2020',
    href: 'tel:+5515998522020',
  },
  whatsapp: {
    number: '5515998522020',
    message: 'Olá! Vim pelo site da Clínica DNA e gostaria de agendar um atendimento.',
  },
  manifesto: [
    'Saúde não começa no consultório.',
    'Começa no instante em que alguém decide cuidar.',
    'A DNA existe para conectar esse instante à presença certa.',
  ],
  story: [
    'Desde 2016, a Clínica DNA acompanha famílias de Capão Bonito com um cuidado que une especialidades sob o mesmo teto.',
    'Nosso nome carrega a essência: o DNA do cuidado é a conexão. Entre pessoas. Entre fases da vida. Entre quem precisa e quem sabe ouvir.',
  ],
  whispers: [
    {
      text: 'Minha filha chega sorrindo. Isso diz tudo sobre o acolhimento da DNA.',
      who: 'Camila · mãe',
    },
    {
      text: 'Saí da consulta com clareza. Sem pressa. Sem ruído.',
      who: 'Roberto · paciente',
    },
    {
      text: 'Agendar pelo WhatsApp e ser atendida com atenção real — raro e necessário.',
      who: 'Juliana · paciente',
    },
  ],
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
    id: 'pediatria',
    title: 'Pediatria',
    line: 'Crescer com quem acompanha',
    detail:
      'Do primeiro mês à adolescência: rotina, desenvolvimento e orientação aos pais com calma e presença.',
    image: `${import.meta.env.BASE_URL}pediatria.jpg`,
  },
  {
    id: 'medicina',
    title: 'Clínica médica',
    line: 'O dia a dia sob cuidado',
    detail:
      'Avaliação completa, prevenção e acompanhamento — tempo para entender o que o corpo pede.',
    image: `${import.meta.env.BASE_URL}medicina.jpg`,
  },
  {
    id: 'neurologia',
    title: 'Neurologia',
    line: 'Precisão que acolhe',
    detail:
      'Investigação atenta de sintomas e planos claros, sem pressa e sem mistério.',
    image: `${import.meta.env.BASE_URL}neurologia.jpg`,
  },
  {
    id: 'odontologia',
    title: 'Odontologia',
    line: 'Sorrir com confiança',
    detail:
      'Prevenção e tratamento em um ambiente que respeita o ritmo de cada idade.',
    image: `${import.meta.env.BASE_URL}odontologia.jpg`,
  },
  {
    id: 'procedimentos',
    title: 'Vacinas & procedimentos',
    line: 'Prevenir é cuidar',
    detail:
      'Vacinação e procedimentos ambulatoriais com segurança, higiene e acompanhamento próximo.',
    image: `${import.meta.env.BASE_URL}hero-family.jpg`,
  },
]

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}

export function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
