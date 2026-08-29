import type {
  AboutFact,
  Article,
  FeaturedItem,
  GalleryItem,
  InstagramPost,
  MapMarker,
  Project,
  SiteConfig,
  StatItem,
  TimelineItem,
  VideoItem,
} from './site'

/** Fotos reais em resolução completa (1179×2096) — sem recorte de arquivo. */
export const media = {
  /** Retrato principal — presença comunitária */
  hero: '/instagram/deep/DcJ7Vv8t2_L.jpg',
  /** Presença nas ruas */
  rua: '/instagram/deep/Dcl-Z9etEMT.jpg',
  /** Saúde e entidades */
  saude: '/instagram/deep/Dcj9pQPtFvJ.jpg',
  /** Proximidade com moradores */
  comunidade: '/instagram/deep/DcJ7Vv8t2_L.jpg',
  /** Reunião e documentos */
  trabalho: '/instagram/deep/DcZ1Er0tO50.jpg',
  /** Avatar (substituir quando houver foto HD) */
  profile: '/instagram/post-2.jpg',
} as const

export const siteConfig: SiteConfig = {
  name: 'Heitor da Gelsa',
  fullName: 'Heitor Henrique Silveira Rolim',
  nameLines: ['HEITOR', 'DA GELSA'],
  handle: 'heitordagelsa',
  city: 'Capão Bonito',
  state: 'SP',
  locationLabel: 'Capão Bonito — SP',
  tagline: 'Presença que se transforma em trabalho.',
  heroHeadline: 'Presença que se transforma em',
  heroHighlight: 'TRABALHO.',
  heroSubheadline:
    'Ex-vereador por dois mandatos, assessor parlamentar e filho de Maria Gelsa da Silveira — referência de escuta e atuação pública em Capão Bonito.',
  seo: {
    title: 'Heitor da Gelsa | Atuação Pública em Capão Bonito',
    description:
      'Trajetória, atuação pública e canais de contato de Heitor Henrique Silveira Rolim (Heitor da Gelsa) em Capão Bonito — SP.',
  },
  formation: 'Bacharel em Direito — Superior Completo',
  role: 'Assessor Parlamentar',
  history: 'Vereador por dois mandatos (2013–2016 e 2017–2020)',
  family: 'Pai do Calebe e do Arthur',
  spouse: 'Casado com Fran Silveira (@franmsilveira_)',
  mother: 'Maria Gelsa da Silveira — ex-vereadora de Capão Bonito',
  birthDate: '02/03/1989',
  birthPlace: 'Capão Bonito — SP',
  instagramUrl: 'https://www.instagram.com/heitordagelsa/',
  whatsapp: '5515998591411',
  whatsappDisplay: '(15) 99859-1411',
  email: '[INSERIR E-MAIL REAL]',
  facebookUrl: '[INSERIR LINK DO FACEBOOK]',
  youtubeUrl: '[INSERIR LINK DO YOUTUBE]',
  sources: [
    'Instagram @heitordagelsa',
    'Câmara Municipal de Capão Bonito — legislaturas 2013/2016 e 2017/2020',
    'Jornal O Expresso (26/07/2024)',
    'Estadão Eleições 2024 — TSE',
  ],
}

export const stats: StatItem[] = [
  { id: 'mandatos', value: '02', label: 'MANDATOS COMO VEREADOR' },
  { id: 'votos-2020', value: '5.000+', label: 'VOTOS NA ELEIÇÃO DE 2020 (PSL)' },
  { id: 'votos-2024', value: '8.733', label: 'VOTOS NA ELEIÇÃO MUNICIPAL DE 2024' },
  { id: 'formacao', value: 'DIREITO', label: 'BACHAREL — SUPERIOR COMPLETO' },
]

export const aboutFacts: AboutFact[] = [
  { id: 'nome', label: 'NOME COMPLETO', value: 'Heitor Henrique Silveira Rolim' },
  { id: 'nascimento', label: 'NASCIMENTO', value: '02/03/1989 — Capão Bonito, SP' },
  { id: 'formacao', label: 'FORMAÇÃO', value: 'Bacharel em Direito — Superior Completo' },
  { id: 'atuacao', label: 'LEGISLATIVO', value: 'Vereador — legislaturas 2013/2016 e 2017/2020' },
  { id: 'parlamentar', label: 'ATUAÇÃO ATUAL', value: 'Assessor Parlamentar — ocupante de cargo em comissão' },
  { id: 'origem', label: 'ORIGEM', value: 'Filho da ex-vereadora Maria Gelsa da Silveira' },
  { id: 'familia', label: 'FAMÍLIA', value: 'Casado com Fran Silveira · pai do Calebe e do Arthur' },
]

export const aboutIntro =
  'Capão-bonitense, bacharel em Direito e pai do Calebe e do Arthur. O apelido “da Gelsa” remete à mãe, Maria Gelsa da Silveira, ex-vereadora — referência de origem na vida pública local.'

