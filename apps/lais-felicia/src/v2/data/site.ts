import { asset, courseGallery, site, whatsappUrl } from '../../data/site'

export { asset, site, whatsappUrl }

export function v2Asset(file: string) {
  return asset(`v2/${file.replace(/^v2\//, '')}`)
}

export const v2Stats = [
  { value: `+${site.years}`, label: 'Anos de experiência' },
  { value: site.followers, label: 'Seguidoras no Instagram' },
  { value: '2', label: 'Trilhas de formação' },
  { value: 'RT', label: 'Método de marcação' },
] as const

export const v2ServiceHighlights = [
  {
    id: 'design',
    name: 'Design de sobrancelha',
    image: 'design-sobrancelha.jpg',
    imageAlt: 'Antes e depois de design de sobrancelha',
    href: '/servicos#design',
  },
  {
    id: 'spa',
    name: 'Spa labial',
    image: 'spa-labial.jpg',
    imageAlt: 'Spa labial com acabamento glossy',
    href: '/servicos#spa',
  },
  {
    id: 'tintura',
    name: 'Tintura',
    image: 'tintura.jpg',
    imageAlt: 'Antes e depois de tintura',
    href: '/servicos#tintura',
  },
  {
    id: 'henna',
    name: 'Henna ombré',
    image: 'henna-ombre.jpg',
    imageAlt: 'Resultado de henna ombré',
    href: '/servicos#henna',
  },
  {
    id: 'coloracao',
    name: 'Design com coloração',
    image: 'design-coloracao.jpg',
    imageAlt: 'Antes e depois de design com coloração',
    href: '/servicos#coloracao',
  },
  {
    id: 'brow',
    name: 'Brow lamination',
    image: 'brow-lamination.jpg',
    imageAlt: 'Antes e depois de brow lamination',
    href: '/servicos#brow',
  },
  {
    id: 'brow-tintura',
    name: 'Brow lamination com tintura',
    image: 'brow-lamination-tintura.jpg',
    imageAlt: 'Resultado de brow lamination com tintura',
    href: '/servicos#brow-tintura',
  },
  {
    id: 'costeleta',
    name: 'Epilação costeleta',
    image: 'epilacao-costeleta.jpg',
    imageAlt: 'Antes e depois de epilação de costeleta',
    href: '/servicos#costeleta',
  },
  {
    id: 'facial',
    name: 'Epilação facial',
    image: 'epilacao-facial.jpg',
    imageAlt: 'Antes e depois de epilação facial',
    href: '/servicos#facial',
  },
] as const

export const v2Testimonials = [
  {
    file: 'depoimento-01.jpg',
    alt: 'Depoimento de aluna sobre o curso no Instagram',
  },
  {
    file: 'depoimento-02.jpg',
    alt: 'Depoimento de aluna sobre o curso iniciante',
  },
  {
    file: 'depoimento-03.jpg',
    alt: 'Depoimento de aluna sobre curso de aperfeiçoamento',
  },
] as const

type V2CoursePhoto = {
  file: string
  alt: string
  caption: string
  v2?: boolean
  objectPosition?: string
  featured?: boolean
}

export const v2CoursePhotos: readonly V2CoursePhoto[] = [
  {
    file: 'material-apoio.jpg',
    alt: 'Guia de treinos e apostila do curso iniciante',
    caption: 'Material de apoio — guia de treinos e curso iniciante',
    v2: true,
  },
  {
    file: 'curso-certificado.jpg',
    alt: 'Entrega de certificado de curso',
    caption: 'Certificado ao final da formação',
    v2: true,
    objectPosition: 'center 42%',
    featured: true,
  },
  ...courseGallery
    .filter((item) => item.file !== 'course-setup.jpg' && item.file !== 'cert.jpg')
    .map((item) => ({
      file: item.file,
      alt: item.alt,
      caption: item.alt,
    })),
  {
    file: 'material-complementar.jpg',
    alt: 'Material complementar — estações com kit, apostila e mimo',
    caption: 'Material complementar — kit, apostila e mimo no curso',
    v2: true,
  },
]

export const v2CourseBonus = {
  file: 'henna-ombre-edicao.jpg',
  alt: 'Bônus de edição de foto para redes sociais',
  caption: 'Bônus: fotos que vendem',
} as const

/** Experiência no studio: café → bancada → procedimentos */
export const v2ExperienceGallery = [
  { file: 'experiencia-cafe.jpg', alt: 'Experiência — café e mimo' },
  { file: 'experiencia-bancada.jpg', alt: 'Bancada de atendimento preparada' },
  { file: 'design-sobrancelha.jpg', alt: 'Design de sobrancelha — antes e depois' },
  { file: 'tintura.jpg', alt: 'Tintura — antes e depois' },
  { file: 'henna-ombre.jpg', alt: 'Henna ombré — resultado' },
  { file: 'design-coloracao.jpg', alt: 'Design com coloração — antes e depois' },
  { file: 'brow-lamination.jpg', alt: 'Brow lamination — antes e depois' },
  { file: 'brow-lamination-tintura.jpg', alt: 'Brow lamination com tintura' },
  { file: 'epilacao-costeleta.jpg', alt: 'Epilação costeleta — antes e depois' },
  { file: 'epilacao-facial.jpg', alt: 'Epilação facial — antes e depois' },
  { file: 'spa-labial.jpg', alt: 'Spa labial' },
  { file: 'experiencia-procedimento.jpg', alt: 'Procedimento de design no studio' },
] as const
