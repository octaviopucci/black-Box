import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

export function nowISO(): string {
  return new Date().toISOString()
}

export function daysBetween(start: string, end: string = nowISO()): number {
  const a = new Date(start)
  const b = new Date(end)
  const diff = Math.abs(b.getTime() - a.getTime())
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value || 0)
}

export function formatDate(value: string): string {
  if (!value) return '—'
  const d = new Date(value.includes('T') ? value : `${value}T12:00:00`)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

export function formatDateTime(value: string): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('pt-BR')
}

export function formatPercent(value: number): string {
  return `${(value || 0).toFixed(1)}%`
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function maskCPF(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function maskPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 10) {
    return d
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return d
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

export function maskPlate(value: string): string {
  const v = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)
  if (v.length <= 3) return v
  return `${v.slice(0, 3)}-${v.slice(3)}`
}

export function maskCurrencyInput(value: string): string {
  const digits = onlyDigits(value)
  const num = Number(digits) / 100
  return formatCurrency(num)
}

export function parseCurrencyInput(value: string): number {
  const digits = onlyDigits(value)
  return Number(digits) / 100
}

export function downloadJSON(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function printElement(title: string, html: string): void {
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return
  win.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;color:#111}
      h1{font-size:20px;margin:0 0 8px}
      h2{font-size:16px;margin:16px 0 8px;border-bottom:1px solid #ddd;padding-bottom:4px}
      table{width:100%;border-collapse:collapse;margin-top:8px}
      td,th{border:1px solid #ddd;padding:8px;text-align:left;font-size:13px}
      .meta{color:#555;font-size:13px}
      img{max-width:280px;border-radius:8px}
      @media print{button{display:none}}
    </style>
  </head><body>${html}<script>window.print()</script></body></html>`)
  win.document.close()
}
