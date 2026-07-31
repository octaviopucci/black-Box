export const site = {
  name: 'Matsubara',
  fullName: 'Clínica Matsubara',
  legalName: 'Clínica Odontológica Torresilha Matsubara Ltda',
  cnpj: '46.610.920/0001-22',
  tagline: 'Odontologia e Estética',
  headline: 'Sua melhor versão começa aqui.',
  description:
    'Clínica Matsubara em Capão Bonito/SP — odontologia, estética e especialidades médicas com atendimento humanizado, tecnologia e excelência. Agende pelo WhatsApp.',
  promise: 'Aqui cada cliente é único.',
  concept: 'A Versão',
  instagram: 'https://www.instagram.com/clinicamatsubara_',
  instagramHandle: '@clinicamatsubara_',
  phone: {
    label: '(15) 99856-5038',
    href: 'tel:+5515998565038',
  },
  whatsapp: {
    number: '5515998565038',
    message: 'Olá, gostaria de agendar uma avaliação!',
  },
  address: 'Av. Adhemar de Barros, 737 — Vila Santa Rosa — Capão Bonito/SP, 18307-070',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Avenida+Adhemar+de+Barros,+737,+Vila+Santa+Rosa,+Cap%C3%A3o+Bonito+SP',
  city: 'Capão Bonito/SP',
  since: 2022,
  nav: [
    { label: 'Versão', href: '#versao' },
    { label: 'Cuidados', href: '#cuidados' },
    { label: 'Espaço', href: '#espaco' },
    { label: 'Equipe', href: '#equipe' },
    { label: 'Agendar', href: '#agendar' },
  ],
  manifesto: [
    'Sua melhor versão não é um destino.',
    'É o instante em que você decide cuidar.',
    'A Matsubara existe para acompanhar esse instante — com precisão, acolhimento e resultado.',
  ],
  story: [
    'Odontologia, estética e especialidades médicas sob o mesmo teto.',
    'Em Capão Bonito, um espaço boutique onde cada tratamento é pensado para a sua história — não para um protocolo genérico.',
  ],
  principles: [
    {
      title: 'Exclusividade',
      description:
        'Cada cliente é único. Avaliamos o caso, a rotina e o desejo — e desenhamos o caminho certo.',
    },
    {
      title: 'Humanização',
      description:
        'Tecnologia com presença. Escuta real antes de qualquer conduta. Conforto que se sente no corpo.',
    },
    {
      title: 'Excelência',
      description:
        'Ambiente climatizado, equipe preparada e acompanhamento próximo até o resultado que se sustenta.',
    },
  ],
} as const

export type CareRiver = {
  id: string
  roman: string
  title: string
  line: string
  detail: string
  image: string
  accents: string[]
}

export const careRivers: CareRiver[] = [
  {
    id: 'odontologia',
    roman: 'I',
    title: 'Odontologia',
    line: 'Sorrir com confiança',
    detail:
      'Do cuidado preventivo ao implante: saúde bucal com técnica precisa e ambiente que respeita o seu ritmo.',
    image: 'care/odontologia.jpg',
    accents: ['Implantes', 'Endodontia', 'Ortodontia', 'Estética restauradora'],
  },
  {
    id: 'estetica',
    roman: 'II',
    title: 'Estética',
    line: 'Contorno, pele e presença',
    detail:
      'Harmonização facial e corporal, Heccus Turbo e protocolos avançados — resultados naturais, elegantes e planejados.',
    image: 'care/estetica.jpg',
    accents: ['Harmonização facial', 'Corporal', 'Heccus Turbo', 'Laserterapia'],
  },
  {
    id: 'especialidades',
    roman: 'III',
    title: 'Especialidades',
    line: 'Cuidar também por dentro',
    detail:
      'Psicologia, pediatria, nutrologia e especialidades no mesmo endereço — porque saúde, autoestima e equilíbrio caminham juntos.',
    image: 'care/especialidades.jpg',
    accents: ['Psicologia', 'Pediatria', 'Nutrologia', 'Bem-estar'],
  },
]

