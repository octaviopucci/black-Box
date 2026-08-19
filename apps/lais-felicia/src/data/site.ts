/** Studio Laís Felicia — fonte de verdade: Instagram @studiolaisfelicia + Drive da marca.
 * Copy sem travessao. Nao inventar numeros, depoimentos ou certificados.
 *
 * Estrutura visual: replica da landing Duda Nito (template NODA dark),
 * com fotos, cores e copy proprias da Laís.
 */

export const site = {
  name: 'Laís Felicia',
  studio: 'Studio Laís Felicia',
  role: 'Especialista em sobrancelhas',
  city: 'Capão Bonito/SP',
  headline: 'Laís Felicia',
  lead: 'Olá, eu sou Laís Felicia, designer de sobrancelhas e apaixonada por transformar autoestima em confiança.',
  description:
    'Studio Laís Felicia em Capão Bonito/SP. Design de sobrancelhas, henna e brow lamination. Cuidando de olhares há 10 anos. Agende pelo WhatsApp.',
  promise: 'Cuidando de olhares há 10 anos.',
  aboutLead:
    'Designer de sobrancelhas em Capão Bonito, com foco em naturalidade, simetria e um desenho que respeita o seu rosto.',
  aboutBody:
    'Há 10 anos a Laís cuida de olhares no studio. Ela também capacita alunas do zero à prática, com método RT, henna profissional e o protocolo que usa no atendimento.',
  instagram: 'https://www.instagram.com/studiolaisfelicia',
  instagramHandle: '@studiolaisfelicia',
  phone: {
    label: '(15) 99857-5128',
    href: 'tel:+5515998575128',
  },
  whatsapp: {
    number: '5515998575128',
    message: 'Olá! Vim pelo site e gostaria de agendar meu design de sobrancelhas.',
    courseMessage: 'Olá! Vim pelo site e quero informações sobre o curso.',
  },
  address: 'Rua Floriano Peixoto, 310',
  landmark: 'Em frente à loja Clamarroca',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Floriano+Peixoto+310+Capão+Bonito+SP',
  payment: ['Pix', 'Cartão', 'Dinheiro'],
  followers: '7,4 mil',
  years: 10,
  hours: [
    { days: 'Atendimento', hours: 'Com hora marcada' },
    { days: 'Cursos', hours: 'Turmas presenciais' },
    { days: 'Confirmação', hours: 'Um dia antes' },
  ],
  nav: [
    { label: 'Início', href: '#topo' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Cursos', href: '#cursos' },
    { label: 'FAQ', href: '#faq' },
  ],
} as const

export const heroVideo = {
  src: 'hero-scrub.mp4',
  poster: 'hero-scrub-poster.jpg',
  fallback: 'portrait.jpg',
  scrollLength: 2.4,
} as const

export const skills = [
  'Correção e simetria',
  'Método RT de marcação',
  'Design com henna',
  'Design de sobrancelhas',
  'Brow lamination',
  'Cursos profissionalizantes',
  'Atendimento e fidelização',
] as const

export const stats = [
  { value: `+${site.years}`, label: 'Anos de experiência' },
  { value: site.followers, label: 'Seguidoras no Instagram' },
  { value: '2', label: 'Trilhas de formação' },
  { value: 'RT', label: 'Método próprio de marcação' },
] as const

export const serviceHighlights = [
  {
    id: 'design',
    name: 'Design de sobrancelhas',
    price: 'R$ 45',
    line: 'Leitura do rosto e método RT.',
    image: 'result-face.jpg',
    imageAlt: 'Close do olhar com design personalizado',
    href: '/servicos#design',
  },
  {
    id: 'henna',
    name: 'Design com henna',
    price: 'R$ 50',
    line: 'Cor e preenchimento ombré.',
    image: 'apply.jpg',
    imageAlt: 'Aplicação de henna em modelo real',
    href: '/servicos#henna',
  },
  {
    id: 'brow',
    name: 'Brow lamination',
    price: 'R$ 100',
    line: 'Fios alinhados e direcionados.',
    image: 'result-lam.jpg',
    imageAlt: 'Brow lamination com fios alinhados',
    href: '/servicos#brow',
  },
  {
    id: 'coloracao',
    name: 'Design com coloração',
    price: 'R$ 60',
    line: 'Definição alinhada ao olhar.',
    image: 'result-smile.jpg',
    imageAlt: 'Resultado de design com acabamento natural',
    href: '/servicos#coloracao',
  },
] as const

export const services = [
  {
    id: 'design',
    name: 'Design de sobrancelha',
    price: 'R$ 45',
    text: 'Leitura do rosto, marcação e epilação para um desenho que respeita o seu traço.',
    image: 'map.jpg',
  },
  {
    id: 'henna',
    name: 'Design com henna',
    price: 'R$ 50',
    text: 'Cor e preenchimento com henna profissional. O acabamento ombré deixa o olhar marcado sem parecer maquiagem.',
    image: 'apply.jpg',
  },
  {
    id: 'coloracao',
    name: 'Design com coloração',
    price: 'R$ 60',
    text: 'Para quem quer fios alinhados à cor do olhar, com definição mais suave.',
    image: 'result-smile.jpg',
  },
  {
    id: 'brow',
    name: 'Brow lamination',
    price: 'R$ 100',
    text: 'Fios alinhados, volume e direção. Com cuidado em casa, o resultado pode durar até 45 dias.',
    image: 'result-lam.jpg',
  },
  {
    id: 'descoloracao',
    name: 'Descoloração',
    price: 'R$ 40',
    text: 'Abre a cor dos fios quando o desenho pede mais luz e harmonia.',
    image: 'products.jpg',
  },
  {
    id: 'retoque',
    name: 'Retoque de henna',
    price: 'R$ 25',
    text: 'Mantém o preenchimento entre os retornos. A henna, com cuidado, dura até 10 dias.',
    image: 'result.jpg',
  },
] as const

export const extras = [
  { name: 'Buço', price: 'R$ 10' },
  { name: 'Costeleta', price: 'R$ 20' },
  { name: 'Partes avulsas', price: 'R$ 10' },
  { name: 'Rosto completo', price: 'R$ 60' },
] as const

export const plans = [
  { name: '2 designs de sobrancelha', price: 'R$ 70' },
  { name: '2 designs com henna', price: 'R$ 80' },
  { name: '1 design com henna + 1 retoque', price: 'R$ 60' },
  { name: 'Plano Plus · até 8 atendimentos no mês', price: 'R$ 179' },
] as const

export const courses = [
  {
    id: 'iniciante',
    kicker: 'Iniciante',
    title: 'Design com Henna',
    price: 'R$ 1.300',
    includes: 'Kit completo e certificado · 2 dias presenciais',
    image: 'course-setup.jpg',
    imageAlt: 'Estações do curso iniciante com kit, apostila e caixa branca com fita rosa',
    items: [
      'Materiais e produtos utilizados',
      'Método RT de marcação para todos os formatos',
      'Correção dos principais erros no design',
      'Henna profissional: preparo, aplicação e cores',
      'Demonstração completa em modelo real',
      'Prática supervisionada em 2 modelos',
      'Atendimento, fidelização e fotos que vendem',
    ],
  },
  {
    id: 'henna',
    kicker: 'Especialização',
    title: 'Henna',
    price: 'R$ 1.100',
    includes: 'Kit completo e certificado · 1 dia presencial',
    image: 'kit.jpg',
    imageAlt: 'Kit do curso com henna La Benig, régua da marca e materiais de design',
    items: [
      'Colorimetria avançada da henna',
      'Marcação estratégica para diferentes formatos',
      'Técnicas de acabamento e maior durabilidade',
      'Correção de falhas',
      'Protocolo de atendimento e fidelização',
      'Fotos e overdelivery para gerar indicações',
    ],
  },
] as const

export const courseGallery = [
  { file: 'classroom.jpg', alt: 'Sala do curso presencial com alunas e kits' },
  { file: 'course-setup.jpg', alt: 'Estações preparadas com apostila e caixa com fita rosa' },
  { file: 'practice.jpg', alt: 'Exercício de marcação à mão livre no caderno' },
  { file: 'kiwi.jpg', alt: 'Treino de epilação com linha em fruta' },
  { file: 'swatches.jpg', alt: 'Cartelas de degradação de henna La Benig e Glance' },
  { file: 'kit.jpg', alt: 'Kit completo do curso com henna e materiais' },
  { file: 'teach.jpg', alt: 'Laís explicando o método durante a formação' },
  { file: 'cert.jpg', alt: 'Entrega de certificado no studio' },
] as const

export const studentNote = {
  text: 'Aprendi tanto com seu curso, amei muito a experiência, foi muito mais do que eu esperava, super completo.',
  from: 'Aluna do curso presencial',
} as const

export const faqs = [
  {
    q: 'Preciso ter experiência para o curso iniciante?',
    a: 'Não. O curso de 2 dias foi feito para quem está começando: teoria, demonstração em modelo e prática supervisionada em 2 modelos reais, com kit e certificado.',
  },
  {
    q: 'Os cursos têm kit e certificado?',
    a: 'Sim. O iniciante (R$ 1.300) e a especialização henna (R$ 1.100) incluem kit completo e certificado.',
  },
  {
    q: 'Como funciona o design?',
    a: 'Começo pela leitura do seu rosto e da densidade dos fios. Depois vem a marcação pelo método RT, a epilação e, se combinarmos, a henna ou a coloração. No fim, oriento a manutenção e o retorno.',
  },
  {
    q: 'O design é personalizado?',
    a: 'Sim. O método RT de marcação existe para todos os formatos, sem um molde único. O caso de densidade baixa, por exemplo, pede outro caimento do que uma sobrancelha cheia.',
  },
  {
    q: 'Posso fazer mesmo tendo falhas?',
    a: 'Pode. A henna preenche e a especialização da Laís inclui correção de falhas. O desenho é pensado para a estrutura que você já tem.',
  },
  {
    q: 'Quanto tempo dura o resultado?',
    a: 'A henna, com cuidado em casa, pode durar até 10 dias. A brow lamination pode chegar a 45 dias. Para manter o design, o retorno é a cada 20 dias. Depois da brow, o design nutritivo entra em torno de 25 dias.',
  },
  {
    q: 'O procedimento dói?',
    a: 'A sensibilidade muda de pessoa para pessoa. O atendimento é feito com calma, sem pressa de terminar. Se algo incomodar, você fala na hora.',
  },
  {
    q: 'Como faço para agendar?',
    a: 'Pelo WhatsApp (15) 99857-5128. A confirmação chega um dia antes. Responda para garantir o horário. Formas de pagamento: Pix, cartão ou dinheiro.',
  },
  {
    q: 'Onde fica o atendimento?',
    a: 'Rua Floriano Peixoto, 310, Capão Bonito/SP, em frente à loja Clamarroca.',
  },
] as const

export function asset(file: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${file.replace(/^\//, '')}`
}

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
