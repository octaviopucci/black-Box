export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/post-1.jpg',
  team: '/instagram/post-1.jpg',
  areas: {
    custody: '/instagram/post-4.jpg',
    approach: '/instagram/post-3.jpg',
    jury: '/instagram/post-2.jpg',
    investigation: '/instagram/post-6.jpg',
    defense: '/instagram/post-5.jpg',
  },
} as const

export const site = {
  name: 'Advocacia Del Cistia',
  legalName: 'Del Cistia Sociedade de Advogados',
  handle: 'advocacia.delcistia',
  niche: 'Advocacia criminal',
  tagline: 'Equidade, igualdade e honestidade na defesa criminal.',
  promise:
    'Defesa técnica, ética e preparada em todas as fases do procedimento criminal — de Sorocaba para quem precisa de orientação qualificada.',
  values: ['Equidade', 'Igualdade', 'Honestidade', 'Ética', 'Compromisso'],
  founded: '2012',
  instagram: 'https://www.instagram.com/advocacia.delcistia/',
  phones: [
    { label: 'Telefone', number: '(15) 3219-2530', href: 'tel:+551532192530' },
    { label: 'Telefone', number: '(15) 3211-5252', href: 'tel:+551532115252' },
  ],
  whatsapp: {
    number: '551532192530',
    href: 'https://wa.me/551532192530',
    message: 'Olá, gostaria de orientação jurídica na área criminal.',
  },
  email: 'fisgoya@uol.com.br',
  address: {
    street: 'Av. Rudolf Dafferner, 400',
    detail: 'Salas 411 e 413 · 3º andar',
    neighborhood: 'Boa Vista',
    city: 'Sorocaba',
    state: 'SP',
    cep: '18085-005',
    maps: 'https://maps.google.com/?q=Av.+Rudolf+Dafferner+400+Sorocaba+SP',
  },
  plantao: 'Plantão jurídico 24 horas',
  cnpj: '17.657.474/0001-03',
} as const

export const practiceAreas = [
  {
    id: 'juri',
    title: 'Tribunal do Júri',
    summary:
      'Atuação em plenário com estudo, estratégia e argumentação — porque exercer o Direito é uma escolha diária de responsabilidade e dedicação.',
    image: media.areas.jury,
    source: 'Instagram @advocacia.delcistia',
  },
  {
    id: 'custodia',
    title: 'Audiência de Custódia',
    summary:
      'Verificação da legalidade da prisão em flagrante e garantia dos direitos fundamentais logo após a prisão — etapa decisiva para liberdade ou medidas cautelares.',
    image: media.areas.custody,
    source: 'Instagram @advocacia.delcistia',
  },
  {
    id: 'abordagem',
    title: 'Direitos na Abordagem Policial',
    summary:
      'Orientação sobre limites legais da abordagem, busca pessoal fundamentada e preservação da dignidade — informação como ferramenta de cidadania.',
    image: media.areas.approach,
    source: 'Instagram @advocacia.delcistia',
  },
  {
    id: 'investigacao',
    title: 'Investigações e Depoimentos',
    summary:
      'Acompanhamento desde intimações e convocações até a fase investigativa, assegurando direitos constitucionais em cada etapa do procedimento.',
    image: media.areas.investigation,
    source: 'Instagram @advocacia.delcistia',
  },
  {
    id: 'defesa',
    title: 'Defesa Criminal Integral',
    summary:
      'Atuação em processos criminais além de situações de prisão — porque a advocacia criminalista é necessária em diversas fases, não apenas na detenção.',
    image: media.areas.defense,
    source: 'Instagram @advocacia.delcistia',
  },
] as const

export const professionals = [
  {
    id: 'danielli',
    name: 'Danielli Del Cistia',
    role: 'Sócia · Advogada Criminalista',
    oab: 'OAB/SP 272.850',
    description:
      'Atua em execução penal e processos criminais na região de Sorocaba, com registro ativo perante a OAB/SP.',
    featured: true,
    source: 'Registro OAB/SP · Del Cistia Sociedade de Advogados',
  },
  {
    id: 'gisele',
    name: 'Gisele Del Cistia',
    role: 'Sócia · Advogada Criminalista',
    instagram: 'https://www.instagram.com/gidelcistia/',
    description:
      'Sócia-administradora do escritório. Profissional associada em publicações oficiais @advocacia.delcistia.',
    featured: true,
    source: 'Instagram @advocacia.delcistia · CNPJ',
  },
  {
    id: 'mario',
    name: 'Mário Del Cistia Filho',
    role: 'Sócio · Advogado',
    description:
      'Sócio-administrador da Del Cistia Sociedade de Advogados, estruturando a gestão e continuidade do escritório desde 2012.',
    featured: false,
    source: 'Del Cistia Sociedade de Advogados · CNPJ',
  },
] as const

export const commitments = [
  {
    title: 'Ética e independência',
    text: 'Compromisso diário com a ética, a responsabilidade e soluções jurídicas que preservem os direitos de cada cliente.',
  },
  {
    title: 'Preparo técnico',
    text: 'Horas de estudo, estratégia e argumentação em cada caso — porque exercer o Direito não é apenas uma profissão, é uma escolha de dedicação.',
  },
  {
    title: 'Informação qualificada',
    text: 'Conteúdo jurídico claro para combater a desinformação. Orientação consciente dentro dos limites da legislação vigente.',
  },
] as const

export const navLinks = [
  { href: '#atuacao', label: 'Atuação' },
  { href: '#equipe', label: 'Equipe' },
  { href: '#compromisso', label: 'Compromisso' },
  { href: '#contato', label: 'Contato' },
] as const
