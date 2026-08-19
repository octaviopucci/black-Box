export const media = {
  profile: '/instagram/profile.jpg',
  hero: '/instagram/post-6.jpg',
  heroVideo: '/media/clinic-exterior.mp4',
  doctor: '/media/founder-eny-mussi.jpg',
  clinic: '/instagram/post-4.jpg',
  spa: '/instagram/post-2.jpg',
  testimonialVideo: '/media/testimonial-fernanda.mp4',
  gallery: [
    '/instagram/post-1.jpg',
    '/instagram/post-2.jpg',
    '/instagram/post-3.jpg',
    '/instagram/post-4.jpg',
    '/instagram/post-5.jpg',
    '/instagram/post-6.jpg',
  ],
  team: {
    eny: '/team/eny-mussi.jpg',
    marcia: '/team/marcia.jpg',
    samie: '/team/dra-samiebaptista.jpg',
    gislene: '/team/psi-gislenevilas.jpg',
    thici: '/team/thici_lashdesigner.jpg',
    vania: '/team/vania-rodrigues1211.jpg',
    ana: '/team/anaaa_mussi.jpg',
    enidelcy: '/team/enidelcy.jpg',
    esteticaSorocaba: '/team/esteticasorocaba__.jpg',
  },
} as const

export const site = {
  brand: {
    short: 'Mussi',
    legal: 'Clínica Mussi Estética Avançada',
    alternate: 'Mussi Estética Facial e Corporal',
    promise:
      'Variedade de procedimentos em um só lugar, com profissionais qualificados e resultados com segurança e excelência.',
    niche: 'Clínica estética facial e corporal',
    city: 'Sorocaba',
    state: 'SP',
    followers: 2521,
  },
  doctor: {
    name: 'Eny Mussi',
    handle: '@clinicamussiestetica',
    note: 'Fundadora · Clínica Mussi Estética',
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
  procedures: [
    {
      id: 'spa-day',
      title: 'Spa Day Mussi',
      lead: 'O verdadeiro luxo é parar e, por algumas horas, ser cuidada em cada detalhe.',
      note: 'Experiência publicada no Instagram — desacelerar, relaxar e voltar para si.',
      image: media.spa,
    },
    {
      id: 'estetica-facial-corporal',
      title: 'Procedimentos estéticos',
      lead: 'Facial e corporal em um só lugar, com equipe preparada para o melhor atendimento.',
      note: 'Copy extraída de publicação oficial: segurança, excelência e autocuidado.',
      image: media.hero,
    },
    {
      id: 'experiencia-mussi',
      title: 'Experiência Mussi',
      lead: 'Cuidado que vai além da estética — percebido em cada detalhe.',
      note: 'Depoimentos e reels destacam acolhimento, ambiente e resultado na autoestima.',
      image: media.clinic,
    },
  ],
  teamIntro: {
    lead: 'Você merece um cuidado que vai além da estética.',
    body: 'Há 20 anos, construímos um espaço onde técnica, acolhimento e confiança caminham juntos. Cada profissional contribui com sua especialidade para que você tenha uma experiência completa.',
    source: 'Instagram @clinicamussiestetica',
  },
  professionals: [
    {
      id: 'eny',
      name: 'Eny Mussi',
      role: 'Fundadora',
      description:
        'A Clínica Mussi nasceu da soma de todas as experiências, aprendizados e amores que habitam a Eny Mussi. Do primeiro passo que você dá na Mussi até cada tratamento, tudo é convite para reencontrar a si mesma(o).',
      photo: media.team.eny,
      featured: true,
      source: 'Instagram @clinicamussiestetica',
    },
    {
      id: 'marcia',
      name: 'Márcia',
      role: 'Recepção e acolhimento',
      description:
        'Porque uma experiência de cuidado também precisa transmitir acolhimento, segurança e tranquilidade desde o primeiro olá. A Márcia faz parte de quem torna essa experiência possível todos os dias.',
      photo: media.team.marcia,
      featured: true,
      source: 'Instagram @clinicamussiestetica',
    },
    {
      id: 'samie',
      name: 'Dra. Samie Baptista',
      role: 'Equipe clínica',
      description:
        'Profissional associada em publicação oficial da clínica — cada especialidade contribui para uma experiência completa, respeitando sua história e individualidade.',
      photo: media.team.samie,
      instagram: 'https://www.instagram.com/dra.samiebaptista',
      source: 'Instagram @clinicamussiestetica',
    },
    {
      id: 'gislene',
      name: 'Gislene Vilas Boas',
      role: 'Psicologia',
      description:
        'Profissional associada em publicação oficial da clínica, presente nas experiências Mussi publicadas no Instagram.',
      photo: media.team.gislene,
      instagram: 'https://www.instagram.com/psi.gislenevilas',
      source: 'Instagram @clinicamussiestetica',
    },
    {
      id: 'thici',
      name: 'Thici',
      role: 'Lash designer',
      description:
        'Profissional associada em publicação oficial da clínica — especialidade em design de cílios, conforme perfil @thici_lashdesigner.',
      photo: media.team.thici,
      instagram: 'https://www.instagram.com/thici_lashdesigner',
      source: 'Instagram @clinicamussiestetica',
    },
    {
      id: 'vania',
      name: 'Vania Rodrigues',
      role: 'Equipe',
      description: 'Profissional associada em publicação oficial da clínica.',
      photo: media.team.vania,
      instagram: 'https://www.instagram.com/vania.rodrigues1211',
      source: 'Instagram @clinicamussiestetica',
    },
    {
      id: 'ana',
      name: 'Ana Mussi',
      role: 'Equipe',
      description: 'Profissional associada em publicação oficial da clínica.',
      photo: media.team.ana,
      instagram: 'https://www.instagram.com/anaaa_mussi',
      source: 'Instagram @clinicamussiestetica',
    },
    {
      id: 'enidelcy',
      name: 'Enidelcy Mussi',
      role: 'Equipe',
      description: 'Profissional associada em publicação oficial da clínica.',
      photo: media.team.enidelcy,
      instagram: 'https://www.instagram.com/enidelcy',
      source: 'Instagram @clinicamussiestetica',
    },
    {
      id: 'estetica-sorocaba',
      name: 'Estética Sorocaba',
      role: 'Parceira · Spa Day Mussi',
      description:
        'Profissional associada em publicação oficial da clínica — coautora da experiência Spa Day Mussi.',
      photo: media.team.esteticaSorocaba,
      instagram: 'https://www.instagram.com/esteticasorocaba__',
      source: 'Instagram @clinicamussiestetica',
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
      line: 'Quando o cuidado é verdadeiro, ele é percebido.',
      source: 'Instagram @clinicamussiestetica',
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
    {
      id: 'fernanda',
      author: 'Fernanda',
      date: 'Instagram',
      quote:
        'Viveu a experiência Mussi e compartilha, com as próprias palavras, como foi se sentir cuidada em cada detalhe.',
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
