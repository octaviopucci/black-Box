export const media = {
  profile: 'instagram/profile.jpg',
  hero: 'instagram/post-6.jpg',
  studio: 'instagram/post-8.jpg',
  brand: 'instagram/profile.jpg',
  gallery: [
    'instagram/post-1.jpg',
    'instagram/post-2.jpg',
    'instagram/post-3.jpg',
    'instagram/post-4.jpg',
    'instagram/post-5.jpg',
    'instagram/post-6.jpg',
    'instagram/post-7.jpg',
    'instagram/post-8.jpg',
    'instagram/post-9.jpg',
    'instagram/post-10.jpg',
    'instagram/post-11.jpg',
    'instagram/post-12.jpg',
    'instagram/post-13.jpg',
    'instagram/post-14.jpg',
    'instagram/post-15.jpg',
  ],
} as const

export const site = {
  name: 'Octávio Pucci',
  fullName: 'Octávio Pucci Tattoo',
  brand: 'OCTÁVIO PUCCI',
  mantra: 'Predestinado',
  tagline: 'Tatuador · Studio Privado',
  headline: 'Arte que nasce para permanecer.',
  description:
    'Octávio Pucci — tatuador em Capão Bonito/SP. Realismo preto e cinza, coberturas e fine line em studio privado. 12 anos de experiência. Orçamentos pelo WhatsApp.',
  promise: 'Composição autoral, técnica cirúrgica e presença do início ao último traço.',
  instagram: 'https://www.instagram.com/octaviopuccitattoo',
  instagramHandle: '@octaviopuccitattoo',
  phone: {
    label: '(15) 99749-9178',
    href: 'tel:+5515997499178',
  },
  whatsapp: {
    number: '5515997499178',
    message:
      'Olá, Octávio! Vim pelo site e quero orçar um projeto de tatuagem.',
  },
  city: 'Capão Bonito/SP',
  studio: 'Studio Privado · Capão Bonito/SP',
  years: 12,
  followers: 6834,
  followersLabel: '6.8k',
  nav: [
    { label: 'Credo', href: '#credo' },
    { label: 'Linguagens', href: '#linguagens' },
    { label: 'Arquivo', href: '#arquivo' },
    { label: 'Ritual', href: '#ritual' },
    { label: 'Estúdio', href: '#estudio' },
    { label: 'Orçar', href: '#orcar' },
  ],
  manifesto: [
    'Há marcas que você escolhe.',
    'Há marcas que te encontram.',
    'No studio, o destino vira pele.',
  ],
  story: [
    'Doze anos transformando histórias em composição permanente.',
    'Realismo preto e cinza, coberturas sem cara de cobertura, e fine line com precisão de atelier — em um studio privado em Capão Bonito/SP.',
  ],
} as const

export type Language = {
  id: string
  title: string
  line: string
  detail: string
  image: string
  accent: string
}

export const languages: Language[] = [
  {
    id: 'realismo',
    title: 'Realismo preto & cinza',
    line: 'Volume, luz e pele que respira',
    detail:
      'Fechamentos de braço em sessão marathon, retratos e grandes composições — atenção máxima do primeiro ao último traço, como publicado no Instagram.',
    image: media.gallery[4],
    accent: 'Black & Grey',
  },
  {
    id: 'cobertura',
    title: 'Coberturas & reformas',
    line: 'O passado some. A arte aparece.',
    detail:
      'Composição 100% autoral sobre pele marcada — coberturas que não entregam o que estava embaixo, buscando naturalidade em vez de borrão preto.',
    image: media.gallery[2],
    accent: 'Cover-up',
  },
  {
    id: 'fineline',
    title: 'Fine line & homenagem',
    line: 'Traço fino, intenção pesada',
    detail:
      'Artes exclusivas com significado emocional — homenagens e projetos únicos para quem valoriza durabilidade e dedicação, como descrito nas publicações oficiais.',
    image: media.gallery[1],
    accent: 'Fine Line',
  },
]

export type ArchivePiece = {
  id: string
  title: string
  meta: string
  image: string
  span?: 'tall' | 'wide' | 'square'
  source?: string
}

export const archive: ArchivePiece[] = [
  {
    id: 'hannya',
    title: 'Hannya — fechamento de costas',
    meta: '2 sessões · Black & Grey',
    image: media.gallery[5],
    span: 'tall',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    id: 'arm',
    title: 'Fechamento de braço',
    meta: '20 horas · Uma sessão',
    image: media.gallery[4],
    span: 'tall',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    id: 'cover',
    title: 'Cobertura autoral',
    meta: '3 sessões · Composição narrativa',
    image: media.gallery[2],
    span: 'square',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    id: 'tribute',
    title: 'Homenagem · Filhos',
    meta: 'Arte exclusiva · Realismo',
    image: media.gallery[1],
    span: 'square',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    id: 'knee',
    title: 'Complemento · Joelho',
    meta: 'Sessão em andamento · Detalhes',
    image: media.gallery[3],
    span: 'square',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    id: 'piece-7',
    title: 'Arquivo vivo',
    meta: 'Studio · Black & Grey',
    image: media.gallery[6],
    span: 'tall',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    id: 'piece-11',
    title: 'Sessão em foco',
    meta: 'Realismo · Pele',
    image: media.gallery[10],
    span: 'tall',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    id: 'piece-15',
    title: 'Composição recente',
    meta: 'Instagram · 2025',
    image: media.gallery[14],
    span: 'tall',
    source: 'Instagram @octaviopuccitattoo',
  },
]

export const ritual = [
  {
    step: '01',
    title: 'Ideia',
    description:
      'Você traz a história — homenagem, cobertura, sonho, símbolo. Eu escuto o que precisa viver na pele.',
  },
  {
    step: '02',
    title: 'Arte',
    description:
      'Composição pensada para o seu corpo. Encaixe, fluxo e leitura. Nada genérico. Nada de catálogo.',
  },
  {
    step: '03',
    title: 'Pele',
    description:
      'Sessão com atenção do primeiro ao último traço. Higiene, ritmo e presença — mesmo em 20 horas seguidas.',
  },
  {
    step: '04',
    title: 'Permanência',
    description:
      'Cuidados, cicatrização e o resultado que acompanha a sua vida. A marca fica. A intenção também.',
  },
] as const

export const proofs = [
  {
    text: 'Fechamento de braço em uma única sessão de 20 horas — atenção máxima do primeiro ao último traço.',
    who: 'Publicação oficial · Instagram',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    text: 'Cobertura em 3 sessões com mais de 80% cicatrizado — sem “cara de cobertura”.',
    who: 'Projeto de reforma',
    source: 'Instagram @octaviopuccitattoo',
  },
  {
    text: 'Hannya em fechamento de costas completo em apenas 2 sessões.',
    who: 'Grande composição',
    source: 'Instagram @octaviopuccitattoo',
  },
] as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
