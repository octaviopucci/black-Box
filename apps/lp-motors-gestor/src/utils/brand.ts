import type {
  BrandAparencia,
  BrandAtmosfera,
  BrandPresetId,
  BrandTheme,
  Settings,
} from '@/types'
import { APP_NAME, APP_SHORT } from '@/config/variant'

/** Fotos de luxo (Unsplash) — lazy via CSS background, uma por atmosfera. */
export const ATMOSPHERE_IMAGES: Record<BrandAtmosfera, string> = {
  showroom:
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=70',
  night:
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=70',
  atelier:
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=70',
  carbon:
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=2000&q=70',
}

export const INTRO_IMAGES = [
  ATMOSPHERE_IMAGES.showroom,
  ATMOSPHERE_IMAGES.night,
  ATMOSPHERE_IMAGES.atelier,
]

export const DEFAULT_BRAND: BrandTheme = {
  presetId: 'lp',
  corPrimaria: '#0F766E',
  corSecundaria: '#C4A574',
  corFundo: '#0B1018',
  corSuperficie: '#121A26',
  corTexto: '#E8EEF6',
  corPainel: '#081018',
  aparencia: 'premium',
  atmosfera: 'showroom',
  intensidadeFoto: 42,
}

export type BrandPreset = {
  id: Exclude<BrandPresetId, 'custom'>
  name: string
  description: string
  brand: BrandTheme
}

export const BRAND_PRESETS: BrandPreset[] = [
  {
    id: 'lp',
    name: 'LP Showroom',
    description: 'Noite premium · teal + champagne',
    brand: { ...DEFAULT_BRAND },
  },
  {
    id: 'azul',
    name: 'Sapphire',
    description: 'Azul profundidade · fundo slate',
    brand: {
      presetId: 'azul',
      corPrimaria: '#3B82F6',
      corSecundaria: '#E2C07C',
      corFundo: '#0A1220',
      corSuperficie: '#121C2E',
      corTexto: '#E8F0FF',
      corPainel: '#070D18',
      aparencia: 'premium',
      atmosfera: 'night',
      intensidadeFoto: 48,
    },
  },
  {
    id: 'champagne',
    name: 'Champagne Atelier',
    description: 'Claro sofisticado · ouro suave',
    brand: {
      presetId: 'champagne',
      corPrimaria: '#8B6914',
      corSecundaria: '#1C1917',
      corFundo: '#F3EEE4',
      corSuperficie: '#FFFCF7',
      corTexto: '#1C1917',
      corPainel: '#292524',
      aparencia: 'suave',
      atmosfera: 'atelier',
      intensidadeFoto: 28,
    },
  },
  {
    id: 'racing',
    name: 'Racing Carbon',
    description: 'Alto contraste · vermelho performance',
    brand: {
      presetId: 'racing',
      corPrimaria: '#DC2626',
      corSecundaria: '#F8FAFC',
      corFundo: '#0A0A0B',
      corSuperficie: '#141416',
      corTexto: '#F4F4F5',
      corPainel: '#050505',
      aparencia: 'reta',
      atmosfera: 'carbon',
      intensidadeFoto: 55,
    },
  },
  {
    id: 'obsidian',
    name: 'Obsidian Green',
    description: 'Verde esmeralda · fundo carvão',
    brand: {
      presetId: 'obsidian',
      corPrimaria: '#10B981',
      corSecundaria: '#A78BFA',
      corFundo: '#071410',
      corSuperficie: '#0E1F18',
      corTexto: '#ECFDF5',
      corPainel: '#040C09',
      aparencia: 'premium',
      atmosfera: 'showroom',
      intensidadeFoto: 40,
    },
  },
]

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.replace('#', '').trim()
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export function normalizeHex(hex: string, fallback: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return fallback
  const to = (n: number) => n.toString(16).padStart(2, '0')
  return `#${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}`.toUpperCase()
}

