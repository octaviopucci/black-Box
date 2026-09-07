export const site = {
  name: 'Black Box',
  legalName: 'Black Box Software Factory',
  slogan: 'VOCÊ IMAGINA. NÓS CONSTRUÍMOS.',
  url: 'https://blckbox.vercel.app',
  email: 'contato@blckbox.dev',
  whatsapp: {
    /** E.164 sem + — Brasil 55 + DDD 15 + número */
    number: '5515996972944',
    display: '(15) 99697-2944',
    message: 'Olá, Black Box. Quero começar um projeto.',
  },
  social: {
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
  },
  nav: [
    { id: 'projetos', label: 'PROJETOS' },
    { id: 'solucoes', label: 'SOLUÇÕES' },
    { id: 'processo', label: 'PROCESSO' },
    { id: 'laboratorio', label: 'LABORATÓRIO' },
    { id: 'sobre', label: 'SOBRE' },
  ],
} as const

export function whatsappUrl(message: string = site.whatsapp.message) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`
}

export function mailtoUrl() {
  return `mailto:${site.email}`
}
