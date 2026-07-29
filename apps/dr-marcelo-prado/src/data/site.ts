export const site = {
  name: 'Dr. Marcelo Prado',
  shortName: 'MP',
  specialty: 'Endocrinologia Aplicada',
  crm: 'CRM 240129/SP',
  tagline: 'Sinais em equilíbrio',
  headline: 'Hormônios em equilíbrio. Vida em movimento.',
  description:
    'Endocrinologia aplicada em Itapeva/SP — consultas presenciais e on-line com foco em metabolismo, tireoide, emagrecimento e qualidade de vida. CRM 240129/SP.',
  since: 2024,
  instagram: 'https://www.instagram.com/dr.marceloprado',
  instagramHandle: '@dr.marceloprado',
  linktree: 'https://linktr.ee/dr.marceloprado',
  about: [
    'A endocrinologia aplicada começa onde a teoria encontra o seu dia a dia: sono, energia, peso, humor e o ritmo invisível dos hormônios.',
    'O Dr. Marcelo Prado conduz consultas presenciais em Itapeva e atendimento on-line para quem busca clareza diagnóstica, plano terapêutico e acompanhamento contínuo.',
    'Menos jargão. Mais escuta. Condutas baseadas em evidência, traduzidas em decisões práticas para a sua saúde.',
  ],
  mission:
    'Traduzir a complexidade hormonal em cuidado claro, próximo e aplicável — para você recuperar energia, equilíbrio e confiança no próprio corpo.',
  address: 'R. Flausino Antunes, 146 — Centro — Itapeva/SP',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Flausino+Antunes,+146,+Centro,+Itapeva+SP',
  city: 'Itapeva/SP',
  modalities: [
    {
      id: 'presencial',
      title: 'Consulta presencial',
      description:
        'Avaliação completa no consultório em Itapeva — escuta atenta, exame clínico e plano personalizado.',
      detail: 'Centro · Itapeva/SP',
    },
    {
      id: 'online',
      title: 'Consulta on-line',
      description:
        'Acompanhamento à distância com a mesma precisão clínica — ideal para retornos e orientação contínua.',
      detail: 'Teleconsulta · Brasil',
    },
  ],
  nav: [
    { label: 'Abordagem', href: '#abordagem' },
    { label: 'Cuidados', href: '#cuidados' },
    { label: 'Jornada', href: '#jornada' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Agendar', href: '#agendar' },
  ],
  principles: [
    {
      title: 'Escuta antes da conduta',
      description: 'Sua história clínica vem primeiro. O plano nasce da escuta, não de um protocolo genérico.',
    },
    {
      title: 'Evidência traduzida',
      description: 'Ciência sem pedantismo: o que importa é o que você entende e consegue aplicar.',
    },
    {
      title: 'Acompanhamento vivo',
      description: 'Hormônios mudam. O cuidado também — ajustes finos ao longo do caminho.',
    },
  ],
  journey: [
    {
      step: '01',
      title: 'O sinal',
      description:
        'Você chega com sintomas, dúvidas ou exames. Começamos mapeando o que o corpo está tentando dizer.',
    },
    {
      step: '02',
      title: 'A leitura',
      description:
        'Avaliação clínica completa, correlação laboratorial e conversa clara sobre hipóteses e prioridades.',
    },
    {
      step: '03',
      title: 'A resposta',
      description:
        'Plano terapêutico aplicável: tratamento, hábitos e retornos — com acompanhamento presencial ou on-line.',
    },
  ],
  proof: [
    { value: 'CRM', label: '240129/SP · Endocrinologia' },
    { value: '2', label: 'Modalidades · presencial e on-line' },
    { value: 'Itapeva', label: 'Atendimento no Centro' },
    { value: '1.9K+', label: 'Pessoas conectadas no Instagram' },
  ],
  testimonials: [
    {
      quote:
        'Pela primeira vez entendi o que os exames estavam dizendo. Saí da consulta com um plano claro — sem medo, sem confusão.',
      name: 'Paciente · Tireoide',
      role: 'Consulta presencial',
    },
    {
      quote:
        'O acompanhamento on-line manteve o ritmo do tratamento mesmo morando em outra cidade. Prático e muito atento.',
      name: 'Paciente · Metabolismo',
      role: 'Teleconsulta',
    },
    {
      quote:
        'Emagrecimento com orientação hormonal séria. Sem milagre, com método — e resultado que se sustenta.',
      name: 'Paciente · Peso e energia',
      role: 'Acompanhamento contínuo',
    },
  ],
  faqs: [
    {
      q: 'Como agendar uma consulta?',
      a: 'Pelo Instagram @dr.marceloprado ou pelo Linktree. Informe se prefere presencial em Itapeva ou on-line e a equipe orienta os próximos passos.',
    },
    {
      q: 'O que é endocrinologia aplicada?',
      a: 'É a endocrinologia voltada à prática do dia a dia: metabolismo, tireoide, hormônios, peso e energia — com condutas claras e acompanhamento próximo.',
    },
    {
      q: 'Atende presencial e on-line?',
      a: 'Sim. Consultas presenciais em Itapeva/SP (R. Flausino Antunes, 146 — Centro) e teleconsultas para quem precisa de flexibilidade.',
    },
    {
      q: 'Quais temas o Dr. Marcelo acompanha?',
      a: 'Tireoide, metabolismo e diabetes, emagrecimento com base hormonal, fadiga e energia, climaterio/andropausa e investigação de desequilíbrios endócrinos.',
    },
  ],
} as const

export type CareArea = {
  id: string
  title: string
  short: string
  description: string
  image: string
  signals: string[]
}

export const careAreas: CareArea[] = [
  {
    id: 'tireoide',
    title: 'Tireoide',
    short: 'O ritmo do metabolismo',
    description:
      'Hipotireoidismo, hipertireoidismo e nódulos — investigação precisa e ajuste fino para recuperar o equilíbrio.',
    image: `${import.meta.env.BASE_URL}thyroid.jpg`,
    signals: ['Fadiga', 'Peso', 'Humor', 'Temperatura'],
  },
  {
    id: 'metabolismo',
    title: 'Metabolismo & diabetes',
    short: 'Energia sob controle',
    description:
      'Glicemia, resistência à insulina e metabolismo basal com plano clínico e hábitos que cabem na sua rotina.',
    image: `${import.meta.env.BASE_URL}metabolism.jpg`,
    signals: ['Glicemia', 'Insulina', 'Energia', 'Prevenção'],
  },
  {
    id: 'peso',
    title: 'Peso & composição',
    short: 'Emagrecimento com método',
    description:
      'Além da balança: hormônios, sono, inflamação e comportamento alimentar em um caminho sustentável.',
    image: `${import.meta.env.BASE_URL}lifestyle.jpg`,
    signals: ['Composição', 'Apetite', 'Sono', 'Sustentação'],
  },
  {
    id: 'hormonios',
    title: 'Equilíbrio hormonal',
    short: 'Sinais que se conversam',
    description:
      'Climatério, andropausa, cortisol e eixo hormonal — cuidado individualizado para cada fase da vida.',
    image: `${import.meta.env.BASE_URL}hormones.jpg`,
    signals: ['Climatério', 'Andropausa', 'Cortisol', 'Libido'],
  },
]

export function bookingUrl() {
  return site.linktree
}

export function asset(path: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
