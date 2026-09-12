export const site = {
  name: 'Lira Odonto',
  handle: 'liraodontocaruaru',
  tagline: 'Referência em lentes de alto padrão',
  city: 'Caruaru · PE',
  neighborhood: 'Salgado',
  headline: 'Seu sorriso merece um projeto — não uma tentativa.',
  support:
    'Facetas em resina, harmonização facial e odontologia estética com naturalidade, proporção e planejamento exclusivo.',
  instagram: 'https://www.instagram.com/liraodontocaruaru',
  whatsapp: '5581996230029',
  phone: '(81) 99623-0029',
  address: {
    street: 'Rua Santa Luzia, 171',
    district: 'Salgado',
    city: 'Caruaru',
    state: 'PE',
    zip: '55016-250',
  },
  followers: 12053,
} as const

export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/post-10.jpg',
  team: {
    erton: '/team/dr-ertonlira.jpg',
  },
} as const

export type Procedure = {
  id: string
  title: string
  lead: string
  body: string
  image: string
  resultImage?: string
  tags: string[]
  source: string
}

export const procedures: Procedure[] = [
  {
    id: 'facetas',
    title: 'Facetas & Lentes em Resina',
    lead: 'Correção com respeito ao rosto, à mordida e à naturalidade.',
    body: 'Trocar facetas erradas não é só mudar o sorriso — é corrigir decisões tomadas sem respeitar sua essência. Um sorriso bonito começa na escolha de quem entende que cada detalhe importa.',
    image: '/instagram/post-1.jpg',
    resultImage: '/instagram/facetas-result.jpg',
    tags: ['FacetasEmResina', 'LentesEmResina', 'SorrisoNatural'],
    source: 'Instagram @liraodontocaruaru',
  },
  {
    id: 'lipo',
    title: 'Lipo de Papada HD',
    lead: 'Contorno mandibular mais definido, traços realçados.',
    body: 'Busca definir o contorno do rosto, reduzir o excesso abaixo do queixo e deixar a linha mandibular mais evidente — sem mudar quem você é, preservando naturalidade.',
    image: '/instagram/post-2.jpg',
    tags: ['LipoDePapada', 'ContornoFacial', 'HarmonizaçãoFacial'],
    source: 'Instagram @liraodontocaruaru',
  },
  {
    id: 'lentes',
    title: 'Lentes de Alto Padrão',
    lead: 'Elegância sem exagero. Harmonia que atravessa o tempo.',
    body: 'Um sorriso de alto padrão não precisa ser branco demais ou artificial para impressionar. Cada faceta é planejada de forma exclusiva — o resultado que faz perguntarem: “Como você consegue estar sempre tão bem?”',
    image: '/instagram/post-14.jpg',
    tags: ['OdontologiaEstética', 'TransformaçãoDoSorriso'],
    source: 'Instagram @liraodontocaruaru',
  },
]

export type ResultCase = {
  id: string
  image: string
  caption?: string
  aspect: 'tall' | 'wide' | 'square'
}

/** Unique feed images only — duplicates (post-5/6 ≡ post-4, post-12 ≡ post-11) excluded */
export const results: ResultCase[] = [
  {
    id: 'r7',
    image: '/instagram/post-7.jpg',
    aspect: 'tall',
  },
  {
    id: 'r8',
    image: '/instagram/post-8.jpg',
    aspect: 'wide',
  },
  {
    id: 'r9',
    image: '/instagram/post-9.jpg',
    aspect: 'square',
  },
  {
    id: 'r11',
    image: '/instagram/post-11.jpg',
    aspect: 'tall',
  },
  {
    id: 'r13',
    image: '/instagram/post-13.jpg',
    aspect: 'square',
  },
]

export const philosophy = {
  title: 'Proporção. Naturalidade. Harmonia.',
  paragraphs: [
    'Um sorriso sofisticado não acontece por acaso — exige planejamento, precisão e um olhar capaz de entender o que combina com o seu rosto.',
    'Não é sobre dentes extremamente brancos ou seguir um padrão. É sobre aquele resultado que faz as pessoas perceberem que você está diferente, sem saber exatamente o que mudou.',
    'Seu sorriso é parte da sua imagem. A escolha do profissional muda tudo.',
  ],
  image: '/instagram/post-3.jpg',
  clinicNote:
    'Venha conhecer nossa clínica — transformar seu sorriso e elevar sua autoestima.',
}

export const professionals = [
  {
    id: 'erton',
    name: 'Dr. Erton Emmanuel Lira da Silva',
    role: 'Cirurgião-Dentista · Clínico Geral',
    credential: 'CRO 16334-PE',
    description:
      'Profissional associado em publicações oficiais @liraodontocaruaru. Referência em lentes de alto padrão e odontologia estética.',
    photo: media.team.erton,
    instagram: 'https://www.instagram.com/dr.ertonlira',
    featured: true,
    source: 'Instagram @liraodontocaruaru',
  },
  {
    id: 'emanoelle',
    name: 'Dra. Emanoelle Conceição da Silva Lira',
    role: 'Sócia · Clínica Lira Odonto',
    credential: null,
    description:
      'Profissional citada em avaliações de pacientes da clínica em Caruaru.',
    photo: null,
    instagram: null,
    featured: false,
    source: 'Avaliações Google · DentMap',
  },
] as const

export function whatsappUrl(message?: string) {
  const text = message ?? 'Olá! Gostaria de agendar uma avaliação na Lira Odonto.'
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`
}

export function mapsUrl() {
  const q = encodeURIComponent(
    `${site.address.street}, ${site.address.district}, ${site.address.city} - ${site.address.state}`,
  )
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}
