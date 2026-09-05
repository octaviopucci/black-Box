export const site = {
  name: "André Ventureli Tattoo",
  whatsapp: "5515997554244",
  whatsappDisplay: "(15) 99755-4244",
  address: {
    line1: "Av. Washington Luiz, 310 — Sala 81",
    line2: "Jardim Emília, Sorocaba — SP",
    zip: "18031-000",
  },
  hours: `Segunda a Sexta: 9h às 18h
Sábado: 9h às 15h
Domingo: Fechado`,
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4282.777386953107!2d-47.46149825570112!3d-23.51253063759099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c58bee5f1766a7%3A0xcd207bb549d5766!2sAndre%20Ventureli%20Tattoo!5e0!3m2!1spt-BR!2sbr!4v1703544555952!5m2!1spt-BR!2sbr",
  mapsLink:
    "https://maps.google.com/?q=Andre+Ventureli+Tattoo+Av+Washington+Luiz+310+Sorocaba",
  assets: {
    logo: "/brand/logo-white.png",
    logoDark: "/brand/logo.png",
    hero: "/hero/hero-bg.jpg",
    artist: "/hero/andre-sobre.jpg",
  },
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Portfólio", href: "#trabalhos" },
    { label: "Sobre Mim", href: "#sobre" },
    { label: "Meu Studio", href: "#estudio" },
    { label: "Orçamento", href: "#orcamento" },
  ],
  hero: {
    eyebrow: "Sorocaba / SP",
    title: "Sua Tattoo Perfeita Está Aqui",
    subtitle:
      "Realismo preto e cinza, coberturas, delicadas e estilos clássicos — mais de 24 anos transformando ideias em arte permanente.",
    ctaQuote: "Fazer Orçamento",
    ctaWorks: "Ver portfólio",
  },
  heroCards: [
    { label: "Realismo", image: "/hero/realismo.png", href: "#trabalhos", filter: "realismo" },
    { label: "Cobertura", image: "/hero/cobertura.png", href: "#trabalhos", filter: "cobertura" },
    { label: "Delicadas", image: "/hero/delicadas.png", href: "#trabalhos", filter: "delicadas" },
    { label: "Estilos", image: "/hero/estilos.png", href: "#trabalhos", filter: "estilos" },
  ],
  about: {
    label: "O Artista",
    title: "André Ventureli",
    headline:
      "Especialista em tatuagens altamente detalhadas — realismo, coberturas, fineline, oriental e old school.",
    paragraphs: [
      "Sou especialista em tatuagens altamente detalhadas com foco em realismo preto e cinza, coberturas, delicadas (fineline), oriental e old-school. Com mais de 24 anos de experiência, eu aprimorei minha habilidade para criar as tatuagens mais impressionantes que você já viu.",
      "Minha paixão por desenhos me levou a desenvolver incansavelmente minha técnica, sempre desafiando o limite do que é possível. Tenho muito orgulho das minhas criações e trabalho incansavelmente para entregar apenas o melhor para cada um dos meus clientes.",
      "Se você procura por um retrato hiper-realista, uma obra delicada ou uma cobertura de uma tatuagem que não gosta mais, não procure mais. Solicite agora mesmo seu orçamento e prepare-se para transformar sua ideia em realidade.",
    ],
  },
  principles: [
    "PRIVACIDADE",
    "ATENDIMENTO INDIVIDUALIZADO",
    "PROJETOS PRÉ-TATTOO",
    "MATERIAL DE PRIMEIRA LINHA",
    "AMBIENTE CLIMATIZADO",
    "ESTACIONAMENTO NO LOCAL",
    "FÁCIL ACESSO",
  ],
  stats: [
    { value: 24, suffix: "+", label: "Anos de experiência" },
    { value: 100, suffix: "%", label: "Atendimento exclusivo" },
  ],
  studio: {
    label: "Meu Studio",
    title: "O Estúdio — Sorocaba / SP",
    intro:
      "O estúdio, localizado em Sorocaba, a 83 km de São Paulo, proporciona aos clientes uma experiência envolvente no universo da tatuagem.",
    detail:
      "O espaço é confortável, climatizado e amplo, projetado para oferecer arte, boa música e um ambiente limpo. Com ênfase em profissionalismo e paixão pelo trabalho, o estúdio assegura qualidade, segurança e privacidade desde o primeiro contato para projetos/orçamentos até a realização final da tatuagem.",
    images: [
      "/studio/estudio-1.jpg",
      "/studio/estudio-2.jpg",
      "/studio/estudio-3.jpg",
      "/studio/estudio-4.jpg",
      "/studio/estudio-5.jpg",
      "/studio/estudio-6.jpg",
    ],
    amenities: [
      "Privacidade",
      "Atendimento individualizado",
      "Criação de artes e elaboração de projetos pré-tattoo",
      "Material de primeira linha",
      "Ambiente climatizado",
      "Estacionamento no local",
      "Localização de fácil acesso",
    ],
  },
  styles: [
    {
      title: "Realismo Preto e Sombreado",
      tagline: "Conheça meu trabalho",
      desc: "Retratos hiper-realistas, sombras profundas e detalhes que impressionam — cada peça desenvolvida com precisão técnica e olhar artístico.",
      image: "/gallery/realismo/r10.jpg",
      filter: "realismo" as const,
    },
    {
      title: "Coberturas",
      tagline: "Conheça meu trabalho",
      desc: "Reformas e coberturas que devolvem confiança à pele. Projetos pensados para transformar tatuagens antigas em arte nova.",
      image: "/gallery/cobertura/c1.jpg",
      filter: "cobertura" as const,
    },
    {
      title: "Delicadas & Fineline",
      tagline: "Conheça meu trabalho",
      desc: "Traços finos, composições minimalistas e delicadas — ideal para quem busca elegância e sutileza na pele.",
      image: "/gallery/delicadas/d1.jpg",
      filter: "delicadas" as const,
    },
    {
      title: "Oriental, Old School & Outros",
      tagline: "Conheça meu trabalho",
      desc: "Estilos clássicos e contemporâneos com identidade forte — do oriental ao old school, sempre com acabamento impecável.",
      image: "/gallery/estilos/o1.jpg",
      filter: "estilos" as const,
    },
  ],
  artistTags: ["Realismo", "Cobertura", "Fineline", "Old School"],
  testimonials: [
    { name: "Fernando", style: "Google Reviews", text: "Simplesmente fora de série! O André é um profissional diferenciado! Parabéns!! Quanto à minha tattoo, sem comentários! Top demais." },
    { name: "Vinicius", style: "Google Reviews", text: "Pra mim de longe o melhor profissional que conheci! Trabalho espetacular, excelente atendimento, estúdio exclusivo e maravilhoso pronto para você fazer sua tatuagem sozinho e reservado!" },
    { name: "Wagner", style: "Google Reviews", text: "Para quem curte atendimento VIP e qualidade, esse é o cara — André Ventureli. Educado, pontual e, acima de tudo, profissional. Material e trabalho de primeiríssima qualidade." },
    { name: "Nelson", style: "Google Reviews", text: "André é artista, desenhista e seu trabalho é comparável aos melhores tatuadores do mundo. Ótimo papo, atendimento, ambiente." },
    { name: "Gil", style: "Google Reviews", text: "Profissional fantástico. Local muito lindo e limpo. 6 horas de sessão. Resultado fantástico. Recomendo." },
    { name: "Natália", style: "Google Reviews", text: "Studio limpo, aconchegante e MUITO bonito, materiais de primeira linha. André é um artista! Mão leve e traço perfeito!! E com certeza o melhor atendimento que já tive em estúdio." },
    { name: "Luiz", style: "Google Reviews", text: "Fiz uma tatuagem realista do meu filho e ficou sensacional! Atendimento de primeira, super parceiro e tem um estúdio muito legal, limpo, organizado e com um ótimo cafezinho!" },
    { name: "Rosmari", style: "Google Reviews", text: "Fiz uma cobertura que me incomodava há anos com o André, ficou perfeita!!! Ele é perfeccionista e passa segurança com relação ao trabalho a ser feito." },
    { name: "Daniela", style: "Google Reviews", text: "Tattoo ficou do jeito que eu queria, e o André mandou muito bem nas sugestões. Super recomendo o estúdio! Ambiente incrível com muito rock 'n' roll." },
    { name: "Telma", style: "Google Reviews", text: "Profissional extremamente capacitado, estúdio com atendimento exclusivo, material de qualidade, toda família só tatua com André." },
    { name: "Simone", style: "Google Reviews", text: "O André é um excelente profissional... o ambiente é super agradável.. recomendo 100%... inclusive já indiquei para várias pessoas que também amaram o trabalho dele." },
    { name: "Ricardo", style: "Google Reviews", text: "Nota 10... excelente estúdio de tatuagem.. lugar muito agradável e muito limpo e, em especial, o proprietário André Ventureli, excelente profissional, muito atencioso e calmo." },
  ],
  formOptions: {
    bodyParts: ["Braço", "Antebraço", "Ombro", "Costas", "Peito", "Perna", "Coxa", "Panturrilha", "Mão", "Costela", "Pescoço", "Outro"],
    sizes: ["Pequeno (até 10cm)", "Médio (10-20cm)", "Grande (20-30cm)", "Extra grande (30cm+)", "Fechamento / Cobertura"],
    styles: ["Realismo Preto e Cinza", "Cobertura", "Delicadas / Fineline", "Oriental", "Old School", "Outro"],
  },
  gallery: [
    {
        "src": "/gallery/realismo/r1.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r2.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r6.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r7.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r8.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r9.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r10.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r13.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r14.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r15.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r16.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r17.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r18.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r19.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r20.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r21.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r22.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r23.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r24.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r26.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r27.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r29.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r30.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r31.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r32.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/realismo/r33.jpg",
        "category": "realismo" as const
    },
    {
        "src": "/gallery/cobertura/c1.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c2.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c3.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c4.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c5.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c6.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c7.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c8.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c9.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c10.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c11.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c12.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c13.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c14.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/cobertura/c15.jpg",
        "category": "cobertura" as const
    },
    {
        "src": "/gallery/delicadas/d1.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d2.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d3.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d4.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d5.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d6.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d8.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d10.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d11.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d12.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d13.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d14.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d15.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/delicadas/d16.jpg",
        "category": "delicadas" as const
    },
    {
        "src": "/gallery/estilos/o1.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o2.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o3.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o4.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o5.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o6.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o7.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o8.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o9.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o10.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o11.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o12.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o13.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o14.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o15.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o16.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o17.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o18.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o19.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o20.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o21.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o22.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o23.jpg",
        "category": "estilos" as const
    },
    {
        "src": "/gallery/estilos/o24.jpg",
        "category": "estilos" as const
    }
] as const,
} as const;

export type GalleryCategory = "all" | "realismo" | "cobertura" | "delicadas" | "estilos";

export const galleryFilterLabels: Record<Exclude<GalleryCategory, "all">, string> = {
  realismo: "Realismo",
  cobertura: "Coberturas",
  delicadas: "Delicadas",
  estilos: "Estilos",
};
