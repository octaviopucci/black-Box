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
  whatsapp: '5515997532764',
  whatsappMessage:
    'Olá! Gostaria de agendar uma Calorimetria Indireta com o Dr. Marcelo Prado.',
  media: {
    heroVideo: 'hero-calorimetria.mp4',
    heroPoster: 'hero-calorimetria-poster.jpg',
    vsMontage: 'vs-calculadora-aparelho.webp',
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

export type EnergyBridgeTopic = {
  lead: string
  body: string
  highlight?: string
}

export const energyBridgeTopics: EnergyBridgeTopic[] = [
  {
    lead: 'E tem mais…',
    body: 'Além da sua taxa metabólica basal, que corresponde à quantidade de energia necessária para manter suas funções vitais em repouso.',
    highlight: 'taxa metabólica basal',
  },
  {
    lead: 'Te mostra também…',
    body: 'Com esse cálculo sabemos quanto ele está usando de gordura e carboidratos para produzir energia. Será que seu corpo está realmente queimando gordura como deveria?',
    highlight: 'eficiência energética do organismo',
  },
  {
    lead: 'E não para por aí…',
    body: 'Te apresenta uma estimativa de gasto calórico para diversas atividades físicas.',
  },
]

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
    description: 'Exame analisado pelo médico, que elabora o laudo e te envia.',
  },
]

export const readoutIntro =
  'Exame analisado pelo médico, que elabora o laudo e te envia — com taxa metabólica basal, eficiência energética e estimativa de gasto em diversas atividades.'

export type Audience = {
  title: string
  description: string
}

export const audiences: Audience[] = [
  {
    title: 'Emagrecimento e composição corporal',
    description:
      'Quem está na luta por um corpo melhor e mais saudável sabe que cada caloria conta. Busque o melhor, não perca tempo com cálculos superficiais. Ajuste o plano ao seu metabolismo, não ao de uma média populacional como é feito com essas fórmulas.',
  },
  {
    title: 'Performance e hipertrofia',
    description:
      'Para quem treina com objetivo claro, conhecer o consumo real de energia orienta ajustes finos de dieta, intensidade e periodização. Saber quanto seu corpo queima em repouso ajuda a calibrar superávit, distribuição de macros e recuperação para ganho de massa com precisão.',
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
    a: 'Pelo WhatsApp. Informe se prefere Capão Bonito ou Itapeva e o motivo da avaliação.',
  },
]

export function whatsappUrl(message = site.whatsappMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
}

export function bookingUrl() {
  return whatsappUrl()
}

export function asset(path: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