export type TeamMember = {
  id: string
  name: string
  role: string
  note: string
  image: string
  objectPosition?: string
}

export const foundersDuo = {
  image: 'team/duo-hero.jpg',
  alt: 'Dra. Carina Torresilha e Dra. Danielle Matsubara — fundadoras da Clínica Matsubara',
  title: 'Carina & Danielle',
  line: 'As fundadoras — estética e odontologia com a mesma presença.',
} as const

export const team: TeamMember[] = [
  {
    id: 'carina',
    name: 'Dra. Carina Torresilha',
    role: 'Estética avançada · fundadora',
    note: 'Sócia-fundadora. Farmacêutica bioquímica — harmonização corporal e estética com presença e excelência.',
    image: 'team/carina.jpg',
    objectPosition: 'center 18%',
  },
  {
    id: 'danielle',
    name: 'Dra. Danielle Matsubara',
    role: 'Endodontia · fundadora',
    note: 'Sócia-fundadora. Dentista especialista em canal — sorriso e reabilitação com atendimento humanizado.',
    image: 'team/danielle.jpg',
    objectPosition: 'center 18%',
  },
  {
    id: 'larissa',
    name: 'Dra. Larissa Lima',
    role: 'Harmonização facial',
    note: 'Biomédica esteta — resultados sutis e elegantes, com plano pensado para cada paciente.',
    image: 'team/larissa.jpg',
    objectPosition: 'center 12%',
  },
  {
    id: 'aryanna',
    name: 'Dra. Aryanna Lustre',
    role: 'Medicina · Nutrologia',
    note: 'Emagrecimento saudável, metabolismo e longevidade — ciência com escuta para transformar hábitos.',
    image: 'team/aryanna.jpg',
    objectPosition: 'center 14%',
  },
  {
    id: 'gabriela',
    name: 'Dra. Gabriela Lara',
    role: 'Psicologia',
    note: 'Cuidado emocional acolhedor — equilíbrio e bem-estar com escuta humanizada.',
    image: 'team/gabriela.jpg',
    objectPosition: 'center 12%',
  },
  {
    id: 'gabriel',
    name: 'Dr. Gabriel Linhares Bueno',
    role: 'Implantodontia',
    note: 'Implantes e reabilitação com técnica precisa — para um sorriso firme e duradouro.',
    image: 'team/gabriel.jpg',
    objectPosition: 'center 18%',
  },
  {
    id: 'lucas',
    name: 'Dr. Lucas Rodrigues Wasilewski',
    role: 'Pediatria · CRM 244816/SP',
    note: 'Médico com pós em pediatria e psiquiatria infantil — atendimento adulto e infantil na Matsubara.',
    image: 'team/lucas.jpg',
    objectPosition: 'center 12%',
  },
]

export const whispers = [
  {
    text: 'Aqui cada cliente é único. Tratamento exclusivo, técnicas inovadoras e atenção real ao que você precisa.',
    who: 'Clínica Matsubara',
    role: 'Nosso princípio',
  },
  {
    text: 'Salas climatizadas, estrutura moderna e acolhimento — para realizar procedimentos com tranquilidade.',
    who: 'Espaço Matsubara',
    role: 'Conforto',
  },
  {
    text: 'Cuidar de você não é luxo. É investir na autoestima, na confiança e no jeito como você se sente todos os dias.',
    who: 'Manifesto',
    role: 'Autocuidado',
  },
] as const

export const journey = [
  {
    step: '01',
    title: 'Chegada',
    description: 'Você conta o que busca. A gente escuta o sorriso, o corpo e o desejo de versão.',
  },
  {
    step: '02',
    title: 'Avaliação',
    description: 'Leitura clínica e estética com precisão — para indicar o caminho certo, no tempo certo.',
  },
  {
    step: '03',
    title: 'Condução',
    description: 'Tratamento, acompanhamento e presença. Um processo vivo até o resultado que se sustenta.',
  },
] as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file.replace(/^\//, '')}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
