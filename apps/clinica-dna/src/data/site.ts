export const site = {
  name: 'Clínica DNA',
  shortName: 'DNA',
  legalName: 'Calsone Consultas Ltda',
  tagline: 'Conectando vidas',
  headline: 'Cuidamos de você em cada detalhe',
  description:
    'Clínica multidisciplinar em Capão Bonito/SP. Atendimento humano, preciso e acolhedor — da pediatria à odontologia — com a confiança de quem coloca a sua saúde no centro.',
  since: 2016,
  instagram: 'https://www.instagram.com/clinicadnacb',
  instagramHandle: '@clinicadnacb',
  cnpj: '24.995.674/0001-31',
  about: [
    'A Clínica DNA nasceu para conectar cuidado, ciência e acolhimento em Capão Bonito. Cada consulta é pensada no detalhe — porque saúde de verdade começa na escuta.',
    'Somos uma clínica multidisciplinar: pediatria, medicina, neurologia, odontologia e procedimentos, com uma equipe dedicada a acompanhar você e sua família em todas as fases da vida.',
    'Nosso nome carrega a essência: o DNA do cuidado. Conexão entre pessoas, confiança no atendimento e presença em cada etapa do seu bem-estar.',
  ],
  mission:
    'Oferecer cuidado clínico de excelência com empatia, clareza e proximidade — conectando vidas através da saúde.',
  address: 'Rua Floriano Peixoto, 299 — Centro — Capão Bonito/SP, 18300-005',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Floriano+Peixoto,+299,+Centro,+Cap%C3%A3o+Bonito+SP',
  hours: {
    weekdays: 'Segunda a sexta · 08:30 às 19:00',
    weekend: 'Sábados e feriados · sob agendamento',
  },
  phones: [
    {
      label: '(15) 99852-2020',
      href: 'tel:+5515998522020',
      role: 'WhatsApp · Agendamentos',
      whatsapp: true,
    },
  ],
  whatsapp: {
    number: '5515998522020',
    message: 'Olá! Vim pelo site da Clínica DNA e gostaria de agendar um atendimento.',
  },
  nav: [
    { label: 'Especialidades', href: '#especialidades' },
    { label: 'Cuidado', href: '#cuidado' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Contato', href: '#contato' },
  ],
  values: [
    {
      title: 'Escuta atenta',
      description: 'Cada história importa. Começamos ouvindo — e só então orientamos.',
    },
    {
      title: 'Precisão clínica',
      description: 'Condutas claras, acompanhamento contínuo e decisões baseadas em evidência.',
    },
    {
      title: 'Acolhimento real',
      description: 'Ambiente sereno e equipe presente para você se sentir seguro do primeiro contato.',
    },
    {
      title: 'Família no centro',
      description: 'Do bebê ao adulto: cuidado integrado para todas as fases da vida.',
    },
  ],
  journey: [
    {
      step: '01',
      title: 'Fale conosco',
      description: 'Chame no WhatsApp e conte o que você precisa — agendamento rápido e humano.',
    },
    {
      step: '02',
      title: 'Consulta acolhedora',
      description: 'Avaliação completa, tempo para perguntas e plano de cuidado transparente.',
    },
    {
      step: '03',
      title: 'Acompanhamento',
      description: 'Retornos, exames e orientação contínua — sempre com a DNA ao seu lado.',
    },
  ],
  proof: [
    { value: '2016', label: 'Desde quando cuidamos de Capão Bonito' },
    { value: '5+', label: 'Áreas de atenção integrada' },
    { value: '08:30–19h', label: 'Atendimento de segunda a sexta' },
    { value: '1.1K+', label: 'Famílias conectadas no Instagram' },
  ],
  testimonials: [
    {
      quote:
        'Atendimento impecável. Minha filha se sente segura desde a recepção até a consulta. A Clínica DNA virou nossa referência de cuidado.',
      name: 'Camila R.',
      role: 'Mãe · Pediatria',
    },
    {
      quote:
        'Profissionais atentos e um ambiente que transmite calma. Saí da consulta com clareza total sobre o próximo passo.',
      name: 'Roberto M.',
      role: 'Paciente · Clínica médica',
    },
    {
      quote:
        'Agendamento pelo WhatsApp é prático e o retorno é sempre ágil. Recomendo de olhos fechados.',
      name: 'Juliana S.',
      role: 'Paciente · Odontologia',
    },
  ],
  faqs: [
    {
      q: 'Como agendar uma consulta?',
      a: 'Pelo WhatsApp (15) 99852-2020. Informe a especialidade desejada e preferência de horário — nossa equipe responde com as opções disponíveis.',
    },
    {
      q: 'Quais especialidades vocês atendem?',
      a: 'Pediatria, clínica médica, neurologia, odontologia e procedimentos/vacinação, com atendimento integrado e encaminhamento quando necessário.',
    },
    {
      q: 'Qual o horário de funcionamento?',
      a: 'Segunda a sexta, das 08:30 às 19:00. Sábados e feriados sob agendamento — confirme disponibilidade pelo WhatsApp.',
    },
    {
      q: 'Onde fica a clínica?',
      a: 'Rua Floriano Peixoto, 299 — Centro, Capão Bonito/SP. Fácil acesso no coração da cidade.',
    },
    {
      q: 'Atendem convênios?',
      a: 'Para informações sobre convênios, particular e formas de pagamento, fale conosco pelo WhatsApp — orientamos conforme o tipo de atendimento.',
    },
  ],
  logo: `${import.meta.env.BASE_URL}logo.png`,
} as const

export type Specialty = {
  id: string
  title: string
  short: string
  description: string
  image: string
  highlights: string[]
}

export const specialties: Specialty[] = [
  {
    id: 'pediatria',
    title: 'Pediatria',
    short: 'Crescimento com carinho',
    description:
      'Acompanhamento do bebê à adolescência: desenvolvimento, prevenção, vacinação e cuidado nas fases mais delicadas da vida.',
    image: `${import.meta.env.BASE_URL}pediatria.jpg`,
    highlights: ['Consultas de rotina', 'Orientação aos pais', 'Acompanhamento do crescimento'],
  },
  {
    id: 'medicina',
    title: 'Clínica médica',
    short: 'Saúde no dia a dia',
    description:
      'Avaliação clínica completa, prevenção, check-up e acompanhamento de condições — com clareza e tempo para você.',
    image: `${import.meta.env.BASE_URL}medicina.jpg`,
    highlights: ['Check-up', 'Orientação de exames', 'Acompanhamento contínuo'],
  },
  {
    id: 'neurologia',
    title: 'Neurologia',
    short: 'Cuidado com precisão',
    description:
      'Avaliação neurológica atenta para sintomas, prevenção e acompanhamento especializado com conduta humanizada.',
    image: `${import.meta.env.BASE_URL}neurologia.jpg`,
    highlights: ['Avaliação especializada', 'Investigação de sintomas', 'Plano terapêutico'],
  },
  {
    id: 'odontologia',
    title: 'Odontologia',
    short: 'Sorriso com confiança',
    description:
      'Saúde bucal com acolhimento: prevenção, tratamento e orientação para um sorriso saudável em todas as idades.',
    image: `${import.meta.env.BASE_URL}odontologia.jpg`,
    highlights: ['Prevenção', 'Tratamentos clínicos', 'Orientação familiar'],
  },
  {
    id: 'procedimentos',
    title: 'Procedimentos & vacinas',
    short: 'Prevenção em ação',
    description:
      'Vacinação e procedimentos ambulatoriais com segurança, higiene e acompanhamento próximo da equipe.',
    image: `${import.meta.env.BASE_URL}hero-family.jpg`,
    highlights: ['Vacinação', 'Procedimentos ambulatoriais', 'Orientação pós-atendimento'],
  },
]

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}

export function asset(path: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