export const aboutExtended = [
  'Mantém canais abertos com moradores via WhatsApp (15) 99859-1411 e Instagram @heitordagelsa.',
]

export const navLinks = [
  { label: 'Início', href: '/#inicio' },
  { label: 'Sobre', href: '/#sobre' },
  { label: 'Trajetória', href: '/#trajetoria' },
  { label: 'Atuação', href: '/#atuacao' },
  { label: 'Registros', href: '/#registros' },
  { label: 'Contato', href: '/#contato' },
]

export const socialLinks = [
  { id: 'instagram', label: 'Instagram', url: siteConfig.instagramUrl },
  { id: 'whatsapp', label: 'WhatsApp', url: `https://wa.me/${siteConfig.whatsapp}` },
  { id: 'facebook', label: 'Facebook', url: siteConfig.facebookUrl },
  { id: 'youtube', label: 'YouTube', url: siteConfig.youtubeUrl },
]

export const timeline: TimelineItem[] = [
  {
    id: 'origem',
    year: '—',
    title: 'Origem e referência familiar',
    description:
      'Filho da ex-vereadora Maria Gelsa da Silveira. Nasceu em Capão Bonito em 02/03/1989.',
  },
  {
    id: 'formacao',
    year: '—',
    title: 'Formação em Direito',
    description: 'Graduação superior completa em Direito. [INSERIR INSTITUIÇÃO QUANDO CONFIRMADA]',
  },
  {
    id: 'mandato-1',
    year: '2013–2016',
    title: 'Primeiro mandato como vereador',
    description: 'Legislatura 2013/2016 — Câmara Municipal de Capão Bonito.',
  },
  {
    id: 'mandato-2',
    year: '2017–2020',
    title: 'Segundo mandato como vereador',
    description: 'Legislatura 2017/2020 — Câmara Municipal de Capão Bonito.',
  },
  {
    id: 'prefeito-2020',
    year: '2020',
    title: 'Candidato a prefeito',
    description: 'Concorreu pelo PSL, ficou em 3º lugar com mais de 5.000 votos.',
  },
  {
    id: 'assessor',
    year: 'Atual',
    title: 'Assessoria parlamentar',
    description: 'Atua como assessor parlamentar — ocupante de cargo em comissão.',
  },
  {
    id: 'registro-2024',
    year: '2024',
    title: 'Eleição municipal',
    description: 'Candidato a prefeito pelo MDB (15), coligação MDB/Solidariedade/PSB — 8.733 votos.',
  },
]

export const galleryItems: GalleryItem[] = [
  { id: 'g2', src: media.rua, alt: 'Heitor da Gelsa nas ruas de Capão Bonito', category: 'Cidade' },
  { id: 'g3', src: media.saude, alt: 'Registro sobre saúde da população e entidades sociais', category: 'Reuniões' },
  { id: 'g4', src: media.trabalho, alt: 'Reunião de trabalho com documentos', category: 'Visitas' },
]

export const galleryFilters = ['Todos', 'Cidade', 'Comunidade', 'Reuniões', 'Visitas'] as const

export const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    thumbnail: media.saude,
    date: '2024',
    category: 'SAÚDE',
    title: 'Saúde da população e entidades sociais',
    caption:
      'Heitor da Gelsa e Daan Cabeleireiro se unem em favor do Dep Federal que mais ajudou a saúde de Capão Bonito e as entidades sociais.',
    url: 'https://www.instagram.com/p/Dcj9pQPtFvJ/',
  },
  {
    id: 2,
    thumbnail: media.rua,
    date: '2024',
    category: 'CIDADE',
    title: 'Canal de feedback nas ruas',
    caption:
      'Convite para moradores apontarem erros e colaborarem — WhatsApp (15) 99859-1411.',
    url: 'https://www.instagram.com/p/Dcl-Z9etEMT/',
  },
  {
    id: 3,
    thumbnail: media.trabalho,
    date: '2024',
    category: 'TRANSPARÊNCIA',
    title: 'Reunião e acompanhamento de demandas',
    caption: 'Registro de trabalho com documentos e diálogo institucional.',
    url: 'https://www.instagram.com/p/DcZ1Er0tO50/',
  },
]

