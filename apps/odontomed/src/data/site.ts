export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/post-4.jpg',
  reception: '/instagram/post-1.jpg',
  clinic: '/instagram/post-4.jpg',
  process: '/instagram/post-2.jpg',
  periodontal: '/instagram/post-3.jpg',
  gallery: [
    '/instagram/post-1.jpg',
    '/instagram/post-2.jpg',
    '/instagram/post-3.jpg',
    '/instagram/post-4.jpg',
    '/instagram/post-5.jpg',
    '/instagram/post-6.jpg',
  ],
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
  instagram: {
    profile: media.profile,
  },
  location: {
    city: 'Bom Retiro',
    state: 'SC',
    note: 'Localização informada em publicações oficiais no Instagram (#bomretirosc).',
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
    image: media.reception,
    secondary: media.process,
    source: 'Instagram @odontomed.br',
  },
  instagramPosts: [
    {
      id: 1,
      caption:
        'Primeira etapa do tratamento: raspagem e limpeza dental — procedimento tranquilo, sem nada invasivo.',
      image: media.gallery[0],
      permalink: 'https://www.instagram.com/p/DcMtJWSJL-a/',
    },
    {
      id: 2,
      caption:
        'Anamnese, avaliação e registro fotográfico para acompanhar cada detalhe do processo.',
      image: media.gallery[1],
      permalink: 'https://www.instagram.com/p/DcCOvBopOAS/',
    },
    {
      id: 3,
      caption:
        'A saúde da gengiva faz toda a diferença no sorriso — tratamento periodontal com antes e depois.',
      image: media.gallery[2],
      permalink: 'https://www.instagram.com/p/DbtSrbCRsMg/',
    },
    {
      id: 4,
      caption:
        'Mais do que substituir um dente, um implante devolve confiança, conforto e qualidade de vida.',
      image: media.gallery[3],
      permalink: 'https://www.instagram.com/p/DbqRb91RV0G/',
    },
    {
      id: 5,
      caption: 'Odontomed — Odontologia Avançada e Saúde Especializada. #bomretirosc',
      image: media.gallery[4],
      permalink: 'https://www.instagram.com/p/DbekLwZxUez/',
    },
    {
      id: 6,
      caption:
        'Cada sorriso tem uma história. Nunca é tarde para voltar a sorrir com implantes dentários.',
      image: media.gallery[5],
      permalink: 'https://www.instagram.com/p/DbJjctpTC58/',
    },
  ],
} as const

export function instagramUrl(message?: string) {
  if (!message) return site.contact.instagram
  const encoded = encodeURIComponent(message)
  return `https://ig.me/m/odontomed.br?text=${encoded}`
}