export function shadeHex(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const factor = 1 + amount
  const to = (n: number) => clampByte(n * factor).toString(16).padStart(2, '0')
  return `#${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}`
}

export function mixHex(a: string, b: string, t: number): string {
  const ra = hexToRgb(a)
  const rb = hexToRgb(b)
  if (!ra || !rb) return a
  const m = (x: number, y: number) => clampByte(x + (y - x) * t)
  const to = (n: number) => n.toString(16).padStart(2, '0')
  return `#${to(m(ra.r, rb.r))}${to(m(ra.g, rb.g))}${to(m(ra.b, rb.b))}`
}

export function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

export function luminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 255
}

export function isDarkHex(hex: string): boolean {
  return luminance(hex) < 0.45
}

/** Sugere superfície a partir do fundo (editável depois). */
export function suggestSurface(fundo: string): string {
  return isDarkHex(fundo) ? shadeHex(fundo, 0.16) : mixHex(fundo, '#FFFFFF', 0.72)
}

export function suggestText(fundo: string): string {
  return isDarkHex(fundo) ? '#EEF3F9' : '#121820'
}

export function suggestPainel(fundo: string): string {
  return isDarkHex(fundo) ? shadeHex(fundo, -0.22) : '#1A2332'
}

export function defaultBrandTheme(): BrandTheme {
  return { ...DEFAULT_BRAND }
}

const APARIENCIAS: BrandAparencia[] = ['suave', 'reta', 'premium']
const ATMOSFERAS: BrandAtmosfera[] = ['showroom', 'night', 'atelier', 'carbon']

const PRESET_IDS: BrandPresetId[] = ['lp', 'azul', 'champagne', 'racing', 'obsidian', 'custom']

export function normalizeBrand(raw?: Partial<BrandTheme> | null): BrandTheme {
  const base = defaultBrandTheme()
  if (!raw) return base

  // Upgrade from the old light/static defaults that barely reacted to color picks.
  const prevFundo = normalizeHex(String(raw.corFundo || ''), '')
  const prevAccent = normalizeHex(String(raw.corPrimaria || ''), '')
  const looksLikeLegacyDefault =
    (prevFundo === '#F5F7FA' || prevFundo === '#F1F5F9') &&
    (prevAccent === '#0F766E' || !raw.corSuperficie) &&
    !raw.atmosfera
  if (looksLikeLegacyDefault && (!raw.presetId || raw.presetId === 'lp')) {
    return { ...base }
  }

  const fundo = normalizeHex(raw.corFundo || base.corFundo, base.corFundo)
  const intensidade = Number(raw.intensidadeFoto)
  const legacyPreset = String(raw.presetId || '')
  const presetId: BrandPresetId = PRESET_IDS.includes(legacyPreset as BrandPresetId)
    ? (legacyPreset as BrandPresetId)
    : legacyPreset
      ? 'custom'
      : 'custom'
  return {
    presetId,
    corPrimaria: normalizeHex(raw.corPrimaria || base.corPrimaria, base.corPrimaria),
    corSecundaria: normalizeHex(raw.corSecundaria || base.corSecundaria, base.corSecundaria),
    corFundo: fundo,
    corSuperficie: normalizeHex(
      raw.corSuperficie || suggestSurface(fundo),
      suggestSurface(fundo),
    ),
    corTexto: normalizeHex(raw.corTexto || suggestText(fundo), suggestText(fundo)),
    corPainel: normalizeHex(raw.corPainel || suggestPainel(fundo), suggestPainel(fundo)),
    aparencia: APARIENCIAS.includes(raw.aparencia as BrandAparencia)
      ? (raw.aparencia as BrandAparencia)
      : 'premium',
    atmosfera: ATMOSFERAS.includes(raw.atmosfera as BrandAtmosfera)
      ? (raw.atmosfera as BrandAtmosfera)
      : 'showroom',
    intensidadeFoto: Number.isFinite(intensidade)
      ? Math.max(0, Math.min(100, Math.round(intensidade)))
      : base.intensidadeFoto,
  }
}

