export const site = {
  name: 'Porthal Imóveis',
  legalName: 'Porthal Imóveis Consultoria Imobiliária',
  tagline: 'Imóvel moeda forte',
  headline: 'Transformando seus sonhos em realidade',
  description:
    'Compra, venda e aluguel de imóveis com transparência e atendimento especializado em Capão Bonito e região.',
  about: [
    'Precisando de uma solução ou querendo investir no mercado imobiliário, conte com a máxima transparência e atenção de corretor especializado.',
    'Somos especializados na compra, venda e aluguel de imóveis, prestamos toda assessoria necessária à realização de uma transação segura e tranquila, com acompanhamento jurídico e operacional de qualidade.',
    'Reconhecidos pela ética profissional e transparência no mercado imobiliário, oferecemos a nossos clientes um atendimento personalizado, resultando em segurança e satisfação a todos os negócios realizados.',
  ],
  pillars: [
    {
      title: 'Transparência',
      text: 'Valores à vista claros e comunicação direta em cada etapa da negociação.',
    },
    {
      title: 'Ética',
      text: 'Assessoria jurídica e operacional para transações seguras e tranquilas.',
    },
    {
      title: 'Proximidade',
      text: 'Atendimento personalizado em Capão Bonito e região, do primeiro contato à chave.',
    },
  ],
  cnpj: '27.294.878/0001-33',
  address: 'Rua Nove de Julho, 210 — Comercial, Centro — Capão Bonito/SP, 18300-050',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Nove+de+Julho,+210,+Centro,+Cap%C3%A3o+Bonito+SP',
  email: 'adm@porthalimoveis.com.br',
  phones: [
    { label: '(15) 99632-0890', href: 'tel:+5515996320890', whatsapp: true },
    { label: '(15) 99736-2711', href: 'tel:+5515997362711', whatsapp: true },
    { label: '(15) 3542-2530', href: 'tel:+551535422530', whatsapp: false },
  ],
  whatsapp: {
    number: '5515996320890',
    message: 'Olá! Vim pelo site da Porthal Imóveis e gostaria de atendimento.',
  },
  social: {
    instagram: 'https://www.instagram.com/porthal.imoveis/',
    facebook: 'https://www.facebook.com/porthalimoveis/',
    youtube: 'https://www.youtube.com/@porthalimoveis',
  },
  logo: `${import.meta.env.BASE_URL}logo.png`,
  originalSite: 'https://porthalimoveis.com.br/',
} as const

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}
