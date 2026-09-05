export type Locale = "pt" | "en" | "fr";

export type NavItem = { label: string; href: string };

export type StatItem = {
  value: number;
  label: string;
  suffix?: string;
};

export type StyleItem = {
  title: string;
  tagline: string;
  desc: string;
};

export type ProcessStep = {
  step: string;
  title: string;
  desc: string;
};

export type Testimonial = {
  name: string;
  style: string;
  text: string;
};

export type FormOptions = {
  bodyParts: string[];
  sizes: string[];
  styles: string[];
};

export type Messages = {
  meta: { title: string; description: string; ogDescription: string };
  nav: NavItem[];
  principles: string[];
  stats: StatItem[];
  styles: StyleItem[];
  artistTags: string[];
  artistStory: { title: string; paragraphs: string[] };
  process: ProcessStep[];
  testimonials: Testimonial[];
  formOptions: FormOptions;
  hours: string;
  hero: {
    name: "André Venturelli",
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaQuote: string;
    ctaWorks: string;
  };
  about: {
    label: string;
    title: string;
    artistLabel: string;
    paragraphs: string[];
    imageAlt: string;
  };
  gallery: {
    label: string;
    title: string;
    filters: {
      all: string;
      realismo: string;
      cobertura: string;
      delicadas: string;
      estilos: string;
    };
    swipeHint: string;
    workAlt: string;
    workEnlarged: string;
    of: string;
    scrollLeft: string;
    scrollRight: string;
    close: string;
    prev: string;
    next: string;
  };
  stylesSection: {
    label: string;
    title: string;
    seeWorks: string;
  };
  processSection: {
    label: string;
    title: string;
  };
  artist: {
    label: string;
    title: string;
    paragraphs: string[];
    imageAlt: string;
  };
  testimonialsSection: {
    label: string;
    title: string;
    prev: string;
    next: string;
  };
  artistStorySection: {
    label: string;
  };
  quoteForm: {
    label: string;
    title: string;
    subtitle: string;
    placeholders: {
      name: string;
      whatsapp: string;
      email: string;
      age: string;
      city: string;
      bodyPart: string;
      size: string;
      style: string;
      description: string;
      availability: string;
    };
    hasReference: string;
    submit: string;
  };
  instagram: {
    title: string;
    cta: string;
    imageAlt: string;
  };
  location: {
    label: string;
    title: string;
    mapTitle: string;
    address: string;
    hours: string;
    directions: string;
    studioPhotoAlt: string;
  };
  ctaBand: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    button: string;
  };
  footer: {
    tagline: string;
    quickLinks: string;
    contact: string;
    rights: string;
  };
  navbar: {
    brand: string;
    brandAria: string;
    quote: string;
    openMenu: string;
    closeMenu: string;
  };
  scroll: string;
  whatsapp: {
    fabAria: string;
    fabMessage: string;
    quoteIntro: string;
    quoteRequest: string;
    fields: {
      name: string;
      whatsapp: string;
      email: string;
      age: string;
      city: string;
      bodyPart: string;
      size: string;
      style: string;
      description: string;
      availability: string;
      reference: string;
      referenceNote: string;
    };
  };
  language: {
    pt: string;
    en: string;
    fr: string;
    switchTo: string;
  };
};

export const locales: { code: Locale; flag: string; label: string }[] = [
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
];

export const localeHtmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
  fr: "fr",
};