export const articles: Article[] = [
  {
    slug: 'saude-populacao-registros',
    category: 'SAÚDE',
    title: 'Saúde da população e entidades sociais',
    date: '2024',
    summary:
      'Heitor da Gelsa e Daan Cabeleireiro se unem em favor do Dep Federal que mais ajudou a saúde de Capão Bonito e as entidades sociais.',
    readTime: '3 min',
    image: media.saude,
    body: [
      'Heitor da Gelsa e Daan Cabeleireiro se unem em favor do Dep Federal que mais ajudou a saúde de Capão Bonito e as entidades sociais.',
      'Publicação oficial no Instagram @heitordagelsa.',
    ],
    source: 'Instagram @heitordagelsa — post Dcj9pQPtFvJ',
  },
  {
    slug: 'canal-feedback-cidade',
    category: 'CIDADE',
    title: 'Canal aberto para correções e feedback',
    date: '2024',
    summary:
      'Convite para moradores apontarem erros e colaborarem com melhorias — WhatsApp (15) 99859-1411.',
    readTime: '2 min',
    image: media.rua,
    body: [
      'Canal aberto para moradores reportarem problemas e colaborarem com correções.',
      'WhatsApp para contato: (15) 99859-1411.',
      'Fonte: Instagram @heitordagelsa — post Dcl-Z9etEMT.',
    ],
    source: 'Instagram @heitordagelsa — post Dcl-Z9etEMT',
  },
  {
    slug: 'presenca-comunitaria',
    category: 'COMUNIDADE',
    title: 'Presença e proximidade com moradores',
    date: '2024',
    summary: 'Registro de visita e escuta com moradores em Capão Bonito.',
    readTime: '3 min',
    image: media.comunidade,
    body: [
      'Registro de proximidade com moradores durante atividade em Capão Bonito.',
      'Fonte: Instagram @heitordagelsa — post DcJ7Vv8t2_L.',
    ],
    source: 'Instagram @heitordagelsa — post DcJ7Vv8t2_L',
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export const projects: Project[] = [
  {
    slug: 'acompanhamento-saude-populacao',
    category: 'SAÚDE',
    title: 'Saúde da população e entidades sociais',
    date: '2024',
    location: 'Capão Bonito — SP',
    summary:
      'Registro público sobre saúde da população e entidades sociais, conforme publicação no Instagram.',
    description:
      'Heitor da Gelsa e Daan Cabeleireiro registram apoio ao deputado federal que mais contribuiu para a saúde de Capão Bonito e para entidades sociais da cidade.',
    status: 'REGISTRO PÚBLICO',
    image: media.saude,
    gallery: [media.saude],
    videos: [{ title: 'Ver no Instagram', url: 'https://www.instagram.com/p/Dcj9pQPtFvJ/' }],
    updates: [],
    relatedLinks: [{ label: 'Instagram', url: 'https://www.instagram.com/p/Dcj9pQPtFvJ/' }],
  },
  {
    slug: 'escuta-comunitaria',
    category: 'COMUNIDADE',
    title: 'Escuta com moradores',
    date: '2024',
    location: 'Capão Bonito — SP',
    summary: 'Registro de proximidade e escuta com moradores durante visita comunitária.',
    description:
      'Ação de presença e diálogo com moradores em Capão Bonito — canal aberto para demandas locais.',
    status: 'REGISTRO PÚBLICO',
    image: media.comunidade,
    gallery: [media.comunidade],
    videos: [{ title: 'Ver no Instagram', url: 'https://www.instagram.com/p/DcJ7Vv8t2_L/' }],
    updates: [],
    relatedLinks: [{ label: 'Instagram', url: 'https://www.instagram.com/p/DcJ7Vv8t2_L/' }],
  },
  {
    slug: 'canal-feedback-urbano',
    category: 'CIDADE',
    title: 'Canal de feedback nas ruas',
    date: '2024',
    location: 'Capão Bonito — SP',
    summary: 'Canal aberto para moradores reportarem problemas e colaborarem com correções.',
    description:
      'Presença nas ruas com convite direto ao contato via WhatsApp (15) 99859-1411 para feedback da população.',
    status: 'REGISTRO PÚBLICO',
    image: media.rua,
    gallery: [media.rua],
    videos: [{ title: 'Ver no Instagram', url: 'https://www.instagram.com/p/Dcl-Z9etEMT/' }],
    updates: [],
    relatedLinks: [{ label: 'WhatsApp', url: `https://wa.me/${siteConfig.whatsapp}` }],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export const videos: VideoItem[] = []

export const mapMarkers: MapMarker[] = [
  {
    id: 'centro',
    name: 'Capão Bonito',
    category: 'CIDADE',
    description: 'Cidade de nascimento e atuação pública.',
    date: '—',
    image: media.rua,
    x: 52,
    y: 48,
  },
  {
    id: 'saude',
    name: 'Saúde da população',
    category: 'TEMA',
    description: 'Registro relacionado à saúde pública e entidades sociais.',
    date: '2024',
    image: media.saude,
    link: '/projetos/acompanhamento-saude-populacao',
    x: 65,
    y: 35,
  },
  {
    id: 'comunidade',
    name: 'Visita comunitária',
    category: 'VISITA',
    description: 'Presença e escuta com moradores.',
    date: '2024',
    image: media.comunidade,
    x: 30,
    y: 58,
  },
]

export const featuredItems: FeaturedItem[] = []