export function brandDisplayName(settings: Pick<Settings, 'nomeEmpresa' | 'nomeCurto'>): string {
  return (settings.nomeCurto || settings.nomeEmpresa || APP_SHORT).trim() || APP_SHORT
}

export function brandFullName(settings: Pick<Settings, 'nomeEmpresa'>): string {
  return (settings.nomeEmpresa || APP_NAME).trim() || APP_NAME
}

function radiusFor(aparencia: BrandAparencia): { sm: string; lg: string } {
  if (aparencia === 'reta') return { sm: '0.3rem', lg: '0.45rem' }
  if (aparencia === 'suave') return { sm: '0.85rem', lg: '1.1rem' }
  return { sm: '0.65rem', lg: '0.95rem' }
}

/** Aplica o template da loja nas CSS variables — fundo, superfície, foto e acentos. */
export function applyBrandTheme(settings: Settings, root: HTMLElement = document.documentElement) {
  const brand = normalizeBrand(settings.brand)
  const accent = brand.corPrimaria
  const copper = brand.corSecundaria
  const paper = brand.corFundo
  const surface = brand.corSuperficie
  const ink = brand.corTexto
  const slate = brand.corPainel
  const darkUi = isDarkHex(paper)
  const radius = radiusFor(brand.aparencia)
  const photo = ATMOSPHERE_IMAGES[brand.atmosfera]
  const photoAlpha = brand.intensidadeFoto / 100

  root.style.setProperty('--lp-ink', ink)
  root.style.setProperty('--lp-slate', slate)
  root.style.setProperty('--lp-steel', darkUi ? withAlpha(ink, 0.62) : mixHex(ink, paper, 0.45))
  root.style.setProperty('--lp-mist', darkUi ? withAlpha(ink, 0.06) : mixHex(paper, ink, 0.06))
  root.style.setProperty('--lp-paper', paper)
  root.style.setProperty('--lp-surface', surface)
  root.style.setProperty('--lp-line', darkUi ? withAlpha(ink, 0.12) : withAlpha(ink, 0.1))
  root.style.setProperty('--lp-accent', accent)
  root.style.setProperty('--lp-accent-dim', shadeHex(accent, -0.16))
  root.style.setProperty('--lp-accent-soft', withAlpha(accent, 0.16))
  root.style.setProperty('--lp-copper', copper)
  root.style.setProperty('--lp-glow', withAlpha(accent, 0.35))
  root.style.setProperty('--lp-radius', radius.sm)
  root.style.setProperty('--lp-radius-lg', radius.lg)
  root.style.setProperty('--lp-photo', `url("${photo}")`)
  root.style.setProperty('--lp-photo-opacity', String(photoAlpha))
  root.style.setProperty(
    '--lp-wash',
    `radial-gradient(ellipse 80% 55% at 10% -10%, ${withAlpha(accent, darkUi ? 0.28 : 0.16)}, transparent 55%),
     radial-gradient(ellipse 70% 50% at 100% 100%, ${withAlpha(copper, darkUi ? 0.18 : 0.1)}, transparent 50%)`,
  )

  root.classList.toggle('dark', darkUi || settings.modoEscuro || settings.tema === 'dark')
  root.dataset.brandPreset = brand.presetId
  root.dataset.brandAparencia = brand.aparencia
  root.dataset.brandAtmosfera = brand.atmosfera

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', paper)
}

export function readLogoAsDataUrl(file: File, maxBytes = 700_000): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Envie uma imagem (PNG, JPG ou SVG).'))
      return
    }
    if (file.size > maxBytes) {
      reject(new Error('Logo muito grande. Use até ~700 KB.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo da logo.'))
    reader.readAsDataURL(file)
  })
}
