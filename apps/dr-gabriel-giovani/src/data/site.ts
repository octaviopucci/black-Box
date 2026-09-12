export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/hero-dr-gabriel.jpg',
} as const

export type ResultCase = {
  id: string
  image: string
  title: string
  note: string
  source: string
  permalink: string
}

/** Unique cases only — duplicates (post-5/6, post-11, post-16) excluded */
export const results: ResultCase[] = [
  {
    id: 'lentes-victor',
    image: '/instagram/post-2.jpg',
    title: 'Lentes de contato',
    note: 'Lentes de contato — resultado documentado no Instagram oficial.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DcM7uvMC41l/',
  },
  {
    id: 'restauracao-1',
    image: '/instagram/post-4.jpg',
    title: 'Sorriso restaurado',
    note: 'Todo sorriso restaurado representa uma nova fase. É sobre devolver confiança, dignidade e a felicidade de sorrir sem medo.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DawLTLlFLCi/',
  },
  {
    id: 'planejamento-individual',
    image: '/instagram/post-9.jpg',
    title: 'Planejamento individualizado',
    note: 'Quando a paciente chegou até nós, ela convivia com limitações para sorrir, mastigar e até se sentir confiante. Com um planejamento individualizado e um tratamento cuidadoso, conseguimos devolver um sorriso bonito, funcional e natural.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DatMthbFCTA/',
  },
  {
    id: 'confianca-1',
    image: '/instagram/post-7.jpg',
    title: 'Confiança recuperada',
    note: 'Transformar um sorriso é devolver confiança para conversar sem vergonha, sorrir espontaneamente, voltar a comer com segurança e recuperar uma autoestima que, muitas vezes, foi perdida ao longo dos anos.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DawLS9VlIb7/',
  },
  {
    id: 'caso-8',
    image: '/instagram/post-8.jpg',
    title: 'Reabilitação estética',
    note: 'Resultado documentado no perfil oficial — cada caso recebe planejamento individualizado.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DawLS9WFMx9/',
  },
  {
    id: 'caso-10',
    image: '/instagram/post-10.jpg',
    title: 'Transformação funcional',
    note: 'O antes e depois impressionam, mas o que realmente faz a diferença é ver a felicidade estampada no rosto de quem volta a sorrir sem medo.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DatMpeQi6Kn/',
  },
  {
    id: 'caso-12',
    image: '/instagram/post-12.jpg',
    title: 'Estética e função',
    note: 'Sorriso bonito, funcional e natural — documentado no Instagram oficial.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DatMphGCpYF/',
  },
  {
    id: 'caso-13',
    image: '/instagram/post-13.jpg',
    title: 'Reabilitação completa',
    note: 'Cada transformação representa uma nova fase na vida do paciente.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DatMpjHioAD/',
  },
  {
    id: 'caso-14',
    image: '/instagram/post-14.jpg',
    title: 'Resultado natural',
    note: 'É nos detalhes que um grande resultado começa a ganhar forma.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DanhQ5WnLjs/',
  },
  {
    id: 'caso-15',
    image: '/instagram/post-15.jpg',
    title: 'Nova fase',
    note: 'Devolver confiança, dignidade e a felicidade de sorrir sem medo.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/Dangx0-CSvi/',
  },
  {
    id: 'caso-17',
    image: '/instagram/post-17.jpg',
    title: 'Sorriso funcional',
    note: 'Tratamento cuidadoso com foco em estética e função mastigatória.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/Dangx1lCp43/',
  },
  {
    id: 'caso-18',
    image: '/instagram/post-18.jpg',
    title: 'Autoestima',
    note: 'Recuperar a autoestima que, muitas vezes, foi perdida ao longo dos anos.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/Dangx1jC1NJ/',
  },
  {
    id: 'caso-19',
    image: '/instagram/post-19.jpg',
    title: 'Transformação real',
    note: 'Essa é nossa missão — transformar sorrisos e qualidade de vida.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/Dangx3UiqR7/',
  },
]

export const site = {
  name: 'Dr. Gabriel Giovani',
  fullName: 'Gabriel Giovani Nogueira Camargo',
  title: 'Cirurgião-dentista',
  cro: '163950-SP',
  niche: 'Reabilitação estética e prótese dentária',
  city: 'Cerquilho',
  state: 'SP',
  instagram: {
    handle: 'dr.gabrielgiovani',
    url: 'https://www.instagram.com/dr.gabrielgiovani',
    followers: 1199,
  },
  address: {
    street: 'Rua da Fazendinha, 149',
    neighborhood: 'Centro',
    city: 'Cerquilho',
    state: 'SP',
    zip: '18520-129',
  },
  hero: {
    headline: 'Sorrir sem medo',
    support:
      'Reabilitação estética com planejamento individualizado — cada resultado documentado, sem repetir casos.',
    cta: 'Agendar via Instagram',
  },
  manifesto: {
    lead: 'É nos detalhes que um grande resultado começa a ganhar forma.',
    body: 'Transformar um sorriso é devolver confiança para conversar sem vergonha, sorrir espontaneamente, voltar a comer com segurança e recuperar uma autoestima que, muitas vezes, foi perdida ao longo dos anos. Essa é nossa missão.',
    source: 'Instagram @dr.gabrielgiovani',
  },
  testimonial: {
    quote:
      'Esse depoimento mostra que um tratamento odontológico vai muito além da estética. É sobre recuperar a confiança, voltar a sorrir sem vergonha e transformar a qualidade de vida.',
    context: 'Depoimento de paciente — publicado no Instagram oficial.',
    source: 'Instagram @dr.gabrielgiovani',
    permalink: 'https://www.instagram.com/p/DaytQ6TiqbN/',
  },
  specialties: [
    {
      id: 'lentes',
      name: 'Lentes de contato',
      description:
        'Reabilitação estética com lentes de contato dental — casos documentados no perfil oficial.',
    },
    {
      id: 'protese',
      name: 'Prótese dentária',
      description:
        'Reconstrução funcional e estética do sorriso com próteses planejadas individualmente.',
    },
    {
      id: 'reabilitacao',
      name: 'Reabilitação estética',
      description:
        'Tratamentos que devolvem confiança, função mastigatória e naturalidade ao sorriso.',
    },
  ],
  contact: {
    cta: 'Conversar no Instagram',
    note: 'Agendamentos e dúvidas pelo direct do perfil oficial.',
  },
} as const
