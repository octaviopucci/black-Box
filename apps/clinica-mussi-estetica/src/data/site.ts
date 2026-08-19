export const site = {
  brand: {
    short: 'Mussi',
    legal: 'Clínica Mussi Estética Avançada',
    alternate: 'Mussi Estética Facial e Corporal',
    promise: 'Tratamentos e cuidados visando sempre sua beleza e saúde.',
    niche: 'Clínica estética facial e corporal',
    city: 'Sorocaba',
    state: 'SP',
  },
  contact: {
    whatsapp: '5515981493623',
    whatsappDisplay: '(15) 98149-3623',
    instagram: 'https://www.instagram.com/clinicamussiestetica',
    instagramHandle: '@clinicamussiestetica',
  },
  address: {
    street: 'Rua Dilermando Viêira Borges, 220',
    neighborhood: 'Jardim Nova Ipanema',
    city: 'Sorocaba',
    state: 'SP',
    cep: '18071-000',
    mapsQuery:
      'Mussi+Estética+Facial+e+Corporal,+Rua+Dilermando+Viêira+Borges+220,+Sorocaba',
  },
  hours: {
    label: 'Segunda a sábado',
    open: '09:00',
    close: '19:00',
    note: 'Horário informado em guia local Sorocaba Fácil.',
  },
  proof: {
    source: 'Lista Mais',
    rating: 5,
    count: 5,
  },
  careAreas: [
    {
      id: 'facial',
      title: 'Estética facial',
      note: 'Categoria informada no nome oficial da clínica.',
    },
    {
      id: 'corporal',
      title: 'Estética corporal',
      note: 'Categoria informada no nome oficial da clínica.',
    },
  ],
  experience: [
    {
      id: 'atendimento',
      line: 'Atendimento atencioso e receptivo.',
      source: 'Avaliações públicas em Lista Mais',
    },
    {
      id: 'ambiente',
      line: 'Ambiente limpo e agradável.',
      source: 'Avaliações públicas em Lista Mais',
    },
    {
      id: 'resultado',
      line: 'Resultados que transformam a autoestima.',
      source: 'Depoimento MHPD RJ, Lista Mais',
    },
  ],
  testimonials: [
    {
      id: 'mhpd',
      author: 'MHPD RJ',
      date: '21/06/2022',
      quote:
        'Foi excelente. Eu me sentia muito mal com a minha aparência. Tinha muitos traços, marcas de expressão. Algumas rugas tb. Eu não acreditava no poder do tratamento. Saí de lá outra pessoa. Já indiquei pra vários amigos e amigas. Vale muito a pena. O atendimento é excelente e os preços são ótimos.',
    },
    {
      id: 'karem',
      author: 'Karem Pires',
      date: '17/08/2022',
      quote: 'Sempre muito bem atendida pelas meninas',
    },
    {
      id: 'manu',
      author: 'Manu Duarte',
      date: '19/02/2022',
      quote: 'Super atenciosas, educadas, lugar limpo e agradável, voltarei com certeza',
    },
    {
      id: 'bj',
      author: 'BJ Investimentos B3',
      date: '05/02/2022',
      quote: 'Muito receptivas. Local agradável. Parabéns.',
    },
    {
      id: 'danyllo',
      author: 'Danyllo Paes da Costa',
      date: '13/02/2021',
      quote: 'Super recomendo! Esposa sai linda!',
    },
  ],
} as const

export function whatsappUrl(message?: string) {
  const text = message ?? 'Olá! Gostaria de agendar uma avaliação na Clínica Mussi.'
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`
}

export function mapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${site.address.street}, ${site.address.neighborhood}, ${site.address.city} - ${site.address.state}`,
  )}`
}
