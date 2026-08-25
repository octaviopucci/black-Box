export const site = {
  name: 'Dr. Marcelo Prado',
  fullName: 'Marcelo Prado de Oliveira Junior',
  specialty: 'Endocrinologia Aplicada',
  crm: 'CRM 240129/SP',
  examName: 'Calorimetria Indireta',
  examTagline: 'O melhor exame para avaliar seu metabolismo',
  headline: 'O seu metabolismo não se estima. Se mede.',
  support:
    'Um exame de respiração de 15 minutos que substitui fórmulas genéricas por uma medida real e individual do seu gasto energético.',
  description:
    'Exame de Calorimetria Indireta com o Dr. Marcelo Prado — Endocrinologia Aplicada. Meça sua Taxa Metabólica Basal com precisão e leve isso para o seu plano de emagrecimento ou modulação hormonal. Capão Bonito e Itapeva/SP.',
  instagram: 'https://www.instagram.com/dr.marceloprado',
  instagramHandle: '@dr.marceloprado',
  linktree: 'https://linktr.ee/dr.marceloprado',
  media: {
    scrubVideo: 'calorimetria-scrub.mp4',
    scrubPoster: 'calorimetria-poster.jpg',
  },
  locations: [
    {
      id: 'capao',
      city: 'Capão Bonito/SP',
      address: 'Rua Dona Auta de Camargo Lírio, 51 — Centro — Capão Bonito/SP, 18300-230',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Rua+Dona+Auta+de+Camargo+Lirio,+51,+Centro,+Capao+Bonito+SP',
    },
    {
      id: 'itapeva',
      city: 'Itapeva/SP',
      address: 'R. Flausino Antunes, 146 — Centro — Itapeva/SP',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Rua+Flausino+Antunes,+146,+Centro,+Itapeva+SP',
    },
  ],
  about: [
    'Médico com CRM 240129/SP, o Dr. Marcelo Prado atua em endocrinologia aplicada com foco em emagrecimento e modulação hormonal — unindo ciência clínica e escuta real.',
    'A Calorimetria Indireta entrou no consultório como uma ferramenta a mais: em vez de estimar seu gasto calórico por fórmulas populacionais, ela mede as trocas gasosas da sua própria respiração para calcular, com precisão, quanto o seu corpo realmente queima.',
  ],
} as const

export type Problem = {
  line: string
  emphasis?: boolean
}

export const problemLines: Problem[] = [
  { line: 'Fórmulas de gasto calórico existem há décadas.' },
  { line: 'Elas usam idade, peso e altura para chutar uma média.' },
  { line: 'Mas nenhum metabolismo é uma média.' },
  { line: 'As fórmulas que estimam o gasto calórico ficaram ultrapassadas.', emphasis: true },
  { line: 'A calculadora ficou no passado.', emphasis: true },
]

export type Step = {
  step: string
  title: string
  description: string
}

export const journey: Step[] = [
  {
    step: '01',
    title: 'Preparo simples',
    description:
      'Sem jejum extremo, sem procedimento invasivo. Você se acomoda, em repouso, para que sua respiração reflita seu metabolismo real.',
  },
  {
    step: '02',
    title: 'Leitura respiratória',
    description:
      'Por cerca de 15 minutos, um analisador metabólico portátil mede o oxigênio consumido e o CO₂ produzido a cada respiração — as trocas gasosas que definem seu gasto de energia.',
  },
  {
    step: '03',
    title: 'Laudo no mesmo atendimento',
    description:
      'O resultado é processado ali, na consulta. O Dr. Marcelo interpreta os números e transforma isso em conduta: plano alimentar, treino ou modulação hormonal.',
  },
]

export type Metric = {
  code: string
  label: string
  value: string
  unit?: string
  description: string
}

export const metrics: Metric[] = [
  {
    code: 'TMB',
    label: 'Taxa Metabólica Basal',
    value: '1.390',
    unit: 'kcal/dia',
    description: 'A energia que o seu corpo precisa só para manter as funções vitais em repouso, em 24 horas.',
  },
  {
    code: 'GET',
    label: 'Gasto Energético Total',
    value: '2.502',
    unit: 'kcal/dia',
    description: 'Quanto você gasta no seu dia real, somando a taxa basal à sua rotina e atividade física.',
  },
  {
    code: 'RQ',
    label: 'Quociente Respiratório',
    value: '0,78',
    description: 'A relação entre CO₂ produzido e O₂ consumido — revela se seu corpo está priorizando gordura ou carboidrato como combustível.',
  },
  {
    code: 'VO₂',
    label: 'Consumo de oxigênio em repouso',
    value: '3,25',
    unit: 'ml/kg·min',
    description: 'O volume de oxigênio que seu corpo consome em repouso — a base fisiológica de todo o cálculo.',
  },
  {
    code: 'Ve',
    label: 'Ventilação por minuto',
    value: '7,25',
    unit: 'l/min',
    description: 'O volume de ar movimentado pela sua respiração a cada minuto durante o exame.',
  },
]

export const fuelSplit = {
  fat: 73.7,
  carbs: 26.3,
}

export type Audience = {
  title: string
  description: string
}

export const audiences: Audience[] = [
  {
    title: 'Emagrecimento e composição corporal',
    description:
      'Quando a dieta e o treino não avançam como deveriam, medir o gasto real evita dietas "no escuro" e ajusta o plano ao seu metabolismo — não ao de uma média populacional.',
  },
  {
    title: 'Modulação hormonal',
    description:
      'Testosterona, menopausa e metabolismo caminham juntos. Saber sua taxa basal real ajuda a calibrar cada etapa da modulação com mais precisão.',
  },
  {
    title: 'Performance e hipertrofia',
    description:
      'Para quem treina com objetivo claro, conhecer o consumo real de gordura e carboidrato em repouso orienta ajustes finos de dieta e periodização.',
  },
]

export const faqs = [
  {
    q: 'O exame dói ou é desconfortável?',
    a: 'Não. É um exame de respiração, indolor: você permanece em repouso, sentado, respirando através de um bucal ou máscara conectada ao analisador metabólico.',
  },
  {
    q: 'Quanto tempo dura?',
    a: 'Em torno de 15 minutos de coleta, dentro da própria consulta — sem necessidade de outro dia ou outro deslocamento.',
  },
  {
    q: 'Por que medir em vez de estimar por fórmula?',
    a: 'Fórmulas como as clássicas de gasto calórico foram construídas a partir de médias populacionais. A Calorimetria Indireta mede as trocas gasosas da sua respiração e calcula o seu número real — não uma estimativa genérica.',
  },
  {
    q: 'Onde o exame é realizado?',
    a: 'Presencialmente com o Dr. Marcelo Prado, em Capão Bonito (Rua Dona Auta de Camargo Lírio, 51) ou em Itapeva (R. Flausino Antunes, 146).',
  },
  {
    q: 'Como agendar?',
    a: 'Pelo Instagram @dr.marceloprado ou pelo Linktree. Informe se prefere Capão Bonito ou Itapeva e o motivo da avaliação.',
  },
]

export function bookingUrl() {
  return site.linktree
}

export function asset(path: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
