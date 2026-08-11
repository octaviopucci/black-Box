import type { BrandAparencia, BrandPresetId, BrandTheme, Settings } from '@/types'
import { APP_NAME, APP_SHORT } from '@/config/variant'

export const DEFAULT_BRAND: BrandTheme = {
  presetId: 'lp',
  corPrimaria: '#0F766E',
  corSecundaria: '#B45309',
  corFundo: '#F5F7FA',
  corTexto: '#0C1222',
  corPainel: '#1A2332',
  aparencia: 'suave',
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
    name: 'LP Motors',
    description: 'Teal + cobre — padrão do produto',
    brand: { ...DEFAULT_BRAND },
  },
  {
    id: 'azul',
    name: 'Azul concessionária',
    description: 'Confiança e showroom clássico',
    brand: {
      presetId: 'azul',
      corPrimaria: '#1D4ED8',
      corSecundaria: '#F59E0B',
      corFundo: '#F1F5F9',
      corTexto: '#0F172A',
      corPainel: '#1E293B',
      aparencia: 'suave',
    },
  },
  {
    id: 'vermelho',
    name: 'Vermelho performance',
    description: 'Energia e destaque comercial',
    brand: {
      presetId: 'vermelho',
      corPrimaria: '#B91C1C',
      corSecundaria: '#0F172A',
      corFundo: '#FAFAF9',
      corTexto: '#1C1917',
      corPainel: '#292524',
      aparencia: 'reta',
    },
  },
  {
    id: 'verde',
    name: 'Verde premium',
    description: 'Sofisticação e margem',
    brand: {
      presetId: 'verde',
      corPrimaria: '#166534',
      corSecundaria: '#A16207',
      corFundo: '#F7F7F4',
      corTexto: '#14532D',
      corPainel: '#1A2E1F',
      aparencia: 'suave',
    },
  },
  {
    id: 'noite',
    name: 'Noite showroom',
    description: 'Escuro com acento metálico',
    brand: {
      presetId: 'noite',
      corPrimaria: '#38BDF8',
      corSecundaria: '#FBBF24',
      corFundo: '#0B1220',
      corTexto: '#E2E8F0',
      corPainel: '#111827',
      aparencia: 'reta',
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

export function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

export function defaultBrandTheme(): BrandTheme {
  return { ...DEFAULT_BRAND }
}

export function normalizeBrand(raw?: Partial<BrandTheme> | null): BrandTheme {
  const base = defaultBrandTheme()
  if (!raw) return base
  return {
    presetId: (raw.presetId as BrandPresetId) || 'custom',
    corPrimaria: normalizeHex(raw.corPrimaria || base.corPrimaria, base.corPrimaria),
    corSecundaria: normalizeHex(raw.corSecundaria || base.corSecundaria, base.corSecundaria),
    corFundo: normalizeHex(raw.corFundo || base.corFundo, base.corFundo),
    corTexto: normalizeHex(raw.corTexto || base.corTexto, base.corTexto),
    corPainel: normalizeHex(raw.corPainel || base.corPainel, base.corPainel),
    aparencia: (raw.aparencia as BrandAparencia) === 'reta' ? 'reta' : 'suave',
  }
}

export function brandDisplayName(settings: Pick<Settings, 'nomeEmpresa' | 'nomeCurto'>): string {
  return (settings.nomeCurto || settings.nomeEmpresa || APP_SHORT).trim() || APP_SHORT
}

export function brandFullName(settings: Pick<Settings, 'nomeEmpresa'>): string {
  return (settings.nomeEmpresa || APP_NAME).trim() || APP_NAME
}

/** Aplica o template da loja nas CSS variables do documento. */
export function applyBrandTheme(settings: Settings, root: HTMLElement = document.documentElement) {
  const brand = normalizeBrand(settings.brand)
  const accent = brand.corPrimaria
  const copper = brand.corSecundaria
  const paper = brand.corFundo
  const ink = brand.corTexto
  const slate = brand.corPainel
  const dark = Boolean(settings.modoEscuro || settings.tema === 'dark')

  root.style.setProperty('--lp-ink', dark ? paper : ink)
  root.style.setProperty('--lp-slate', slate)
  root.style.setProperty('--lp-steel', dark ? withAlpha(paper, 0.72) : '#3D4F66')
  root.style.setProperty('--lp-mist', dark ? withAlpha(paper, 0.08) : '#E8EDF3')
  root.style.setProperty('--lp-paper', dark ? ink : paper)
  root.style.setProperty('--lp-line', dark ? withAlpha(paper, 0.14) : '#D5DCE6')
  root.style.setProperty('--lp-accent', accent)
  root.style.setProperty('--lp-accent-dim', shadeHex(accent, -0.18))
  root.style.setProperty('--lp-accent-soft', withAlpha(accent, 0.12))
  root.style.setProperty('--lp-copper', copper)
  root.style.setProperty('--lp-radius', brand.aparencia === 'reta' ? '0.35rem' : '0.75rem')
  root.style.setProperty('--lp-radius-lg', brand.aparencia === 'reta' ? '0.5rem' : '0.9rem')

  root.classList.toggle('dark', dark)
  root.dataset.brandPreset = brand.presetId
  root.dataset.brandAparencia = brand.aparencia

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? ink : slate)
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
