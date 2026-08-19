export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/post-1.jpg',
  clinic: '/instagram/post-4.jpg',
  process: '/instagram/post-2.jpg',
  periodontal: '/instagram/post-3.jpg',
  team: {
    anaPaula: '/team/ana-paula.jpg',
    avaliacao: '/team/avaliacao-clinica.jpg',
    clinica1: '/team/equipe-clinica-1.jpg',
    clinica2: '/team/equipe-clinica-2.jpg',
  },
} as const

export const site = {
  brand: {
    short: 'OdontoMed',
    legal: 'OdontoMed - Odontologia Avançada e Saúde Especializada',
    promise: 'Odontologia Avançada e Saúde Especializada.',
    niche: 'Clínica odontológica',
    city: 'Bom Retiro',
    state: 'SC',
    followers: 1620,
  },
  contact: {
    instagram: 'https://www.instagram.com/odontomed.br',
    instagramHandle: '@odontomed.br',
    bookingNote:
      'Ana Paula cuida da agenda de todos os profissionais da clínica e também atende pelo WhatsApp.',
  },
  location: {
    city: 'Bom Retiro',
    state: 'SC',
    note: 'Localização informada em publicações oficiais no Instagram (#bomretirosc).',
  },
  teamIntro: {
    lead: 'Foi uma tarde muito agradável, as meninas foram super atenciosas comigo e eu amei conhecer todo esse processo.',
    source: 'Legenda oficial — Instagram @odontomed.br',
  },
  treatments: [
    {
      id: 'avaliacao',
      title: 'Avaliação e anamnese',
      lead: 'Primeiro momento de conversa para entender queixas, expectativas e o que você gostaria de melhorar no sorriso.',
      source: 'Instagram @odontomed.br',
    },
    {
      id: 'limpeza',
      title: 'Limpeza e raspagem',
      lead: 'Procedimento tranquilo e não invasivo para cuidar da higiene e da saúde bucal.',
      source: 'Instagram @odontomed.br',
    },
    {
      id: 'clareamento',
      title: 'Clareamento dental',
      lead: 'Foco estético para deixar o sorriso mais bonito, iluminado e harmonioso.',
      source: 'Instagram @odontomed.br',
    },
    {
      id: 'periodontal',
      title: 'Tratamento periodontal',
      lead: 'Combate a inflamação, remove tártaro, protege os dentes e ajuda a prevenir problemas que podem comprometer a saúde bucal.',
      source: 'Instagram @odontomed.br',
    },
    {
      id: 'implantes',
      title: 'Implantes dentários',
      lead: 'Mais do que substituir um dente — devolver confiança, conforto e qualidade de vida.',
      source: 'Instagram @odontomed.br',
    },
  ],
  evidence: {
    title: 'A saúde da gengiva faz toda a diferença no sorriso.',
    body: 'O tratamento periodontal vai muito além da limpeza: remove o acúmulo de placas e tártaro, controla a inflamação e previne doenças que podem comprometer não só a boca, mas a saúde como um todo.',
    image: media.periodontal,
    source: 'Instagram @odontomed.br',
  },
  atmosphere: {
    title: 'Recepção que acompanha o cuidado.',
    body: 'Atendimento acolhedor desde a chegada — como registrado nas gravações e visitas de pacientes na clínica.',
    image: media.hero,
    secondary: media.clinic,
    source: 'Instagram @odontomed.br',
  },
  professionals: [
    {
      id: 'ana-paula',
      name: 'Ana Paula',
      role: 'Agenda e atendimento',
      description:
        'Cuida da agenda de todos os profissionais da clínica e também atende pelo WhatsApp.',
      photo: media.team.anaPaula,
      featured: true,
      source: 'Instagram @odontomed.br',
    },
    {
      id: 'avaliacao-clinica',
      name: 'Profissional da clínica',
      role: 'Avaliação e registro',
      description:
        'Participa do primeiro dia de atendimento com anamnese, avaliação e registro fotográfico para acompanhar cada detalhe do processo.',
      photo: media.team.avaliacao,
      featured: false,
      source: 'Instagram @odontomed.br',
    },
    {
      id: 'equipe-clinica-1',
      name: 'Profissional da clínica',
      role: 'Equipe clínica',
      description:
        'Profissional associada em publicação oficial @odontomed.br. Mais do que substituir um dente, um implante devolve confiança, conforto e qualidade de vida.',
      photo: media.team.clinica1,
      featured: false,
      source: 'Instagram @odontomed.br — implantes dentários',
    },
    {
      id: 'equipe-clinica-2',
      name: 'Profissional da clínica',
      role: 'Equipe clínica',
      description:
        'Profissional associado em publicação oficial @odontomed.br. Cada sorriso restaurado representa uma nova fase, trazendo mais segurança para sorrir e viver com confiança.',
      photo: media.team.clinica2,
      featured: false,
      source: 'Instagram @odontomed.br — implantes dentários',
    },
  ],
} as const

export function instagramUrl(message?: string) {
  if (!message) return site.contact.instagram
  const encoded = encodeURIComponent(message)
  return `https://ig.me/m/odontomed.br?text=${encoded}`
}
