export const site = {
  name: 'Dr. Marcelo Prado',
  fullName: 'Marcelo Prado de Oliveira Junior',
  specialty: 'Endocrinologia Aplicada',
  crm: 'CRM 240129/SP',
  examName: 'Calorimetria Indireta',
  examTagline: 'O melhor exame para avaliar seu metabolismo',
  headline: 'O seu metabolismo não se estima. Se mede.',
  support:
    'Um exame de respiração de 20 a 30 minutos que substitui fórmulas genéricas por uma medida real e individual do seu gasto energético.',
  description:
    'Exame de Calorimetria Indireta com o Dr. Marcelo Prado — Endocrinologia Aplicada. Meça sua Taxa Metabólica Basal com precisão e leve isso para o seu plano de emagrecimento ou modulação hormonal. Capão Bonito e Itapeva/SP.',
  instagram: 'https://www.instagram.com/dr.marceloprado',
  instagramHandle: '@dr.marceloprado',
  linktree: 'https://linktr.ee/dr.marceloprado',
  media: {
    scrubVideo: 'calorimetria-scrub.mp4',
    scrubPoster: 'calorimetria-poster.jpg',
    scrubMobilePoster: 'calorimetria-poster-mobile.jpg',
    scrubMobileFrameCount: 81,
    scrubMobileFrameDir: 'scrub-frames-mobile',
    vsMontage: 'vs-calculadora-aparelho.jpg',
    devicePhoto: 'aparelho-vo2master.jpg',
    reportSample: 'laudo-graficos.jpg',
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
    'E se você quiser passar em consulta com o Dr. Marcelo, para ele apresentar pessoalmente seu resultado e tratar de outras questões da sua saúde, além de realizar o teste de força muscular e suas medidas corporais, você terá condições especiais.',
  ],
} as const

export const energyBridge =
  'E tem mais… Essas fórmulas não te mostram como está a eficiência energética do seu organismo. Será que ele está usando gordura como deveria?'

export const audienceIntro =
  'Quando a dieta e o treino parecem não trazer resultados, o que pode estar faltando são parâmetros exatos — para fazer ajustes personalizados para você.'

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
      'Por cerca de 20 a 30 minutos, um analisador metabólico portátil mede o oxigênio consumido e o CO₂ produzido a cada respiração — as trocas gasosas que definem seu gasto de energia.',
  },
  {
    step: '03',
    title: 'Laudo no mesmo atendimento',
    description:
      'Exame analisado pelo médico, que elabora o laudo e te envia. Assim você terá acesso a quanto seu corpo gasta de energia durante o dia, sua eficiência energética e estimativa de gasto em diversas atividades.',
  },
]

export const readoutIntro =
  'Exame analisado pelo médico, que elabora o laudo e te envia. Assim você terá acesso a quanto seu corpo gasta de energia durante o dia, sua eficiência energética e estimativa de gasto energético em diversas atividades.'

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
    title: 'Performance',
    description:
      'Para quem treina com objetivo claro, conhecer o consumo real de energia orienta ajustes finos de dieta, intensidade e periodização.',
  },
  {
    title: 'Hipertrofia',
    description:
      'Saber quanto seu corpo queima em repouso ajuda a calibrar superávit, distribuição de macros e recuperação para ganho de massa com precisão.',
  },
]

export const faqs = [
  {
    q: 'O exame dói ou é desconfortável?',
    a: 'Não. É um exame de respiração, indolor: você permanece em repouso, sentado, respirando através de um bucal ou máscara conectada ao analisador metabólico.',
  },
  {
    q: 'Quanto tempo dura?',
    a: 'De 20 a 30 minutos de coleta, dentro da própria consulta — sem necessidade de outro dia ou outro deslocamento.',
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

export function scrubMobileFramePaths() {
  return Array.from({ length: site.media.scrubMobileFrameCount }, (_, i) =>
    asset(`${site.media.scrubMobileFrameDir}/frame-${String(i + 1).padStart(3, '0')}.jpg`),
  )
}
